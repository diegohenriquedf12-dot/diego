// Botão com variantes (segue o tema via tokens)
const variantes = {
  primary:
    'bg-accent text-accent-ink hover:bg-accent-hover focus-visible:outline-accent shadow-sm active:scale-95',
  secondary:
    'bg-card text-ink ring-1 ring-inset ring-line hover:bg-card2 focus-visible:outline-line',
  ghost: 'text-muted hover:bg-card2 focus-visible:outline-line',
  danger:
    'bg-neg/10 text-neg ring-1 ring-inset ring-neg/30 hover:bg-neg/20 focus-visible:outline-neg',
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
