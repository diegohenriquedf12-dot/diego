import { X } from 'lucide-react';

// Janela modal acessível (fecha com Esc e clique no fundo)
export default function Modal({ aberto, titulo, onFechar, children, rodape }) {
  if (!aberto) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex animate-fade-in items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onFechar}
    >
      <div
        className="flex max-h-[92vh] w-full animate-scale-in flex-col overflow-hidden rounded-t-2xl border border-line bg-card shadow-2xl sm:max-w-lg sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-base font-semibold text-ink">{titulo}</h2>
          <button
            onClick={onFechar}
            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-card2 hover:text-ink"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {rodape && (
          <footer className="flex justify-end gap-2 border-t border-line bg-card2 px-5 py-3">
            {rodape}
          </footer>
        )}
      </div>
    </div>
  );
}
