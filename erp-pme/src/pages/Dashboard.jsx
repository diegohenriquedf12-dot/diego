import { useMemo, useState } from 'react';
import {
  Wallet, TrendingUp, Package, Users, ShoppingCart,
  ArrowUpRight, ArrowDownRight, AlertTriangle, Boxes, ShoppingBag,
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, Tooltip, CartesianGrid, Cell,
} from 'recharts';
import { useERP } from '../context/ERPContext';
import { moeda, totalVenda, dataBR, nivelEstoque } from '../utils/format';
import KpiCard from '../components/ui/KpiCard';
import { ProgressBar, corPorMeta } from '../components/ui/Progress';
import { Card, PageHeader } from '../components/ui/Layout';
import Badge from '../components/ui/Badge';

const tooltipBox = {
  contentStyle: {
    borderRadius: 12,
    border: '1px solid #e2e8f0',
    fontSize: 12,
    boxShadow: '0 4px 12px rgba(15,23,42,.08)',
  },
};
const paleta = ['#FF7A00', '#22C55E', '#3B82F6', '#EF4444', '#8B5CF6', '#FACC15'];

export default function Dashboard({ irPara }) {
  const { indicadores, historico, vendas, produtos, clientes, contas, metas, atualDaMeta } = useERP();

  const ultimasVendas = vendas.slice(0, 5);
  const alertas = produtos.filter((p) => p.quantidade <= p.estoqueMinimo);

  const mesAtual = historico[historico.length - 1] || { receita: 0, despesa: 0 };
  const mesAnterior = historico[historico.length - 2] || mesAtual;
  const lucro = mesAtual.receita - mesAtual.despesa;
  const variacao = (a, b) => (b ? +(((a - b) / b) * 100).toFixed(1) : 0);

  // Card "Vendas" com filtro por mês (categoria Vendas).
  const MESES_NOMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const [mesVendas, setMesVendas] = useState('todos');
  const vendasContas = contas.filter((c) => c.tipo === 'receber' && c.categoria === 'Vendas');
  const mesesVendas = [...new Set(vendasContas.map((c) => String(c.vencimento || '').slice(0, 7)).filter((m) => m.length === 7))].sort().reverse();
  const vendasFiltrado = vendasContas
    .filter((c) => mesVendas === 'todos' || String(c.vencimento || '').slice(0, 7) === mesVendas)
    .reduce((s, c) => s + (Number(c.valor) || 0), 0);
  const rotuloMes = (ym) => `${MESES_NOMES[Number(ym.split('-')[1]) - 1]}/${ym.split('-')[0]}`;

  // Gráfico Receita x Despesa com seletor de período (24h / 7d / 30d).
  // A série é montada a partir das contas (receber/pagar) por dia de vencimento.
  const [periodo, setPeriodo] = useState('7d');
  const diasPorPeriodo = { '24h': 1, '7d': 7, '30d': 30 };
  const serieFinanceira = useMemo(() => {
    const dias = diasPorPeriodo[periodo] || 7;
    const qtdPontos = Math.max(dias, 2); // garante uma linha mesmo no 24h
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    const pontos = [];
    for (let i = qtdPontos - 1; i >= 0; i--) {
      const d = new Date(base);
      d.setDate(base.getDate() - i);
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const receita = contas
        .filter((c) => c.tipo === 'receber' && c.vencimento === iso)
        .reduce((s, c) => s + (Number(c.valor) || 0), 0);
      const despesa = contas
        .filter((c) => c.tipo === 'pagar' && c.vencimento === iso)
        .reduce((s, c) => s + (Number(c.valor) || 0), 0);
      pontos.push({
        rotulo: `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`,
        receita,
        despesa,
      });
    }
    return pontos;
  }, [contas, periodo]);

  const categorias = Object.values(
    produtos.reduce((acc, p) => {
      acc[p.categoria] = acc[p.categoria] || { categoria: p.categoria, valor: 0 };
      acc[p.categoria].valor += p.custo * p.quantidade;
      return acc;
    }, {})
  );

  // Despesas por categoria com filtro de mês. Sem o filtro, o total somava
  // todos os meses juntos (ex.: aluguel lançado em cada mês aparecia
  // multiplicado). Começa no mês atual.
  const [mesDespesas, setMesDespesas] = useState(() => new Date().toISOString().slice(0, 7));
  const contasPagar = contas.filter((c) => c.tipo === 'pagar');
  const mesesDespesas = [...new Set(contasPagar.map((c) => String(c.vencimento || '').slice(0, 7)).filter((m) => m.length === 7))].sort().reverse();
  const mesDespesasEfetivo = mesDespesas !== 'todos' && !mesesDespesas.includes(mesDespesas) ? 'todos' : mesDespesas;
  // Agrupa ignorando maiúsculas/minúsculas e espaços extras, para que
  // "Compras", "compras" e "Compras " virem uma categoria só no gráfico.
  const despesasCat = Object.values(
    contasPagar
      .filter((c) => mesDespesasEfetivo === 'todos' || String(c.vencimento || '').slice(0, 7) === mesDespesasEfetivo)
      .reduce((acc, c) => {
        const bruto = String(c.categoria || 'Outros').trim() || 'Outros';
        const chave = bruto.toLowerCase();
        const nome = bruto.charAt(0).toUpperCase() + bruto.slice(1);
        acc[chave] = acc[chave] || { nome, valor: 0 };
        acc[chave].valor += Number(c.valor) || 0;
        return acc;
      }, {})
  );

  const metasResumo = metas
    .map((m) => {
      const atual = atualDaMeta(m);
      return { ...m, atual, pct: m.alvo > 0 ? Math.round((atual / m.alvo) * 100) : 0 };
    })
    .slice(0, 4);

  return (
    <div>
      {/* Faixa de boas-vindas */}
      <div className="relative mb-6 overflow-hidden rounded-2xl border border-line bg-card p-6 shadow-card">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-accent/15 via-transparent to-transparent" />
        <div className="relative">
          <p className="text-sm text-muted">Bem-vindo de volta, Diego 👋</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink">Dashboard Executivo</h1>
          <p className="mt-1 text-sm text-muted">Visão geral consolidada — junho de 2026.</p>
        </div>
      </div>

      {/* KPIs com contagem animada e cor por desempenho */}
      <div className="grid grid-cols-1 gap-4 stagger sm:grid-cols-2 xl:grid-cols-4">
        <div className="card-lift group animate-fade-up rounded-2xl border border-line bg-card p-5 shadow-card">
          <div className="flex items-start justify-between gap-2">
            <select
              value={mesVendas}
              onChange={(e) => setMesVendas(e.target.value)}
              className="max-w-[130px] rounded-md border border-line bg-card2 px-1.5 py-1 text-xs font-medium text-muted focus:border-accent focus:outline-none"
            >
              <option value="todos">Vendas (total)</option>
              {mesesVendas.map((m) => <option key={m} value={m}>Vendas {rotuloMes(m)}</option>)}
            </select>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-pos/15 text-pos transition-transform duration-300 group-hover:scale-110">
              <ShoppingCart size={19} />
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-ink tabular-nums">{moeda(vendasFiltrado)}</p>
          <p className="mt-2 text-xs text-muted">{mesVendas === 'todos' ? 'Todas as vendas' : rotuloMes(mesVendas)}</p>
        </div>
        <KpiCard icone={TrendingUp} tom="blue" label="Lucro do mês" valor={lucro} formato={(n) => moeda(n)} variacao={variacao(lucro, mesAnterior.receita - mesAnterior.despesa)} />
        <KpiCard icone={ShoppingBag} tom="amber" label="Compras (Distribuidora Siqueira Bikes)" valor={indicadores.compras} formato={(n) => moeda(n)} />
        <KpiCard icone={Wallet} tom="violet" label="Saldo em caixa" valor={indicadores.saldo} formato={(n) => moeda(n)} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 stagger sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard icone={Users} tom="blue" label="Clientes ativos" valor={indicadores.totalClientes} />
        <KpiCard icone={ShoppingCart} tom="amber" label="Pedidos em andamento" valor={indicadores.pedidosAndamento} alerta={indicadores.pedidosAndamento > 0} />
        <KpiCard icone={Boxes} tom="emerald" label="Produtos cadastrados" valor={indicadores.totalProdutos} />
        <KpiCard icone={Package} tom={indicadores.estoqueBaixo ? 'rose' : 'slate'} label="Estoque baixo" valor={indicadores.estoqueBaixo} alerta={indicadores.estoqueBaixo > 0} />
      </div>

      {/* Gráficos principais */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-ink">Receita x Despesa</h3>
              <p className="text-xs text-muted">
                {periodo === '24h' ? 'Últimas 24 horas' : periodo === '7d' ? 'Últimos 7 dias' : 'Últimos 30 dias'}
              </p>
            </div>
            <div className="flex gap-1 rounded-lg bg-card2 p-1">
              {['24h', '7d', '30d'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriodo(p)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    periodo === p ? 'bg-accent text-accent-ink shadow' : 'text-muted hover:text-ink'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={serieFinanceira} margin={{ left: -18, right: 8 }}>
              <defs>
                <linearGradient id="gRec" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF7A00" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#FF7A00" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gDes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#71717a" strokeOpacity={0.2} vertical={false} />
              <XAxis dataKey="rotulo" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} minTickGap={16} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip {...tooltipBox} formatter={(v) => moeda(v)} />
              <Area type="monotone" dataKey="receita" stroke="#FF7A00" strokeWidth={2.5} fill="url(#gRec)" name="Receita" animationDuration={900} />
              <Area type="monotone" dataKey="despesa" stroke="#EF4444" strokeWidth={2.5} fill="url(#gDes)" name="Despesa" animationDuration={1100} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-ink">Despesas por categoria</h3>
            <select
              value={mesDespesasEfetivo}
              onChange={(e) => setMesDespesas(e.target.value)}
              className="rounded-md border border-line bg-card2 px-1.5 py-1 text-xs font-medium text-muted focus:border-accent focus:outline-none"
            >
              <option value="todos">Todos os meses</option>
              {mesesDespesas.map((m) => <option key={m} value={m}>{rotuloMes(m)}</option>)}
            </select>
          </div>
          <p className="mb-2 text-xs text-muted">{mesDespesasEfetivo === 'todos' ? 'Soma de todos os meses' : `Contas a pagar de ${rotuloMes(mesDespesasEfetivo)}`}</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={despesasCat} dataKey="valor" nameKey="nome" cx="50%" cy="50%" innerRadius={48} outerRadius={80} paddingAngle={3} animationDuration={900}>
                {despesasCat.map((_, i) => <Cell key={i} fill={paleta[i % paleta.length]} />)}
              </Pie>
              <Tooltip {...tooltipBox} formatter={(v) => moeda(v)} />
            </PieChart>
          </ResponsiveContainer>
          <ul className="mt-2 space-y-1">
            {despesasCat.map((d, i) => (
              <li key={d.nome} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-muted">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: paleta[i % paleta.length] }} />
                  {d.nome}
                </span>
                <span className="font-medium text-ink">{moeda(d.valor)}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Metas + estoque por categoria */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink">Metas do mês</h3>
            <button onClick={() => irPara('metas')} className="text-xs font-medium text-accent hover:text-accent">Ver metas</button>
          </div>
          <div className="space-y-4">
            {metasResumo.map((m) => (
              <div key={m.id}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium text-muted">{m.titulo}</span>
                  <span className={m.pct >= 100 ? 'font-semibold text-emerald-600' : 'text-muted'}>{m.pct}%</span>
                </div>
                <ProgressBar valor={m.pct} tom={corPorMeta(m.pct)} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-ink">Estoque por categoria</h3>
          <p className="mb-4 text-xs text-muted">Valor a custo</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categorias} layout="vertical" margin={{ left: 10, right: 10 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="categoria" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={84} />
              <Tooltip {...tooltipBox} formatter={(v) => moeda(v)} cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="valor" radius={[0, 6, 6, 0]} barSize={22} animationDuration={900}>
                {categorias.map((_, i) => <Cell key={i} fill={paleta[i % paleta.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Listas */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h3 className="text-sm font-semibold text-ink">Vendas recentes</h3>
            <button onClick={() => irPara('vendas')} className="text-xs font-medium text-accent hover:text-accent">Ver todas</button>
          </div>
          <ul className="divide-y divide-line">
            {ultimasVendas.map((v) => {
              const cliente = clientes.find((c) => c.id === v.clienteId);
              return (
                <li key={v.id} className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-card2">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600"><ArrowUpRight size={16} /></span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{cliente?.nome || 'Cliente'}</p>
                    <p className="text-xs text-muted">#{v.id.replace('v', '')} · {dataBR(v.data)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-ink">{moeda(totalVenda(v))}</p>
                    <Badge status={v.status} />
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card>
          <div className="flex items-center gap-2 border-b border-line px-5 py-4">
            <AlertTriangle size={16} className={alertas.length ? 'animate-pulse-alert text-amber-500' : 'text-muted'} />
            <h3 className="text-sm font-semibold text-ink">Alertas de estoque</h3>
          </div>
          {alertas.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-muted">Nenhum produto abaixo do mínimo.</p>
          ) : (
            <ul className="divide-y divide-line">
              {alertas.map((p) => (
                <li key={p.id} className="flex items-center justify-between px-5 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{p.nome}</p>
                    <p className="text-xs text-muted">Mín. {p.estoqueMinimo} {p.unidade}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-ink">{p.quantidade}</span>
                    <Badge status={nivelEstoque(p)} />
                  </div>
                </li>
              ))}
            </ul>
          )}
          <button onClick={() => irPara('estoque')} className="flex w-full items-center justify-center gap-1 border-t border-line px-5 py-3 text-xs font-medium text-accent hover:bg-card2">
            Gerenciar estoque <ArrowDownRight size={13} />
          </button>
        </Card>
      </div>
    </div>
  );
}
