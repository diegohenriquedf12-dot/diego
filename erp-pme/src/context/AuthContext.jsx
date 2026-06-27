import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, supabaseAtivo } from '../lib/supabase';

const AuthContext = createContext(null);

// Senha rápida do administrador (trava de interface, sem conta).
// Configurável por VITE_ADMIN_SENHA. Reserva para quando não há conta Supabase.
const SENHA_ADMIN = import.meta.env.VITE_ADMIN_SENHA || 'siqueira';

const lerLocal = () => {
  try {
    const s = localStorage.getItem('erp:auth');
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  // Sessões locais (convidado / senha rápida) ficam no localStorage.
  // Sessão real de administrador (Supabase Auth) é gerida pelo supabase-js.
  const [local, setLocal] = useState(lerLocal);
  const [sessao, setSessao] = useState(null); // sessão Supabase
  const [pronto, setPronto] = useState(!supabaseAtivo);

  useEffect(() => {
    if (!supabaseAtivo) return;
    let vivo = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!vivo) return;
      setSessao(data?.session || null);
      setPronto(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_evento, s) => {
      setSessao(s || null);
    });
    return () => {
      vivo = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  const persistirLocal = (u) => {
    setLocal(u);
    try {
      if (u) localStorage.setItem('erp:auth', JSON.stringify(u));
      else localStorage.removeItem('erp:auth');
    } catch {
      /* ignora erros de storage */
    }
  };

  // Administrador real via Supabase (e-mail + senha). Retorna mensagem de erro ou null.
  const entrarComEmail = async (email, senha) => {
    if (!supabaseAtivo) return 'Back-end não configurado.';
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error) return error.message;
    persistirLocal(null); // a sessão Supabase passa a valer
    return null;
  };

  // Reserva: senha rápida local (sem conta).
  const entrarAdmin = (senha) => {
    if (senha === SENHA_ADMIN) {
      persistirLocal({ role: 'admin', nome: 'Administrador', fonte: 'local' });
      return true;
    }
    return false;
  };

  const entrarConvidado = () => persistirLocal({ role: 'convidado', nome: 'Convidado', fonte: 'local' });

  const sair = async () => {
    if (supabaseAtivo && sessao) {
      try {
        await supabase.auth.signOut();
      } catch {
        /* ignora */
      }
    }
    setSessao(null);
    persistirLocal(null);
  };

  // Usuário efetivo: sessão Supabase (admin) tem prioridade; senão, sessão local.
  const usuario = sessao
    ? { role: 'admin', nome: sessao.user?.email || 'Administrador', fonte: 'supabase' }
    : local;

  const value = {
    usuario,
    pronto,
    backendAtivo: supabaseAtivo,
    autenticado: Boolean(usuario),
    ehAdmin: usuario?.role === 'admin',
    somenteLeitura: usuario?.role === 'convidado',
    entrarComEmail,
    entrarAdmin,
    entrarConvidado,
    sair,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>');
  return ctx;
};
