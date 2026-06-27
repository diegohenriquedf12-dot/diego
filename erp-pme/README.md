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

## Tema (Dark / Light Mode)

Sistema de temas dirigido por **variáveis CSS** (classe `.dark`/`.light` em `<html>`), com botão no cabeçalho (Sol/Lua) e preferência salva no `localStorage`.

| Token | 🌙 Escuro | ☀️ Claro |
|-------|-----------|----------|
| Fundo (`canvas`) | `#0F0F0F` | `#F7F7F7` |
| Card (`card`) | `#1A1A1A` | `#FFFFFF` |
| Card secundário (`card2`) | `#232323` | `#F1F1F1` |
| Texto (`ink`) | `#FFFFFF` | `#111111` |
| Texto secundário (`muted`) | `#BDBDBD` | `#555555` |
| Bordas (`line`) | `#2E2E2E` | `#DDDDDD` |
| Ação/destaque (`accent`) | `#FF7A00` (laranja) | `#111111` (preto) |

Status (KPIs): positivo `#22C55E`, atenção `#FACC15`, negativo `#EF4444`, info `#FF7A00`.
Paleta de gráficos: laranja, verde, azul, vermelho, roxo, amarelo.

## Design & animações

- Estética sofisticada inspirada em Stripe/Linear/Vercel/Notion, cards arredondados, sombras suaves e tipografia Inter.
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

## Back-end (Supabase)

O app já vem **preparado para o Supabase** (PostgreSQL gerenciado):

- Sem credenciais → usa o `localStorage` do navegador (funciona offline).
- Com credenciais (`VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`) → os dados são
  carregados e salvos no Supabase, disponíveis em qualquer dispositivo.

O `ERPContext` sincroniza cada coleção automaticamente (insert/update/delete) e
mantém o `localStorage` como cache/fallback. Para conectar, siga o
**[guia de configuração](./SUPABASE.md)** e rode o esquema em
[`supabase/schema.sql`](./supabase/schema.sql).

> Os componentes de página não mudam — tudo é consumido via `useERP()`.
