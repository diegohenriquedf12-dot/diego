import { createClient } from '@supabase/supabase-js';

// Lê as credenciais das variáveis de ambiente do Vite.
// Defina-as em um arquivo .env (local) ou nos segredos do GitHub (deploy):
//   VITE_SUPABASE_URL=...
//   VITE_SUPABASE_ANON_KEY=...
const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Quando não há credenciais, o app usa o fallback em localStorage.
export const supabaseAtivo = Boolean(url && anon);

export const supabase = supabaseAtivo ? createClient(url, anon) : null;

// Coleções sincronizadas (uma tabela por nome no Supabase).
export const TABELAS = [
  'clientes',
  'fornecedores',
  'produtos',
  'vendas',
  'contas',
  'pedidos',
  'funcionarios',
  'metas',
  'eventos',
];
