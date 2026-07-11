// Funções utilitárias de formatação e cálculo

export const moeda = (v) =>
  (Number(v) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const numero = (v) => (Number(v) || 0).toLocaleString('pt-BR');

export const dataBR = (iso) => {
  if (!iso) return '—';
  const [a, m, d] = iso.split('-');
  return `${d}/${m}/${a}`;
};

// Data de hoje (AAAA-MM-DD) no fuso LOCAL. Usar toISOString() aqui causava
// erro de "+1 dia" à noite no Brasil (UTC-3), pois converte para UTC.
export const hoje = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const totalVenda = (venda) => {
  const itens = venda.itens || [];
  // Venda manual (sem itens): usa o total informado diretamente.
  if (itens.length === 0 && venda.total != null) return Number(venda.total) || 0;
  return itens.reduce((s, i) => s + i.qtd * i.preco, 0);
};

export const novoId = (prefixo = '') =>
  prefixo + Math.random().toString(36).slice(2, 9);

// Situação da conta considerando vencimento vs. hoje
export const situacaoConta = (conta) => {
  if (conta.status === 'pago') return 'pago';
  if (conta.vencimento && conta.vencimento < hoje()) return 'atrasado';
  return 'pendente';
};

export const nivelEstoque = (p) => {
  if (p.quantidade <= 0) return 'esgotado';
  if (p.quantidade <= p.estoqueMinimo) return 'baixo';
  return 'ok';
};
