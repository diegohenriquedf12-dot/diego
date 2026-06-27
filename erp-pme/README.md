# Gestor PME — ERP web para pequenas empresas

ERP completo em React para gestão de pequenas empresas. Interface **premium**, responsiva e modular, com **design corporativo, animações suaves** (contagem de KPIs, barras de progresso animadas, transições entre páginas), gráficos dinâmicos e operações de cadastro (CRUD) em cada módulo.

## Módulos

| Módulo | O que faz |
|--------|-----------|
| **Dashboard Executivo** | Faixa de boas-vindas, KPIs com contagem animada e cor por desempenho (receita, lucro, despesas, saldo, clientes, pedidos, produtos, estoque), gráficos de receita × despesa, despesas por categoria (rosca), metas e estoque, vendas recentes e alertas. |
| **Pedidos** | Acompanhamento por cartões com **barra de progresso de rastreio** (Recebido → Separação → Enviado → Entregue), transportadora, código de rastreio e filtros. |
| **Vendas** | Pedidos com múltiplos itens; baixa de estoque e lançamento financeiro automáticos. |
| **Produtos / Estoque** | Produtos com custo, preço, quantidade e estoque mínimo; alertas automáticos de reposição. |
| **Clientes** | Cadastro completo com busca, edição e exclusão. |
| **Fornecedores** | Cadastro por categoria, prazo de pagamento e situação. |
| **Financeiro** | Contas a pagar e a receber, com baixa (quitação) e situação por vencimento. |
| **Fluxo de caixa** | Extrato de entradas/saídas realizadas, saldo acumulado e gráfico mensal. |
| **Funcionários** | Equipe, cargos, departamentos e folha de pagamento, com KPIs de resumo. |
| **Metas** | Metas mensais com **barras e indicador circular animados**, cor por desempenho e destaque verde ao atingir 100%. |
| **Agenda** | Calendário mensal interativo com eventos coloridos (reuniões, pagamentos, vencimentos, aniversários) e lista de próximos compromissos. |
| **Relatórios** | Faturamento por cliente, produtos mais vendidos, despesas por categoria e exportação CSV. |

## Design & animações

- Paleta corporativa **azul escuro (#0F172A) + azul (#2563EB)**, cards arredondados, sombras suaves e tipografia Inter.
- KPIs com **contagem animada** (`AnimatedNumber`) e cor automática por meta (verde / amarelo / vermelho).
- **Barras de progresso** e **indicadores circulares** animados (`Progress`), efeito de brilho ao concluir metas.
- Entrada de cards em cascata, transições entre páginas e relógio (data/hora) em tempo real.
- Respeita `prefers-reduced-motion` (desativa animações para quem prefere menos movimento).

## Stack

- **React 18** + **Vite** (build rápido)
- **Tailwind CSS** (estilização utilitária)
- **Recharts** (gráficos)
- **lucide-react** (ícones)
- Estado central com **Context API** (`src/context/ERPContext.jsx`)

## Como rodar

Pré-requisito: **Node.js 18+**.

```bash
npm install     # instala as dependências
npm run dev     # ambiente de desenvolvimento (http://localhost:5173)
npm run build   # gera a versão de produção em /dist
npm run preview # pré-visualiza o build de produção
```

## Organização dos arquivos

```
erp-pme/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx                # ponto de entrada
    ├── App.jsx                 # layout + navegação entre módulos
    ├── index.css               # base do Tailwind
    ├── context/
    │   └── ERPContext.jsx      # estado central + CRUD + indicadores
    ├── data/
    │   └── seed.js             # dados de exemplo (trocar pela sua API)
    ├── utils/
    │   └── format.js           # moeda, datas e cálculos
    ├── components/
    │   ├── Sidebar.jsx         # menu lateral agrupado + lista de módulos
    │   ├── Header.jsx          # barra superior + relógio em tempo real
    │   └── ui/                 # componentes reutilizáveis
    │       ├── Badge.jsx
    │       ├── Button.jsx
    │       ├── Modal.jsx
    │       ├── Field.jsx
    │       ├── DataTable.jsx
    │       ├── StatCard.jsx
    │       ├── KpiCard.jsx         # KPI premium com contagem animada
    │       ├── AnimatedNumber.jsx  # contagem numérica com easing
    │       ├── Progress.jsx        # barra + anel circular animados
    │       └── Layout.jsx
    └── pages/                  # uma página por módulo
        ├── Dashboard.jsx
        ├── Pedidos.jsx
        ├── Vendas.jsx
        ├── Estoque.jsx
        ├── Clientes.jsx
        ├── Fornecedores.jsx
        ├── Financeiro.jsx
        ├── FluxoCaixa.jsx
        ├── Funcionarios.jsx
        ├── Metas.jsx
        ├── Agenda.jsx
        └── Relatorios.jsx
```

## Conectando a um back-end

O estado e os dados vivem em memória (`src/data/seed.js` + `ERPContext`). Para integrar com um back-end real:

1. Substitua os `useState(...Seed)` em `ERPContext.jsx` por chamadas à sua API (`fetch`/`axios`) dentro de `useEffect`.
2. Troque as funções `salvar*`/`remover*` por requisições `POST`/`PUT`/`DELETE`.
3. Os componentes de página não precisam mudar — eles consomem tudo via `useERP()`.

> Os dados de exemplo são fictícios e servem apenas para demonstração.
