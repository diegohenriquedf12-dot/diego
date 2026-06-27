// Dados iniciais (seed) do ERP.
// Projeto começa vazio — cadastre os registros pela própria interface
// ou substitua por chamadas à sua API.

export const clientesSeed = [];

export const fornecedoresSeed = [];

export const produtosSeed = [];

export const vendasSeed = [];

export const contasSeed = [];

// Histórico mensal consolidado para gráficos do dashboard
export const historicoSeed = [];

// Etapas do fluxo de um pedido (para barra de progresso)
export const etapasPedido = ['recebido', 'separacao', 'enviado', 'entregue'];

export const pedidosSeed = [];

export const funcionariosSeed = [];

// Metas mensais — atual vs. alvo (o % é calculado na página)
export const metasSeed = [];

export const eventosSeed = [];

// Importação única: contas a pagar geradas a partir dos PDFs de venda
// (Distribuidora Siqueira Bikes). Aplicadas uma vez via flag de importação.
export const IMPORT_CONTAS_PDF_FLAG = 'erp:import:vendas-pdf-v1';
export const contasImportadasPdf = [
  { id: 'cp34371', tipo: 'pagar', descricao: 'Pedido 34371 — Siqueira Bikes', valor: 58.49, vencimento: '2026-06-17', status: 'pendente', categoria: 'Compras' },
  { id: 'cp34387', tipo: 'pagar', descricao: 'Pedido 34387 — Siqueira Bikes', valor: 318.70, vencimento: '2026-06-18', status: 'pendente', categoria: 'Compras' },
  { id: 'cp34399', tipo: 'pagar', descricao: 'Pedido 34399 — Siqueira Bikes', valor: 201.31, vencimento: '2026-06-19', status: 'pendente', categoria: 'Compras' },
  { id: 'cp34421', tipo: 'pagar', descricao: 'Pedido 34421 — Siqueira Bikes', valor: 662.41, vencimento: '2026-06-22', status: 'pendente', categoria: 'Compras' },
  { id: 'cp34445', tipo: 'pagar', descricao: 'Pedido 34445 — Siqueira Bikes', valor: 288.60, vencimento: '2026-06-24', status: 'pendente', categoria: 'Compras' },
];
