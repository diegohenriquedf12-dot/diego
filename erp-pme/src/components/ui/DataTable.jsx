// Tabela de dados responsiva e reutilizável.
// colunas: [{ chave, titulo, render?(linha), alinhar? }]
export default function DataTable({ colunas, dados, vazio }) {
  if (!dados.length) return vazio || null;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line text-left">
            {colunas.map((c) => (
              <th
                key={c.chave}
                className={`whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted ${
                  c.alinhar === 'right' ? 'text-right' : ''
                }`}
              >
                {c.titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {dados.map((linha) => (
            <tr key={linha.id} className="transition-colors hover:bg-card2/60">
              {colunas.map((c) => (
                <td
                  key={c.chave}
                  className={`whitespace-nowrap px-4 py-3 text-ink ${
                    c.alinhar === 'right' ? 'text-right' : ''
                  }`}
                >
                  {c.render ? c.render(linha) : linha[c.chave]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
