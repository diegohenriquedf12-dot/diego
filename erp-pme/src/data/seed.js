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

// Importação única: contas a pagar (categoria "Compras") geradas a partir
// da planilha de orçamentos de junho/2026. Cliente: Distribuidora Siqueira.
// Aplicadas uma vez via flag de importação (sobrescrevem por id).
export const IMPORT_CONTAS_PDF_FLAG = 'erp:import:compras-orcamentos-v3';
export const contasImportadasPdf = [
  { id: 'cp34464', tipo: 'pagar', descricao: 'Pedido 34464 — Distribuidora Siqueira', valor: 282.96, vencimento: '2026-06-26', status: 'pendente', categoria: 'Compras' },
  { id: 'cp34445', tipo: 'pagar', descricao: 'Pedido 34445 — Distribuidora Siqueira', valor: 339.14, vencimento: '2026-06-24', status: 'pendente', categoria: 'Compras' },
  { id: 'cp34421', tipo: 'pagar', descricao: 'Pedido 34421 — Distribuidora Siqueira', valor: 662.41, vencimento: '2026-06-22', status: 'pendente', categoria: 'Compras' },
  { id: 'cp34399', tipo: 'pagar', descricao: 'Pedido 34399 — Distribuidora Siqueira', valor: 201.31, vencimento: '2026-06-19', status: 'pendente', categoria: 'Compras' },
  { id: 'cp34387', tipo: 'pagar', descricao: 'Pedido 34387 — Distribuidora Siqueira', valor: 318.70, vencimento: '2026-06-18', status: 'pendente', categoria: 'Compras' },
  { id: 'cp34371', tipo: 'pagar', descricao: 'Pedido 34371 — Distribuidora Siqueira', valor: 58.49, vencimento: '2026-06-17', status: 'pendente', categoria: 'Compras' },
  { id: 'cp34359', tipo: 'pagar', descricao: 'Pedido 34359 — Distribuidora Siqueira', valor: 101.43, vencimento: '2026-06-16', status: 'pendente', categoria: 'Compras' },
  { id: 'cp34348', tipo: 'pagar', descricao: 'Pedido 34348 — Distribuidora Siqueira', valor: 621.62, vencimento: '2026-06-15', status: 'pendente', categoria: 'Compras' },
  { id: 'cp34347', tipo: 'pagar', descricao: 'Pedido 34347 — Distribuidora Siqueira', valor: 118.51, vencimento: '2026-06-15', status: 'pendente', categoria: 'Compras' },
  { id: 'cp34301', tipo: 'pagar', descricao: 'Pedido 34301 — Distribuidora Siqueira', valor: 4415.37, vencimento: '2026-06-10', status: 'pendente', categoria: 'Compras' },
  { id: 'cp34260', tipo: 'pagar', descricao: 'Pedido 34260 — Distribuidora Siqueira', valor: 405.56, vencimento: '2026-06-05', status: 'pendente', categoria: 'Compras' },
  { id: 'cp34231', tipo: 'pagar', descricao: 'Pedido 34231 — Distribuidora Siqueira', valor: 578.42, vencimento: '2026-06-02', status: 'pendente', categoria: 'Compras' },
  { id: 'cp34229', tipo: 'pagar', descricao: 'Pedido 34229 — Distribuidora Siqueira', valor: 17668.78, vencimento: '2026-06-02', status: 'pendente', categoria: 'Compras' },
];
