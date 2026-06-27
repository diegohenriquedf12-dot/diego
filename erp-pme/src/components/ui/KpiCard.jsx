import { TrendingUp, TrendingDown } from 'lucide-react';
import AnimatedNumber from './AnimatedNumber';
import { ProgressBar } from './Progress';

// Tom do ícone/acento (tints translúcidos que funcionam em dark e light)
const tons = {
  emerald: { chip: 'bg-pos/15 text-pos', bar: 'emerald' },
  blue: { chip: 'bg-info/15 text-info', bar: 'blue' },
  amber: { chip: 'bg-warn/15 text-warn', bar: 'amber' },
  rose: { chip: 'bg-neg/15 text-neg', bar: 'rose' },
  violet: { chip: 'bg-violet-500/15 text-violet-400', bar: 'violet' },
  slate: { chip: 'bg-muted/15 text-muted', bar: 'blue' },
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
    <div className="card-lift group animate-fade-up rounded-2xl border border-line bg-card p-5 shadow-card">
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-muted">{label}</span>
        <span
          className={`grid h-10 w-10 place-items-center rounded-xl ${t.chip} transition-transform duration-300 group-hover:scale-110 ${
            alerta ? 'animate-pulse-alert' : ''
          }`}
        >
          <Icone size={19} />
        </span>
      </div>

      <p className="mt-3 text-2xl font-bold tracking-tight text-ink tabular-nums">
        {typeof valor === 'number' ? <AnimatedNumber valor={valor} formato={formato} /> : valor}
      </p>

      {meta != null && (
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between text-[11px] font-medium text-muted">
            <span>Meta</span>
            <span className="text-ink">{Math.round(meta)}%</span>
          </div>
          <ProgressBar valor={meta} tom={t.bar} />
        </div>
      )}

      {variacao != null && (
        <p className={`mt-2 flex items-center gap-1 text-xs font-semibold ${positivo ? 'text-pos' : 'text-neg'}`}>
          {positivo ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {Math.abs(variacao)}% <span className="font-normal text-muted">vs. mês anterior</span>
        </p>
      )}
    </div>
  );
}
