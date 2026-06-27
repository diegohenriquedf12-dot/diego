// Dados iniciais (seed) do ERP. Em produção, substitua por chamadas à sua API.

export const clientesSeed = [
  { id: 'c1', nome: 'Padaria Pão Quente', documento: '12.345.678/0001-90', email: 'contato@paoquente.com.br', telefone: '(11) 98765-4321', cidade: 'São Paulo', uf: 'SP', status: 'ativo', desde: '2023-02-10' },
  { id: 'c2', nome: 'Mercado Bom Preço', documento: '98.765.432/0001-10', email: 'compras@bompreco.com.br', telefone: '(11) 97654-3210', cidade: 'Guarulhos', uf: 'SP', status: 'ativo', desde: '2023-05-22' },
  { id: 'c3', nome: 'Ana Beatriz Souza', documento: '123.456.789-00', email: 'ana.souza@email.com', telefone: '(21) 99876-5432', cidade: 'Rio de Janeiro', uf: 'RJ', status: 'ativo', desde: '2024-01-15' },
  { id: 'c4', nome: 'Construtora Alvorada', documento: '45.678.901/0001-23', email: 'financeiro@alvorada.com.br', telefone: '(31) 98123-4567', cidade: 'Belo Horizonte', uf: 'MG', status: 'inativo', desde: '2022-11-03' },
  { id: 'c5', nome: 'Café Central', documento: '34.567.890/0001-45', email: 'gerencia@cafecentral.com.br', telefone: '(41) 99234-5678', cidade: 'Curitiba', uf: 'PR', status: 'ativo', desde: '2024-03-28' },
  { id: 'c6', nome: 'Carlos Mendes ME', documento: '23.456.789/0001-67', email: 'carlos@mendesme.com.br', telefone: '(51) 98345-6789', cidade: 'Porto Alegre', uf: 'RS', status: 'ativo', desde: '2024-06-11' },
];

export const fornecedoresSeed = [
  { id: 'f1', nome: 'Distribuidora Atlântico', documento: '11.222.333/0001-44', email: 'vendas@atlantico.com.br', telefone: '(11) 3344-5566', categoria: 'Matéria-prima', status: 'ativo', prazo: 30 },
  { id: 'f2', nome: 'Embalagens União', documento: '22.333.444/0001-55', email: 'pedidos@embalagensuniao.com.br', telefone: '(11) 4455-6677', categoria: 'Embalagens', status: 'ativo', prazo: 28 },
  { id: 'f3', nome: 'TechParts Componentes', documento: '33.444.555/0001-66', email: 'comercial@techparts.com.br', telefone: '(11) 5566-7788', categoria: 'Componentes', status: 'ativo', prazo: 45 },
  { id: 'f4', nome: 'Logística Veloz', documento: '44.555.666/0001-77', email: 'sac@logveloz.com.br', telefone: '(11) 6677-8899', categoria: 'Serviços', status: 'inativo', prazo: 15 },
  { id: 'f5', nome: 'Papelaria Central', documento: '55.666.777/0001-88', email: 'contato@papelariacentral.com.br', telefone: '(11) 7788-9900', categoria: 'Escritório', status: 'ativo', prazo: 21 },
];

export const produtosSeed = [
  { id: 'p1', nome: 'Farinha de Trigo 25kg', sku: 'INS-001', categoria: 'Insumos', custo: 78.0, preco: 110.0, quantidade: 42, estoqueMinimo: 15, unidade: 'sc' },
  { id: 'p2', nome: 'Açúcar Refinado 5kg', sku: 'INS-002', categoria: 'Insumos', custo: 16.5, preco: 24.9, quantidade: 8, estoqueMinimo: 20, unidade: 'pct' },
  { id: 'p3', nome: 'Embalagem Kraft P (100un)', sku: 'EMB-010', categoria: 'Embalagens', custo: 22.0, preco: 39.9, quantidade: 60, estoqueMinimo: 25, unidade: 'cx' },
  { id: 'p4', nome: 'Café Torrado 1kg', sku: 'BEB-100', categoria: 'Bebidas', custo: 28.0, preco: 49.9, quantidade: 3, estoqueMinimo: 12, unidade: 'kg' },
  { id: 'p5', nome: 'Copo Descartável 200ml (50un)', sku: 'EMB-020', categoria: 'Embalagens', custo: 6.5, preco: 12.9, quantidade: 120, estoqueMinimo: 40, unidade: 'pct' },
  { id: 'p6', nome: 'Fermento Biológico 500g', sku: 'INS-003', categoria: 'Insumos', custo: 14.0, preco: 22.5, quantidade: 27, estoqueMinimo: 10, unidade: 'un' },
  { id: 'p7', nome: 'Manteiga sem Sal 200g', sku: 'INS-004', categoria: 'Insumos', custo: 7.8, preco: 13.9, quantidade: 0, estoqueMinimo: 18, unidade: 'un' },
  { id: 'p8', nome: 'Guardanapo Folha Dupla (300un)', sku: 'EMB-030', categoria: 'Embalagens', custo: 9.9, preco: 17.5, quantidade: 85, estoqueMinimo: 30, unidade: 'pct' },
];

export const vendasSeed = [
  { id: 'v1004', clienteId: 'c1', data: '2026-06-22', itens: [{ produtoId: 'p1', qtd: 4, preco: 110 }, { produtoId: 'p6', qtd: 3, preco: 22.5 }], status: 'pago', pagamento: 'PIX' },
  { id: 'v1003', clienteId: 'c5', data: '2026-06-20', itens: [{ produtoId: 'p4', qtd: 6, preco: 49.9 }, { produtoId: 'p5', qtd: 10, preco: 12.9 }], status: 'pago', pagamento: 'Cartão' },
  { id: 'v1002', clienteId: 'c2', data: '2026-06-18', itens: [{ produtoId: 'p3', qtd: 5, preco: 39.9 }, { produtoId: 'p8', qtd: 8, preco: 17.5 }], status: 'pendente', pagamento: 'Boleto' },
  { id: 'v1001', clienteId: 'c3', data: '2026-06-15', itens: [{ produtoId: 'p2', qtd: 12, preco: 24.9 }], status: 'pago', pagamento: 'PIX' },
  { id: 'v1000', clienteId: 'c6', data: '2026-06-10', itens: [{ produtoId: 'p4', qtd: 4, preco: 49.9 }, { produtoId: 'p1', qtd: 2, preco: 110 }], status: 'cancelado', pagamento: 'Boleto' },
];

export const contasSeed = [
  { id: 't1', tipo: 'receber', descricao: 'Venda #1002 — Mercado Bom Preço', valor: 339.5, vencimento: '2026-06-30', status: 'pendente', categoria: 'Vendas' },
  { id: 't2', tipo: 'receber', descricao: 'Venda #1001 — Ana Beatriz Souza', valor: 298.8, vencimento: '2026-06-15', status: 'pago', categoria: 'Vendas' },
  { id: 't3', tipo: 'pagar', descricao: 'Distribuidora Atlântico — NF 8841', valor: 1560.0, vencimento: '2026-06-28', status: 'pendente', categoria: 'Fornecedores' },
  { id: 't4', tipo: 'pagar', descricao: 'Aluguel — Junho/2026', valor: 2800.0, vencimento: '2026-06-05', status: 'pago', categoria: 'Despesas fixas' },
  { id: 't5', tipo: 'pagar', descricao: 'Energia elétrica', valor: 640.0, vencimento: '2026-06-12', status: 'atrasado', categoria: 'Despesas fixas' },
  { id: 't6', tipo: 'pagar', descricao: 'Embalagens União — NF 2210', valor: 880.0, vencimento: '2026-07-04', status: 'pendente', categoria: 'Fornecedores' },
  { id: 't7', tipo: 'receber', descricao: 'Venda #1004 — Padaria Pão Quente', valor: 507.5, vencimento: '2026-06-22', status: 'pago', categoria: 'Vendas' },
  { id: 't8', tipo: 'pagar', descricao: 'Salários — Junho/2026', valor: 8200.0, vencimento: '2026-07-05', status: 'pendente', categoria: 'Folha' },
];

// Histórico mensal consolidado para gráficos do dashboard
export const historicoSeed = [
  { mes: 'Jan', receita: 24800, despesa: 18200 },
  { mes: 'Fev', receita: 26500, despesa: 17900 },
  { mes: 'Mar', receita: 31200, despesa: 21400 },
  { mes: 'Abr', receita: 28900, despesa: 19800 },
  { mes: 'Mai', receita: 34100, despesa: 22600 },
  { mes: 'Jun', receita: 37450, despesa: 24300 },
];
