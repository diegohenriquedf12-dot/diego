// Pílula de status reutilizável
const cores = {
  ativo: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  inativo: 'bg-slate-100 text-slate-500 ring-slate-500/20',
  pago: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  pendente: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  atrasado: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  cancelado: 'bg-slate-100 text-slate-500 ring-slate-500/20',
  ok: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  baixo: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  esgotado: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  receber: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  pagar: 'bg-rose-50 text-rose-700 ring-rose-600/20',
};

const rotulos = {
  ok: 'Em estoque',
  baixo: 'Estoque baixo',
  esgotado: 'Esgotado',
  receber: 'A receber',
  pagar: 'A pagar',
};

export default function Badge({ status, children }) {
  const cls = cores[status] || 'bg-slate-100 text-slate-600 ring-slate-500/20';
  const texto = children || rotulos[status] || status;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${cls}`}
    >
      {texto}
    </span>
  );
}
