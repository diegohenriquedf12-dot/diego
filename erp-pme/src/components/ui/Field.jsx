// Campos de formulário padronizados

const baseInput =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20';

export function Campo({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

export function Input(props) {
  return <input className={baseInput} {...props} />;
}

export function Select({ children, ...props }) {
  return (
    <select className={baseInput} {...props}>
      {children}
    </select>
  );
}
