import { useEffect, useState } from 'react';

const tons = {
  emerald: '#22C55E',
  blue: '#3B82F6',
  amber: '#FACC15',
  rose: '#EF4444',
  violet: '#8B5CF6',
  orange: '#FF7A00',
};

/** Cor automática por desempenho: <50 vermelho, <100 amarelo, >=100 verde */
export function corPorMeta(pct) {
  if (pct >= 100) return 'emerald';
  if (pct >= 50) return 'amber';
  return 'rose';
}

/** Barra de progresso linear com preenchimento animado. */
export function ProgressBar({ valor = 0, tom = 'blue', altura = 'h-2', className = '' }) {
  const [largura, setLargura] = useState(0);
  const pct = Math.max(0, Math.min(100, valor));

  useEffect(() => {
    const t = setTimeout(() => setLargura(pct), 80);
    return () => clearTimeout(t);
  }, [pct]);

  const atingida = pct >= 100;
  return (
    <div className={`progress-track ${altura} ${className}`}>
      <div
        className={`progress-fill ${altura} ${atingida ? 'animate-glow-pulse' : ''}`}
        style={{ width: `${largura}%`, background: tons[tom] || tons.blue }}
      />
    </div>
  );
}

/** Indicador circular animado (gauge). */
export function ProgressRing({ valor = 0, tamanho = 92, espessura = 9, tom = 'blue', children }) {
  const pct = Math.max(0, Math.min(100, valor));
  const [anim, setAnim] = useState(0);
  const r = (tamanho - espessura) / 2;
  const circ = 2 * Math.PI * r;

  useEffect(() => {
    const t = setTimeout(() => setAnim(pct), 80);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div className="relative inline-grid place-items-center" style={{ width: tamanho, height: tamanho }}>
      <svg width={tamanho} height={tamanho} className="-rotate-90">
        <circle
          cx={tamanho / 2}
          cy={tamanho / 2}
          r={r}
          fill="none"
          style={{ stroke: 'rgb(var(--line))' }}
          strokeWidth={espessura}
        />
        <circle
          cx={tamanho / 2}
          cy={tamanho / 2}
          r={r}
          fill="none"
          stroke={tons[tom] || tons.blue}
          strokeWidth={espessura}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ - (anim / 100) * circ}
          style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(.16,1,.3,1)' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}
