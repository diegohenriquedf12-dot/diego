import { TrendingUp, TrendingDown } from 'lucide-react';
import AnimatedNumber from './AnimatedNumber';
import { ProgressBar } from './Progress';

// Tons do ícone / acento por desempenho
const tons = {
  emerald: { chip: 'bg-emerald-50 text-emerald-600', ring: 'ring-emerald-200', bar: 'emerald' },
  blue: { chip: 'bg-brand-50 text-brand-600', ring: 'ring-brand-100', bar: 'blue' },
  amber: { chip: 'bg-amber-50 text-amber-600', ring: 'ring-amber-200', bar: 'amber' },
  rose: { chip: 'bg-rose-50 text-rose-600', ring: 'ring-rose-200', bar: 'rose' },
  violet: { chip: 'bg-violet-50 text-violet-600', ring: 'ring-violet-200', bar: 'violet' },
  slate: { chip: 'bg-slate-100 text-slate-600', ring: 'ring-slate-200', bar: 'blue' },
};

/**
 * Cartão de indicador (KPI) premium:
 * - valor com contagem animada (AnimatedNumber)
 * - cor automática por desempenho via `tom`
 * - barra de meta opcional + variação vs. mês anterior
 */
export default function KpiCard({
  icone: Icone,
  label,
  valor,
  formato = (n) => Math.round(n).toLocaleString('pt-BR'),
  variacao,
  meta,
  tom = 'slate',
  alerta = false,
}) {
  const t = tons[tom] || tons.slate;
  const positivo = variacao != null && variacao >= 0;

  return (
    <div
      className={`card-lift group animate-fade-up rounded-2xl border border-slate-200 bg-white p-5 shadow-card ring-1 ring-inset ${t.ring}`}
    >
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <span
          className={`grid h-10 w-10 place-items-center rounded-xl ${t.chip} transition-transform duration-300 group-hover:scale-110 ${
            alerta ? 'animate-pulse-alert' : ''
          }`}
        >
          <Icone size={19} />
        </span>
      </div>

      <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
        {typeof valor === 'number' ? <AnimatedNumber valor={valor} formato={formato} /> : valor}
      </p>

      {meta != null && (
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between text-[11px] font-medium text-slate-400">
            <span>Meta</span>
            <span className="text-slate-600">{Math.round(meta)}%</span>
          </div>
          <ProgressBar valor={meta} tom={t.bar} />
        </div>
      )}

      {variacao != null && (
        <p
          className={`mt-2 flex items-center gap-1 text-xs font-semibold ${
            positivo ? 'text-emerald-600' : 'text-rose-600'
          }`}
        >
          {positivo ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {Math.abs(variacao)}% <span className="font-normal text-slate-400">vs. mês anterior</span>
        </p>
      )}
    </div>
  );
}
