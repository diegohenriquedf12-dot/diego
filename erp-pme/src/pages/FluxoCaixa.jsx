import { useMemo } from 'react';
import { ArrowUpCircle, ArrowDownCircle, TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { useERP } from '../context/ERPContext';
import { moeda, dataBR } from '../utils/format';
import { PageHeader, Card } from '../components/ui/Layout';
import DataTable from '../components/ui/DataTable';

export default function FluxoCaixa() {
  const { contas, historico } = useERP();

  // Movimentações realizadas (contas pagas), ordenadas por data
  const movimentos = useMemo(() => {
    const pagas = contas
      .filter((c) => c.status === 'pago')
      .map((c) => ({
        id: c.id,
        data: c.vencimento,
        descricao: c.descricao,
        tipo: c.tipo === 'receber' ? 'entrada' : 'saida',
        valor: c.valor,
      }))
      .sort((a, b) => a.data.localeCompare(b.data));

    let saldo = 0;
    return pagas.map((m) => {
      saldo += m.tipo === 'entrada' ? m.valor : -m.valor;
      return { ...m, saldo };
    });
  }, [contas]);

  const entradas = movimentos.filter((m) => m.tipo === 'entrada').reduce((s, m) => s + m.valor, 0);
  const saidas = movimentos.filter((m) => m.tipo === 'saida').reduce((s, m) => s + m.valor, 0);
  const saldoAtual = entradas - saidas;

  const grafico = historico.map((h) => ({ mes: h.mes, saldo: h.receita - h.despesa }));

  const colunas = [
    { chave: 'data', titulo: 'Data', render: (m) => dataBR(m.data) },
    { chave: 'descricao', titulo: 'Movimentação', render: (m) => (
      <span className="inline-flex items-center gap-2">
        {m.tipo === 'entrada'
          ? <ArrowUpCircle size={16} className="text-emerald-500" />
          : <ArrowDownCircle size={16} className="text-rose-500" />}
        <span className="font-medium text-slate-900">{m.descricao}</span>
      </span>
    ) },
    { chave: 'entrada', titulo: 'Entrada', alinhar: 'right', render: (m) => m.tipo === 'entrada' ? <span className="font-medium text-emerald-600">{moeda(m.valor)}</span> : <span className="text-slate-300">—</span> },
    { chave: 'saida', titulo: 'Saída', alinhar: 'right', render: (m) => m.tipo === 'saida' ? <span className="font-medium text-rose-600">{moeda(m.valor)}</span> : <span className="text-slate-300">—</span> },
    { chave: 'saldo', titulo: 'Saldo', alinhar: 'right', render: (m) => <span className={`font-semibold ${m.saldo >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>{moeda(m.saldo)}</span> },
  ];

  return (
    <div>
      <PageHeader titulo="Fluxo de caixa" descricao="Entradas e saídas efetivamente realizadas" />

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center gap-2 text-emerald-600"><ArrowUpCircle size={18} /><span className="text-sm font-medium text-slate-500">Entradas</span></div>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{moeda(entradas)}</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-rose-600"><ArrowDownCircle size={18} /><span className="text-sm font-medium text-slate-500">Saídas</span></div>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{moeda(saidas)}</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-slate-700"><TrendingUp size={18} /><span className="text-sm font-medium text-slate-500">Saldo atual</span></div>
          <p className={`mt-2 text-2xl font-semibold ${saldoAtual >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{moeda(saldoAtual)}</p>
        </Card>
      </div>

      <Card className="mb-4 p-5">
        <h3 className="text-sm font-semibold text-slate-900">Saldo mensal</h3>
        <p className="mb-4 text-xs text-slate-500">Receita menos despesa por mês</p>
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart data={grafico} margin={{ left: -12, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} formatter={(v) => moeda(v)} cursor={{ fill: '#f8fafc' }} />
            <Bar dataKey="saldo" radius={[6, 6, 0, 0]} barSize={34}>
              {grafico.map((g, i) => <Cell key={i} fill={g.saldo >= 0 ? '#059669' : '#f43f5e'} />)}
            </Bar>
            <Line type="monotone" dataKey="saldo" stroke="#0f172a" strokeWidth={2} dot={{ r: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <div className="border-b border-slate-100 px-5 py-4"><h3 className="text-sm font-semibold text-slate-900">Extrato de movimentações</h3></div>
        <DataTable colunas={colunas} dados={movimentos} />
      </Card>
    </div>
  );
}
