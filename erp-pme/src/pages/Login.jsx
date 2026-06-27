import { useState } from 'react';
import { Sparkles, ShieldCheck, Eye, LogIn, Lock, Moon, Sun, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login({ tema = 'dark', onAlternarTema }) {
  const { entrarAdmin, entrarConvidado } = useAuth();
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(false);

  const entrar = (e) => {
    e.preventDefault();
    if (!entrarAdmin(senha)) {
      setErro(true);
      setSenha('');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas px-4 text-ink">
      {/* brilho de fundo */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />

      {onAlternarTema && (
        <button
          onClick={onAlternarTema}
          className="absolute right-4 top-4 flex items-center gap-2 rounded-lg border border-line px-2.5 py-2 text-muted transition-colors hover:bg-card2 hover:text-ink"
          aria-label="Alternar tema"
        >
          {tema === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      )}

      <div className="relative w-full max-w-md animate-fade-up">
        {/* marca */}
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-accent text-accent-ink shadow-lift">
            <Sparkles size={26} />
          </span>
          <h1 className="text-2xl font-bold tracking-tight">Gestor Siqueira</h1>
          <p className="mt-1 text-sm text-muted">Sistema empresarial · escolha como entrar</p>
        </div>

        {/* Administrador geral */}
        <div className="rounded-2xl border border-line bg-card p-6 shadow-card">
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheck size={18} className="text-accent" />
            <h2 className="text-sm font-semibold">Administrador geral</h2>
          </div>
          <form onSubmit={entrar} className="space-y-3">
            <div className="relative">
              <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="password"
                value={senha}
                autoFocus
                onChange={(e) => {
                  setSenha(e.target.value);
                  setErro(false);
                }}
                placeholder="Senha do administrador"
                className="w-full rounded-lg border border-line bg-card2 py-2.5 pl-9 pr-3 text-sm text-ink placeholder-muted focus:border-accent focus:bg-card focus:outline-none focus:ring-2 focus:ring-accent/25"
              />
            </div>
            {erro && (
              <p className="flex items-center gap-1.5 text-xs font-medium text-neg">
                <AlertCircle size={13} /> Senha incorreta. Tente novamente.
              </p>
            )}
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-hover active:scale-[.98]"
            >
              <LogIn size={16} /> Entrar como administrador
            </button>
          </form>
        </div>

        {/* separador */}
        <div className="my-4 flex items-center gap-3 text-[11px] uppercase tracking-wide text-muted">
          <span className="h-px flex-1 bg-line" /> ou <span className="h-px flex-1 bg-line" />
        </div>

        {/* Convidado */}
        <button
          onClick={entrarConvidado}
          className="group flex w-full items-center justify-between rounded-2xl border border-line bg-card p-5 text-left shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-card2 text-muted transition-colors group-hover:text-accent">
              <Eye size={18} />
            </span>
            <div>
              <p className="text-sm font-semibold">Entrar como convidado</p>
              <p className="text-xs text-muted">Acesso somente leitura — visualizar sem editar.</p>
            </div>
          </div>
          <LogIn size={16} className="text-muted transition-transform group-hover:translate-x-0.5" />
        </button>

        <p className="mt-6 text-center text-[11px] text-muted">
          Trava de acesso da interface. Para segurança completa, ative o login do Supabase.
        </p>
      </div>
    </div>
  );
}
