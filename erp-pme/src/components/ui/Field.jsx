// Campos de formulário padronizados (tema)

const baseInput =
  'w-full rounded-lg border border-line bg-card2 px-3 py-2 text-sm text-ink placeholder-muted shadow-sm transition-colors focus:border-accent focus:bg-card focus:outline-none focus:ring-2 focus:ring-accent/25';

export function Campo({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink">{label}</span>
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
