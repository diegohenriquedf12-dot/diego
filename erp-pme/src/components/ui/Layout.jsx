// Cabeçalho de página e cartão de seção (tema)

export function PageHeader({ titulo, descricao, acao }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">{titulo}</h1>
        {descricao && <p className="mt-1 text-sm text-muted">{descricao}</p>}
      </div>
      {acao}
    </div>
  );
}

export function Card({ className = '', children }) {
  return (
    <div className={`rounded-xl border border-line bg-card shadow-card ${className}`}>{children}</div>
  );
}

export function EmptyState({ icone: Icone, titulo, descricao, acao }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      {Icone && (
        <div className="mb-3 rounded-full bg-card2 p-3 text-muted">
          <Icone size={24} />
        </div>
      )}
      <h3 className="text-sm font-semibold text-ink">{titulo}</h3>
      {descricao && <p className="mt-1 max-w-sm text-sm text-muted">{descricao}</p>}
      {acao && <div className="mt-4">{acao}</div>}
    </div>
  );
}
