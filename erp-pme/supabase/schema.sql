-- Esquema do back-end (Supabase / PostgreSQL) para o Gestão Siqueira.
-- Cada coleção do app vira uma tabela com o mesmo nome, no formato documento:
--   id           text  (chave primária — mesmo id gerado no app)
--   dados        jsonb (o registro completo)
--   atualizado_em timestamptz
--
-- Como aplicar:
--   1. No painel do Supabase, abra SQL Editor.
--   2. Cole este arquivo inteiro e clique em "Run".
--
-- Segurança: as políticas abaixo liberam acesso à chave pública (anon) para
-- um MVP sem login. Para produção, habilite Auth e restrinja as policies
-- (ex.: using (auth.uid() = dono)).

do $$
declare
  t text;
  tabelas text[] := array[
    'clientes', 'fornecedores', 'produtos', 'vendas', 'contas',
    'pedidos', 'funcionarios', 'metas', 'eventos', 'compras', 'despesasfixas', 'boletos'
  ];
begin
  foreach t in array tabelas loop
    execute format(
      'create table if not exists public.%I (
         id text primary key,
         dados jsonb not null default ''{}''::jsonb,
         atualizado_em timestamptz not null default now()
       );', t);

    execute format('alter table public.%I enable row level security;', t);

    execute format('drop policy if exists "anon_all_%1$s" on public.%1$I;', t);
    execute format(
      'create policy "anon_all_%1$s" on public.%1$I
         for all to anon using (true) with check (true);', t);

    -- índice para ordenação por mais recente
    execute format(
      'create index if not exists idx_%1$s_atualizado on public.%1$I (atualizado_em desc);', t);
  end loop;
end $$;
