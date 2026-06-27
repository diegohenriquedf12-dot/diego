import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Senha do administrador geral. Configurável por VITE_ADMIN_SENHA (build);
// padrão para começar. Observação: é uma trava de interface (client-side) —
// para segurança real, usar Supabase Auth.
const SENHA_ADMIN = import.meta.env.VITE_ADMIN_SENHA || 'siqueira';

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    try {
      const s = localStorage.getItem('erp:auth');
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });

  const persistir = (u) => {
    setUsuario(u);
    try {
      if (u) localStorage.setItem('erp:auth', JSON.stringify(u));
      else localStorage.removeItem('erp:auth');
    } catch {
      /* ignora erros de storage */
    }
  };

  const entrarAdmin = (senha) => {
    if (senha === SENHA_ADMIN) {
      persistir({ role: 'admin', nome: 'Administrador Geral' });
      return true;
    }
    return false;
  };

  const entrarConvidado = () => persistir({ role: 'convidado', nome: 'Convidado' });
  const sair = () => persistir(null);

  const value = {
    usuario,
    autenticado: Boolean(usuario),
    ehAdmin: usuario?.role === 'admin',
    somenteLeitura: usuario?.role === 'convidado',
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
