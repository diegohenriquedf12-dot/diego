import { createContext, useContext, useMemo, useState } from 'react';
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
} from '../data/seed';
import { novoId, totalVenda } from '../utils/format';

const ERPContext = createContext(null);

export function ERPProvider({ children }) {
  const [clientes, setClientes] = useState(clientesSeed);
  const [fornecedores, setFornecedores] = useState(fornecedoresSeed);
  const [produtos, setProdutos] = useState(produtosSeed);
  const [vendas, setVendas] = useState(vendasSeed);
  const [contas, setContas] = useState(contasSeed);
  const [historico] = useState(historicoSeed);
  const [pedidos, setPedidos] = useState(pedidosSeed);
  const [funcionarios, setFuncionarios] = useState(funcionariosSeed);
  const [metas, setMetas] = useState(metasSeed);
  const [eventos, setEventos] = useState(eventosSeed);

  // ---- CRUD genérico por coleção ----
  const upsert = (setter, prefixo) => (registro) =>
    setter((lista) => {
      if (registro.id) {
        return lista.map((r) => (r.id === registro.id ? { ...r, ...registro } : r));
      }
      return [{ ...registro, id: novoId(prefixo) }, ...lista];
    });

  const remover = (setter) => (id) =>
    setter((lista) => lista.filter((r) => r.id !== id));

  // ---- Vendas: baixa de estoque + lançamento financeiro ----
  const salvarVenda = (venda) => {
    const total = totalVenda(venda);
    const id = venda.id || 'v' + Math.floor(1005 + Math.random() * 8000);
    const completa = { ...venda, id, total };

    setVendas((lista) =>
      venda.id ? lista.map((v) => (v.id === venda.id ? completa : v)) : [completa, ...lista]
    );

    // Baixa de estoque apenas em vendas novas e não canceladas
    if (!venda.id && venda.status !== 'cancelado') {
      setProdutos((lista) =>
        lista.map((p) => {
          const item = venda.itens.find((i) => i.produtoId === p.id);
          return item ? { ...p, quantidade: Math.max(0, p.quantidade - item.qtd) } : p;
        })
      );
      const cliente = clientes.find((c) => c.id === venda.clienteId);
      setContas((lista) => [
        {
          id: novoId('t'),
          tipo: 'receber',
          descricao: `Venda #${id.replace('v', '')} — ${cliente?.nome || 'Cliente'}`,
          valor: total,
          vencimento: venda.data,
          status: venda.status === 'pago' ? 'pago' : 'pendente',
          categoria: 'Vendas',
        },
        ...lista,
      ]);
    }
  };

  const quitarConta = (id) =>
    setContas((lista) => lista.map((c) => (c.id === id ? { ...c, status: 'pago' } : c)));

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
    salvarCliente: upsert(setClientes, 'c'),
    removerCliente: remover(setClientes),
    salvarFornecedor: upsert(setFornecedores, 'f'),
    removerFornecedor: remover(setFornecedores),
    salvarProduto: upsert(setProdutos, 'p'),
    removerProduto: remover(setProdutos),
    salvarConta: upsert(setContas, 't'),
    removerConta: remover(setContas),
    salvarPedido: upsert(setPedidos, 'pd'),
    removerPedido: remover(setPedidos),
    salvarFuncionario: upsert(setFuncionarios, 'e'),
    removerFuncionario: remover(setFuncionarios),
    salvarMeta: upsert(setMetas, 'm'),
    removerMeta: remover(setMetas),
    salvarEvento: upsert(setEventos, 'ag'),
    removerEvento: remover(setEventos),
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
