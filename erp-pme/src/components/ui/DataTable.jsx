// Tabela de dados responsiva e reutilizável.
// colunas: [{ chave, titulo, render?(linha), alinhar? }]
export default function DataTable({ colunas, dados, vazio }) {
  if (!dados.length) return vazio || null;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left">
            {colunas.map((c) => (
              <th
                key={c.chave}
                className={`whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 ${
                  c.alinhar === 'right' ? 'text-right' : ''
                }`}
              >
                {c.titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {dados.map((linha) => (
            <tr key={linha.id} className="transition-colors hover:bg-slate-50/70">
              {colunas.map((c) => (
                <td
                  key={c.chave}
                  className={`whitespace-nowrap px-4 py-3 text-slate-700 ${
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
