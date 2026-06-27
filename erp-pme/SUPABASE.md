# Back-end Supabase — guia de configuração

O Gestor Siqueira usa o **Supabase** (PostgreSQL gerenciado) como back-end. Enquanto
as credenciais não são configuradas, o app funciona normalmente usando o
`localStorage` do navegador. Ao conectar o Supabase, os dados passam a ser
salvos na nuvem e ficam disponíveis em qualquer dispositivo/navegador.

## 1. Crie o projeto

1. Acesse <https://supabase.com> e crie uma conta (plano gratuito serve).
2. **New project** → escolha nome, senha do banco e região (ex.: South America).
3. Aguarde o provisionamento (~1 min).

## 2. Crie as tabelas

1. No projeto, abra **SQL Editor**.
2. Cole o conteúdo de [`supabase/schema.sql`](./supabase/schema.sql) e clique **Run**.
   - Isso cria as 9 tabelas (`clientes`, `fornecedores`, `produtos`, `vendas`,
     `contas`, `pedidos`, `funcionarios`, `metas`, `eventos`) no formato
     `id` + `dados` (jsonb) + `atualizado_em`, com RLS habilitado.

## 3. Pegue as credenciais

Em **Project Settings → API**, copie:

- **Project URL** → `VITE_SUPABASE_URL`
- **anon public key** → `VITE_SUPABASE_ANON_KEY` (essa chave é segura para o front-end)

## 4. Rodar localmente

Crie um arquivo `.env` na pasta `erp-pme/` (use `.env.example` como base):

```env
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

Depois: `npm run dev`. Os cadastros passam a ir para o Supabase.

## 5. Publicar no GitHub Pages

No repositório: **Settings → Secrets and variables → Actions**:

- Aba **Variables** → `New variable`: `VITE_SUPABASE_URL` = sua URL.
- Aba **Secrets** → `New secret`: `VITE_SUPABASE_ANON_KEY` = sua chave anon.

O workflow de deploy injeta esses valores no build automaticamente. Faça um
novo deploy (push ou *Run workflow*) para o site publicado passar a usar o banco.

## 6. Login por conta (Supabase Auth)

O app aceita **login real de administrador** por e-mail e senha (além da senha
rápida de reserva e do acesso de convidado, que é somente leitura).

1. **Authentication → Users → Add user**: informe e-mail e senha do administrador
   e marque **Auto Confirm User** (assim não precisa confirmar e-mail).
2. (Se preferir cadastro aberto) em **Authentication → Providers → Email**, deixe
   *Confirm email* desligado para testes.
3. No site, escolha **Administrador geral**, opção **e-mail e senha**, e entre.

## 7. Segurança forte (recomendada)

Por padrão (`schema.sql`) a chave **anon** pode ler e gravar — bom para começar.
Depois de criar o usuário administrador e confirmar que consegue entrar:

- Rode [`supabase/seguranca.sql`](./supabase/seguranca.sql) no SQL Editor.

A partir daí: **convidado/anon = somente leitura** e **somente o administrador
logado grava** — agora com bloqueio no servidor (RLS), não só na interface.

> Importante: aplique o `seguranca.sql` apenas **depois** de conseguir entrar com
> a conta de administrador, senão ninguém conseguirá gravar.
