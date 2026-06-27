import { useMemo } from 'react';
import { Download, FileBarChart, Trophy } from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useERP } from '../context/ERPContext';
import { moeda, totalVenda } from '../utils/format';
import { PageHeader, Card } from '../components/ui/Layout';
import Button from '../components/ui/Button';

const paleta = ['#059669', '#0ea5e9', '#f59e0b', '#8b5cf6', '#ef4444', '#14b8a6'];

export default function Relatorios() {
  const { vendas, clientes, produtos, contas } = useERP();

  const validas = vendas.filter((v) => v.status !== 'cancelado');

  // Faturamento por cliente
  const porCliente = useMemo(() => {
    const map = {};
    validas.forEach((v) => {
      const nome = clientes.find((c) => c.id === v.clienteId)?.nome || 'Outros';
      map[nome] = (map[nome] || 0) + totalVenda(v);
    });
    return Object.entries(map).map(([nome, valor]) => ({ nome, valor })).sort((a, b) => b.valor - a.valor);
  }, [validas, clientes]);

  // Produtos mais vendidos (por quantidade)
  const topProdutos = useMemo(() => {
    const map = {};
    validas.forEach((v) => v.itens.forEach((i) => {
      const nome = produtos.find((p) => p.id === i.produtoId)?.nome || 'Produto';
      map[nome] = (map[nome] || 0) + i.qtd;
    }));
    return Object.entries(map).map(([nome, qtd]) => ({ nome, qtd })).sort((a, b) => b.qtd - a.qtd).slice(0, 5);
  }, [validas, produtos]);

  // Despesas por categoria
  const despesas = useMemo(() => {
    const map = {};
    contas.filter((c) => c.tipo === 'pagar').forEach((c) => {
      map[c.categoria] = (map[c.categoria] || 0) + c.valor;
    });
    return Object.entries(map).map(([categoria, valor]) => ({ categoria, valor }));
  }, [contas]);

  const faturamento = validas.reduce((s, v) => s + totalVenda(v), 0);
  const ticketMedio = validas.length ? faturamento / validas.length : 0;

  const exportarCSV = () => {
    const linhas = [['Pedido', 'Cliente', 'Data', 'Status', 'Total']];
    vendas.forEach((v) => {
      const cliente = clientes.find((c) => c.id === v.clienteId)?.nome || '';
      linhas.push([v.id, cliente, v.data, v.status, totalVenda(v).toFixed(2)]);
    });
    const csv = linhas.map((l) => l.join(';')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'relatorio-vendas.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHeader
        titulo="Relatórios"
        descricao="Indicadores de vendas, produtos e despesas"
        acao={<Button variant="secondary" onClick={exportarCSV}><Download size={16} /> Exportar CSV</Button>}
      />

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5"><p className="text-sm font-medium text-muted">Faturamento total</p><p className="mt-1 text-2xl font-semibold text-emerald-600">{moeda(faturamento)}</p></Card>
        <Card className="p-5"><p className="text-sm font-medium text-muted">Ticket médio</p><p className="mt-1 text-2xl font-semibold text-ink">{moeda(ticketMedio)}</p></Card>
        <Card className="p-5"><p className="text-sm font-medium text-muted">Pedidos válidos</p><p className="mt-1 text-2xl font-semibold text-ink">{validas.length}</p></Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold text-ink">Faturamento por cliente</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={porCliente} dataKey="valor" nameKey="nome" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2}>
                {porCliente.map((_, i) => <Cell key={i} fill={paleta[i % paleta.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => moeda(v)} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold text-ink">Despesas por categoria</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={despesas} margin={{ left: -16, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="categoria" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} interval={0} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip formatter={(v) => moeda(v)} cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Bar dataKey="valor" fill="#f43f5e" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="mt-4">
        <div className="flex items-center gap-2 border-b border-line px-5 py-4">
          <Trophy size={16} className="text-amber-500" />
          <h3 className="text-sm font-semibold text-ink">Produtos mais vendidos</h3>
        </div>
        <ul className="divide-y divide-line">
          {topProdutos.map((p, i) => {
            const max = topProdutos[0]?.qtd || 1;
            return (
              <li key={p.nome} className="flex items-center gap-4 px-5 py-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-card2 text-xs font-semibold text-muted">{i + 1}</span>
                <span className="w-40 shrink-0 truncate text-sm font-medium text-ink">{p.nome}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-card2">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${(p.qtd / max) * 100}%` }} />
                </div>
                <span className="w-16 text-right text-sm font-semibold text-ink">{p.qtd} un</span>
              </li>
            );
          })}
          {topProdutos.length === 0 && (
            <li className="flex flex-col items-center gap-2 px-5 py-12 text-center text-sm text-muted">
              <FileBarChart size={24} className="text-muted" />
              Sem vendas registradas ainda.
            </li>
          )}
        </ul>
      </Card>
    </div>
  );
}
