// Dados iniciais (seed) do ERP.
// Projeto começa vazio — cadastre os registros pela própria interface
// ou substitua por chamadas à sua API.

export const clientesSeed = [];

export const fornecedoresSeed = [];

export const produtosSeed = [];

export const vendasSeed = [];

export const contasSeed = [];

// Despesas fixas (recorrentes mensais) — ex.: aluguel, salários, internet.
// Cada uma pode ser lançada como conta a pagar do mês na própria tela.
export const despesasFixasSeed = [];

// Histórico mensal consolidado para gráficos do dashboard
export const historicoSeed = [];

// Etapas do fluxo de um pedido (para barra de progresso)
export const etapasPedido = ['recebido', 'separacao', 'enviado', 'entregue'];

export const pedidosSeed = [];

export const funcionariosSeed = [];

// Metas mensais — atual vs. alvo (o % é calculado na página)
export const metasSeed = [];

export const eventosSeed = [];

// Limpeza única (roda uma vez por versão da flag): remove a operação
// "Compras" (lançamentos importados / categoria Compras) e zera a área de
// Vendas, tanto no cache local quanto no Supabase.
export const LIMPEZA_FLAG = 'erp:cleanup:compras-vendas-v4';

// Nova limpeza da área de Vendas (e das contas a receber geradas por vendas).
export const VENDAS_LIMPEZA_FLAG = 'erp:cleanup:vendas-v2';

// Operação "Compras" — registros de compra (Distribuidora Siqueira Bikes),
// importados da planilha de orçamentos de junho/2026.
export const comprasSeed = [
  { id: 'cmp34464', numero: '34464', fornecedor: 'Distribuidora Siqueira Bikes', data: '2026-06-30', pagamento: 'Dinheiro', valor: 282.96, status: 'pendente' },
  { id: 'cmp34445', numero: '34445', fornecedor: 'Distribuidora Siqueira Bikes', data: '2026-06-30', pagamento: 'Dinheiro', valor: 339.14, status: 'pendente' },
  { id: 'cmp34421', numero: '34421', fornecedor: 'Distribuidora Siqueira Bikes', data: '2026-06-30', pagamento: 'Dinheiro', valor: 662.41, status: 'pendente' },
  { id: 'cmp34399', numero: '34399', fornecedor: 'Distribuidora Siqueira Bikes', data: '2026-06-30', pagamento: 'Dinheiro', valor: 201.31, status: 'pendente' },
  { id: 'cmp34387', numero: '34387', fornecedor: 'Distribuidora Siqueira Bikes', data: '2026-06-30', pagamento: 'Dinheiro', valor: 318.70, status: 'pendente' },
  { id: 'cmp34371', numero: '34371', fornecedor: 'Distribuidora Siqueira Bikes', data: '2026-06-30', pagamento: 'Dinheiro', valor: 58.49, status: 'pendente' },
  { id: 'cmp34359', numero: '34359', fornecedor: 'Distribuidora Siqueira Bikes', data: '2026-06-30', pagamento: 'Dinheiro', valor: 101.43, status: 'pendente' },
  { id: 'cmp34348', numero: '34348', fornecedor: 'Distribuidora Siqueira Bikes', data: '2026-06-30', pagamento: 'Dinheiro', valor: 621.62, status: 'pendente' },
  { id: 'cmp34347', numero: '34347', fornecedor: 'Distribuidora Siqueira Bikes', data: '2026-06-30', pagamento: 'Dinheiro', valor: 118.51, status: 'pendente' },
  { id: 'cmp34301', numero: '34301', fornecedor: 'Distribuidora Siqueira Bikes', data: '2026-06-30', pagamento: 'Dinheiro', valor: 4415.37, status: 'pendente' },
  { id: 'cmp34260', numero: '34260', fornecedor: 'Distribuidora Siqueira Bikes', data: '2026-06-30', pagamento: 'Dinheiro', valor: 405.56, status: 'pendente' },
  { id: 'cmp34231', numero: '34231', fornecedor: 'Distribuidora Siqueira Bikes', data: '2026-06-30', pagamento: 'Dinheiro', valor: 578.42, status: 'pendente' },
  { id: 'cmp34229', numero: '34229', fornecedor: 'Distribuidora Siqueira Bikes', data: '2026-06-30', pagamento: 'Dinheiro', valor: 17668.78, status: 'pendente' },
  { id: 'cmp34480', numero: '34480', fornecedor: 'Distribuidora Siqueira Bikes', data: '2026-06-30', pagamento: 'Dinheiro', valor: 2056.34, status: 'pendente' },
  { id: 'cmp34498', numero: '34498', fornecedor: 'Distribuidora Siqueira Bikes', data: '2026-06-30', pagamento: 'Dinheiro', valor: 1155.58, status: 'pendente' },
  { id: 'cmp34517', numero: '34517', fornecedor: 'Distribuidora Siqueira Bikes', data: '2026-07-01', pagamento: 'Dinheiro', valor: 84.01, status: 'pendente' },
];

// Contas a pagar correspondentes (mesmo id) — alimentam o Financeiro.
export const contasCompras = comprasSeed.map((c) => ({
  id: c.id,
  tipo: 'pagar',
  descricao: `Compra ${c.numero} — ${c.fornecedor}`,
  valor: c.valor,
  vencimento: c.data,
  status: c.status === 'pago' ? 'pago' : 'pendente',
  categoria: 'Compras',
}));

// Importa as compras acima (e suas contas) uma vez para quem já tem dados
// salvos no navegador/Supabase. Sobrescreve por id (sem duplicar).
export const COMPRAS_IMPORT_FLAG = 'erp:import:compras-distribuidora-v9';
