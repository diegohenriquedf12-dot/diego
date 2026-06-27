import { TrendingUp, TrendingDown } from 'lucide-react';

// Cartão de indicador (KPI) usado no dashboard
const tons = {
  emerald: 'bg-emerald-50 text-emerald-600',
  rose: 'bg-rose-50 text-rose-600',
  blue: 'bg-blue-50 text-blue-600',
  amber: 'bg-amber-50 text-amber-600',
  slate: 'bg-slate-100 text-slate-600',
};

export default function StatCard({ icone: Icone, label, valor, variacao, tom = 'slate' }) {
  const positivo = variacao != null && variacao >= 0;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <span className={`rounded-lg p-2 ${tons[tom]}`}>
          <Icone size={18} />
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">{valor}</p>
      {variacao != null && (
        <p
          className={`mt-1 flex items-center gap-1 text-xs font-medium ${
            positivo ? 'text-emerald-600' : 'text-rose-600'
          }`}
        >
          {positivo ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {Math.abs(variacao)}% vs. mês anterior
        </p>
      )}
    </div>
  );
}
