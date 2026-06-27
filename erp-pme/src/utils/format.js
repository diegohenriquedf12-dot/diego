// Funções utilitárias de formatação e cálculo

export const moeda = (v) =>
  (Number(v) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const numero = (v) => (Number(v) || 0).toLocaleString('pt-BR');

export const dataBR = (iso) => {
  if (!iso) return '—';
  const [a, m, d] = iso.split('-');
  return `${d}/${m}/${a}`;
};

export const hoje = () => new Date().toISOString().slice(0, 10);

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
