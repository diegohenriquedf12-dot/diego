import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  clientesSeed,
  fornecedoresSeed,
  produtosSeed,
  vendasSeed,
  contasSeed,
  historicoSeed,
  pedidosSeed,
  funcionariosSeed,
  metasSeed,
  eventosSeed,
  contasImportadasPdf,
  IMPORT_CONTAS_PDF_FLAG,
} from '../data/seed';
import { novoId, totalVenda } from '../utils/format';
import { supabase, supabaseAtivo } from '../lib/supabase';
import { useAuth } from './AuthContext';

const ERPContext = createContext(null);

// Estado em cache no navegador (localStorage) — também é o fallback quando
// não há back-end (Supabase) configurado.
function useColecaoPersistida(chave, inicial) {
  const id = `erp:${chave}`;
  const [valor, setValor] = useState(() => {
    try {
      const salvo = localStorage.getItem(id);
      return salvo ? JSON.parse(salvo) : inicial;
    } catch {
      return inicial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(id, JSON.stringify(valor));
    } catch {
      /* ignora cota/erros de storage */
    }
  }, [id, valor]);
  return [valor, setValor];
}

export function ERPProvider({ children }) {
  const { somenteLeitura } = useAuth();
  const [clientes, setClientes] = useColecaoPersistida('clientes', clientesSeed);
  const [fornecedores, setFornecedores] = useColecaoPersistida('fornecedores', fornecedoresSeed);
  const [produtos, setProdutos] = useColecaoPersistida('produtos', produtosSeed);
  const [vendas, setVendas] = useColecaoPersistida('vendas', vendasSeed);
  const [contas, setContas] = useColecaoPersistida('contas', contasSeed);
  const [historico] = useState(historicoSeed);
  const [pedidos, setPedidos] = useColecaoPersistida('pedidos', pedidosSeed);
  const [funcionarios, setFuncionarios] = useColecaoPersistida('funcionarios', funcionariosSeed);
  const [metas, setMetas] = useColecaoPersistida('metas', metasSeed);
  const [eventos, setEventos] = useColecaoPersistida('eventos', eventosSeed);

  // ---- Sincronização com o Supabase (no-op quando não configurado) ----
  // Esquema das tabelas: id text (PK), dados jsonb, atualizado_em timestamptz.
  const sincronizar = (tabela, registro) => {
    if (!supabaseAtivo) return;
    supabase
      .from(tabela)
      .upsert({ id: registro.id, dados: registro, atualizado_em: new Date().toISOString() })
      .then(({ error }) => error && console.warn(`Supabase upsert ${tabela}:`, error.message))
      .catch((e) => console.warn(`Supabase upsert ${tabela}:`, e?.message || e));
  };
  const removerRemoto = (tabela, id) => {
    if (!supabaseAtivo) return;
    supabase
      .from(tabela)
      .delete()
      .eq('id', id)
      .then(({ error }) => error && console.warn(`Supabase delete ${tabela}:`, error.message))
      .catch((e) => console.warn(`Supabase delete ${tabela}:`, e?.message || e));
  };

  // Ao iniciar com Supabase ativo, carrega cada tabela e substitui o cache local.
  useEffect(() => {
    if (!supabaseAtivo) return;
    const setters = {
      clientes: setClientes,
      fornecedores: setFornecedores,
      produtos: setProdutos,
      vendas: setVendas,
      contas: setContas,
      pedidos: setPedidos,
      funcionarios: setFuncionarios,
      metas: setMetas,
      eventos: setEventos,
    };
    (async () => {
      for (const [tabela, set] of Object.entries(setters)) {
        try {
          const { data, error } = await supabase
            .from(tabela)
            .select('id,dados')
            .order('atualizado_em', { ascending: false });
          if (error) {
            console.warn(`Supabase load ${tabela}:`, error.message);
            continue;
          }
          if (data) set(data.map((r) => ({ id: r.id, ...r.dados })));
        } catch (e) {
          console.warn(`Supabase load ${tabela}:`, e?.message || e);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Importação única dos PDFs de venda como contas a pagar (roda uma vez).
  useEffect(() => {
    try {
      if (localStorage.getItem(IMPORT_CONTAS_PDF_FLAG)) return;
    } catch {
      return;
    }
    const existentes = new Set(contas.map((c) => c.id));
    const novos = contasImportadasPdf.filter((c) => !existentes.has(c.id));
    if (novos.length) {
      setContas((lista) => [...novos.filter((n) => !lista.some((l) => l.id === n.id)), ...lista]);
      novos.forEach((c) => sincronizar('contas', c));
    }
    try {
      localStorage.setItem(IMPORT_CONTAS_PDF_FLAG, '1');
    } catch {
      /* ignora */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- CRUD genérico por coleção (estado local + Supabase) ----
  // Convidado (somente leitura) não pode alterar dados.
  const upsert = (setter, prefixo, tabela) => (registro) => {
    if (somenteLeitura) return null;
    const completo = registro.id ? registro : { ...registro, id: novoId(prefixo) };
    setter((lista) =>
      registro.id
        ? lista.map((r) => (r.id === completo.id ? { ...r, ...completo } : r))
        : [completo, ...lista]
    );
    sincronizar(tabela, completo);
    return completo;
  };

  const remover = (setter, tabela) => (id) => {
    if (somenteLeitura) return;
    setter((lista) => lista.filter((r) => r.id !== id));
    removerRemoto(tabela, id);
  };

  // ---- Vendas: baixa de estoque + lançamento financeiro ----
  const salvarVenda = (venda) => {
    if (somenteLeitura) return;
    const total = totalVenda(venda);
    const id = venda.id || 'v' + Math.floor(1005 + Math.random() * 8000);
    const completa = { ...venda, id, total };

    setVendas((lista) =>
      venda.id ? lista.map((v) => (v.id === venda.id ? completa : v)) : [completa, ...lista]
    );
    sincronizar('vendas', completa);

    // Baixa de estoque apenas em vendas novas e não canceladas
    if (!venda.id && venda.status !== 'cancelado') {
      const afetados = produtos
        .filter((p) => venda.itens.some((i) => i.produtoId === p.id))
        .map((p) => {
          const item = venda.itens.find((i) => i.produtoId === p.id);
          return { ...p, quantidade: Math.max(0, p.quantidade - item.qtd) };
        });
      setProdutos((lista) => lista.map((p) => afetados.find((a) => a.id === p.id) || p));
      afetados.forEach((p) => sincronizar('produtos', p));

      const cliente = clientes.find((c) => c.id === venda.clienteId);
      const conta = {
        id: novoId('t'),
        tipo: 'receber',
        descricao: `Venda #${id.replace('v', '')} — ${cliente?.nome || 'Cliente'}`,
        valor: total,
        vencimento: venda.data,
        status: venda.status === 'pago' ? 'pago' : 'pendente',
        categoria: 'Vendas',
      };
      setContas((lista) => [conta, ...lista]);
      sincronizar('contas', conta);
    }
  };

  const quitarConta = (id) => {
    if (somenteLeitura) return;
    setContas((lista) => lista.map((c) => (c.id === id ? { ...c, status: 'pago' } : c)));
    const conta = contas.find((c) => c.id === id);
    if (conta) sincronizar('contas', { ...conta, status: 'pago' });
  };

  // ---- Indicadores derivados ----
  const indicadores = useMemo(() => {
    const recebido = contas
      .filter((c) => c.tipo === 'receber' && c.status === 'pago')
      .reduce((s, c) => s + c.valor, 0);
    const pago = contas
      .filter((c) => c.tipo === 'pagar' && c.status === 'pago')
      .reduce((s, c) => s + c.valor, 0);
    const aReceber = contas
      .filter((c) => c.tipo === 'receber' && c.status !== 'pago')
      .reduce((s, c) => s + c.valor, 0);
    const aPagar = contas
      .filter((c) => c.tipo === 'pagar' && c.status !== 'pago')
      .reduce((s, c) => s + c.valor, 0);
    const valorEstoque = produtos.reduce((s, p) => s + p.custo * p.quantidade, 0);
    const estoqueBaixo = produtos.filter((p) => p.quantidade <= p.estoqueMinimo).length;
    const pedidosAndamento = pedidos.filter(
      (p) => p.status !== 'entregue' && p.status !== 'cancelado'
    ).length;
    const pedidosEntregues = pedidos.filter((p) => p.status === 'entregue').length;
    const folha = funcionarios
      .filter((f) => f.status === 'ativo')
      .reduce((s, f) => s + f.salario, 0);

    return {
      recebido,
      pago,
      saldo: recebido - pago,
      aReceber,
      aPagar,
      valorEstoque,
      estoqueBaixo,
      totalClientes: clientes.filter((c) => c.status === 'ativo').length,
      totalVendas: vendas.filter((v) => v.status !== 'cancelado').length,
      totalProdutos: produtos.length,
      produtosEmFalta: produtos.filter((p) => p.quantidade <= 0).length,
      pedidosAndamento,
      pedidosEntregues,
      totalFuncionarios: funcionarios.filter((f) => f.status === 'ativo').length,
      folha,
    };
  }, [contas, produtos, clientes, vendas, pedidos, funcionarios]);

  // ---- Métricas do mês corrente (para metas automáticas) ----
  // entradas = contas a receber; saídas = contas a pagar; lucro = entradas − saídas.
  // (Vendas já lançam contas a receber, então entram na "receita".)
  const metricasMes = useMemo(() => {
    const mesAtual = new Date().toISOString().slice(0, 7); // AAAA-MM
    const noMes = (iso) => typeof iso === 'string' && iso.slice(0, 7) === mesAtual;
    const entradas = contas
      .filter((c) => c.tipo === 'receber' && noMes(c.vencimento))
      .reduce((s, c) => s + (Number(c.valor) || 0), 0);
    const saidas = contas
      .filter((c) => c.tipo === 'pagar' && noMes(c.vencimento))
      .reduce((s, c) => s + (Number(c.valor) || 0), 0);
    const vendasMes = vendas.filter((v) => v.status !== 'cancelado' && noMes(v.data)).length;
    return { receita: entradas, despesas: saidas, lucro: entradas - saidas, vendas: vendasMes };
  }, [contas, vendas]);

  // "atual" efetivo de uma meta: automático (via fonte) ou o valor manual.
  const atualDaMeta = (m) =>
    m && m.fonte && m.fonte !== 'manual' && metricasMes[m.fonte] != null
      ? metricasMes[m.fonte]
      : Number(m?.atual) || 0;

  const value = {
    clientes,
    fornecedores,
    produtos,
    vendas,
    contas,
    historico,
    pedidos,
    funcionarios,
    metas,
    eventos,
    indicadores,
    metricasMes,
    atualDaMeta,
    somenteLeitura,
    backendAtivo: supabaseAtivo,
    salvarCliente: upsert(setClientes, 'c', 'clientes'),
    removerCliente: remover(setClientes, 'clientes'),
    salvarFornecedor: upsert(setFornecedores, 'f', 'fornecedores'),
    removerFornecedor: remover(setFornecedores, 'fornecedores'),
    salvarProduto: upsert(setProdutos, 'p', 'produtos'),
    removerProduto: remover(setProdutos, 'produtos'),
    salvarConta: upsert(setContas, 't', 'contas'),
    removerConta: remover(setContas, 'contas'),
    salvarPedido: upsert(setPedidos, 'pd', 'pedidos'),
    removerPedido: remover(setPedidos, 'pedidos'),
    salvarFuncionario: upsert(setFuncionarios, 'e', 'funcionarios'),
    removerFuncionario: remover(setFuncionarios, 'funcionarios'),
    salvarMeta: upsert(setMetas, 'm', 'metas'),
    removerMeta: remover(setMetas, 'metas'),
    salvarEvento: upsert(setEventos, 'ag', 'eventos'),
    removerEvento: remover(setEventos, 'eventos'),
    salvarVenda,
    quitarConta,
  };

  return <ERPContext.Provider value={value}>{children}</ERPContext.Provider>;
}

export const useERP = () => {
  const ctx = useContext(ERPContext);
  if (!ctx) throw new Error('useERP precisa estar dentro de <ERPProvider>');
  return ctx;
};
