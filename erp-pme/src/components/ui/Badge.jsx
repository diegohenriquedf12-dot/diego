// Pílula de status reutilizável (tints translúcidos — funcionam em dark e light)
const cores = {
  // genéricos
  ativo: 'bg-pos/15 text-pos',
  inativo: 'bg-muted/15 text-muted',
  pago: 'bg-pos/15 text-pos',
  pendente: 'bg-warn/15 text-warn',
  atrasado: 'bg-neg/15 text-neg',
  cancelado: 'bg-muted/15 text-muted',
  // estoque
  ok: 'bg-pos/15 text-pos',
  baixo: 'bg-warn/15 text-warn',
  esgotado: 'bg-neg/15 text-neg',
  // financeiro
  receber: 'bg-pos/15 text-pos',
  pagar: 'bg-neg/15 text-neg',
  // pedidos
  recebido: 'bg-muted/15 text-muted',
  separacao: 'bg-warn/15 text-warn',
  enviado: 'bg-info/15 text-info',
  entregue: 'bg-pos/15 text-pos',
  // funcionários
  afastado: 'bg-warn/15 text-warn',
  estornado: 'bg-muted/15 text-muted',
};

const rotulos = {
  ok: 'Em estoque',
  baixo: 'Estoque baixo',
  esgotado: 'Esgotado',
  receber: 'A receber',
  pagar: 'A pagar',
};

export default function Badge({ status, children }) {
  const cls = cores[status] || 'bg-muted/15 text-muted';
  const texto = children || rotulos[status] || status;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${cls}`}
    >
      {texto}
    </span>
  );
}
