-- Segurança opcional (recomendada) — aplica RLS por papel.
--
-- Depois de criar o usuário administrador em Authentication → Users, rode este
-- arquivo no SQL Editor para que:
--   • CONVIDADO (chave anon, sem login) => SOMENTE LEITURA;
--   • ADMINISTRADOR (logado via Supabase Auth) => leitura e escrita.
--
-- Antes de aplicar, garanta que você consegue entrar com a conta de
-- administrador no site — caso contrário, ninguém poderá gravar.

do $$
declare
  t text;
  tabelas text[] := array[
    'clientes', 'fornecedores', 'produtos', 'vendas', 'contas',
    'pedidos', 'funcionarios', 'metas', 'eventos'
  ];
begin
  foreach t in array tabelas loop
    execute format('alter table public.%I enable row level security;', t);

    -- remove políticas anteriores
    execute format('drop policy if exists "anon_all_%1$s" on public.%1$I;', t);
    execute format('drop policy if exists "leitura_%1$s" on public.%1$I;', t);
    execute format('drop policy if exists "escrita_%1$s" on public.%1$I;', t);

    -- leitura liberada (convidado/anon + administrador autenticado)
    execute format(
      'create policy "leitura_%1$s" on public.%1$I
         for select to anon, authenticated using (true);', t);

    -- escrita apenas para administradores autenticados
    execute format(
      'create policy "escrita_%1$s" on public.%1$I
         for all to authenticated using (true) with check (true);', t);
  end loop;
end $$;
