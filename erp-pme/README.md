# Gestor PME — ERP web para pequenas empresas

ERP completo em React para gestão de pequenas empresas. Interface moderna, responsiva e modular, com gráficos e operações de cadastro (CRUD) em cada módulo.

## Módulos

| Módulo | O que faz |
|--------|-----------|
| **Dashboard** | Indicadores (saldo, recebimentos, estoque, clientes), gráfico de receita × despesa, vendas recentes e alertas de estoque. |
| **Clientes** | Cadastro completo com busca, edição e exclusão. |
| **Fornecedores** | Cadastro por categoria, prazo de pagamento e situação. |
| **Estoque** | Produtos com custo, preço, quantidade e estoque mínimo; alertas automáticos de reposição. |
| **Vendas** | Pedidos com múltiplos itens; baixa de estoque e lançamento financeiro automáticos. |
| **Financeiro** | Contas a pagar e a receber, com baixa (quitação) e situação por vencimento. |
| **Fluxo de caixa** | Extrato de entradas/saídas realizadas, saldo acumulado e gráfico mensal. |
| **Relatórios** | Faturamento por cliente, produtos mais vendidos, despesas por categoria e exportação CSV. |

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
    │   ├── Sidebar.jsx         # menu lateral + lista de módulos
    │   ├── Header.jsx          # barra superior
    │   └── ui/                 # componentes reutilizáveis
    │       ├── Badge.jsx
    │       ├── Button.jsx
    │       ├── Modal.jsx
    │       ├── Field.jsx
    │       ├── DataTable.jsx
    │       ├── StatCard.jsx
    │       └── Layout.jsx
    └── pages/                  # uma página por módulo
        ├── Dashboard.jsx
        ├── Clientes.jsx
        ├── Fornecedores.jsx
        ├── Estoque.jsx
        ├── Vendas.jsx
        ├── Financeiro.jsx
        ├── FluxoCaixa.jsx
        └── Relatorios.jsx
```

## Conectando a um back-end

O estado e os dados vivem em memória (`src/data/seed.js` + `ERPContext`). Para integrar com um back-end real:

1. Substitua os `useState(...Seed)` em `ERPContext.jsx` por chamadas à sua API (`fetch`/`axios`) dentro de `useEffect`.
2. Troque as funções `salvar*`/`remover*` por requisições `POST`/`PUT`/`DELETE`.
3. Os componentes de página não precisam mudar — eles consomem tudo via `useERP()`.

> Os dados de exemplo são fictícios e servem apenas para demonstração.
