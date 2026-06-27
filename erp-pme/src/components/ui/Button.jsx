// Botão com variantes
const variantes = {
  primary:
    'bg-brand-500 text-white hover:bg-brand-600 focus-visible:outline-brand-500 shadow-sm active:scale-95',
  secondary:
    'bg-white text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus-visible:outline-slate-400',
  ghost: 'text-slate-600 hover:bg-slate-100 focus-visible:outline-slate-400',
  danger:
    'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200 hover:bg-rose-100 focus-visible:outline-rose-500',
};

export default function Button({ variant = 'primary', className = '', children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variantes[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
