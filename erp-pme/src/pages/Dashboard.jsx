import {
  Wallet,
  TrendingUp,
  Package,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { useERP } from '../context/ERPContext';
import { moeda, totalVenda, dataBR, nivelEstoque } from '../utils/format';
import StatCard from '../components/ui/StatCard';
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

export default function Dashboard({ irPara }) {
  const { indicadores, historico, vendas, produtos, clientes } = useERP();

  const ultimasVendas = vendas.slice(0, 5);
  const alertas = produtos.filter((p) => p.quantidade <= p.estoqueMinimo);

  const categorias = Object.values(
    produtos.reduce((acc, p) => {
      acc[p.categoria] = acc[p.categoria] || { categoria: p.categoria, valor: 0 };
      acc[p.categoria].valor += p.custo * p.quantidade;
      return acc;
    }, {})
  );
  const paleta = ['#059669', '#0ea5e9', '#f59e0b', '#8b5cf6', '#ef4444'];

  return (
    <div>
      <PageHeader
        titulo="Dashboard"
        descricao="Visão geral do desempenho da sua empresa em junho de 2026."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icone={Wallet} tom="emerald" label="Saldo em caixa" valor={moeda(indicadores.saldo)} variacao={12.4} />
        <StatCard icone={TrendingUp} tom="blue" label="Total recebido" valor={moeda(indicadores.recebido)} variacao={8.1} />
        <StatCard icone={Package} tom="amber" label="Valor em estoque" valor={moeda(indicadores.valorEstoque)} variacao={-3.2} />
        <StatCard icone={Users} tom="slate" label="Clientes ativos" valor={indicadores.totalClientes} variacao={5.0} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-900">Receita x Despesa</h3>
          <p className="mb-4 text-xs text-slate-500">Últimos 6 meses</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={historico} margin={{ left: -18, right: 8 }}>
              <defs>
                <linearGradient id="gRec" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gDes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip {...tooltipBox} formatter={(v) => moeda(v)} />
              <Area type="monotone" dataKey="receita" stroke="#059669" strokeWidth={2} fill="url(#gRec)" name="Receita" />
              <Area type="monotone" dataKey="despesa" stroke="#f43f5e" strokeWidth={2} fill="url(#gDes)" name="Despesa" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-900">Estoque por categoria</h3>
          <p className="mb-4 text-xs text-slate-500">Valor a custo</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categorias} layout="vertical" margin={{ left: 10, right: 10 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="categoria" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={84} />
              <Tooltip {...tooltipBox} formatter={(v) => moeda(v)} cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="valor" radius={[0, 6, 6, 0]} barSize={22}>
                {categorias.map((_, i) => (
                  <Cell key={i} fill={paleta[i % paleta.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-900">Vendas recentes</h3>
            <button onClick={() => irPara('vendas')} className="text-xs font-medium text-emerald-600 hover:text-emerald-700">
              Ver todas
            </button>
          </div>
          <ul className="divide-y divide-slate-100">
            {ultimasVendas.map((v) => {
              const cliente = clientes.find((c) => c.id === v.clienteId);
              return (
                <li key={v.id} className="flex items-center gap-3 px-5 py-3">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                    <ArrowUpRight size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">{cliente?.nome || 'Cliente'}</p>
                    <p className="text-xs text-slate-500">#{v.id.replace('v', '')} · {dataBR(v.data)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">{moeda(totalVenda(v))}</p>
                    <Badge status={v.status} />
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card>
          <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
            <AlertTriangle size={16} className="text-amber-500" />
            <h3 className="text-sm font-semibold text-slate-900">Alertas de estoque</h3>
          </div>
          {alertas.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-500">Nenhum produto abaixo do mínimo.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {alertas.map((p) => (
                <li key={p.id} className="flex items-center justify-between px-5 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">{p.nome}</p>
                    <p className="text-xs text-slate-500">Mín. {p.estoqueMinimo} {p.unidade}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">{p.quantidade}</span>
                    <Badge status={nivelEstoque(p)} />
                  </div>
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={() => irPara('estoque')}
            className="flex w-full items-center justify-center gap-1 border-t border-slate-100 px-5 py-3 text-xs font-medium text-emerald-600 hover:bg-slate-50"
          >
            Gerenciar estoque <ArrowDownRight size={13} />
          </button>
        </Card>
      </div>
    </div>
  );
}
