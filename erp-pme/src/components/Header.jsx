import { useEffect, useState } from 'react';
import { Menu, Search, Bell, Clock, Moon, Sun, Cloud, HardDrive, LogOut, ShieldCheck, Eye } from 'lucide-react';
import { supabaseAtivo } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function Header({ titulo, onAbrirMenu, tema = 'dark', onAlternarTema }) {
  const { usuario, ehAdmin, sair } = useAuth();
  const [agora, setAgora] = useState(new Date());

  // Relógio em tempo real (data e hora automáticas)
  useEffect(() => {
    const id = setInterval(() => setAgora(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const data = agora.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });
  const hora = agora.toLocaleTimeString('pt-BR');

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-canvas/80 px-4 backdrop-blur-md sm:px-6">
      <button
        onClick={onAbrirMenu}
        className="rounded-lg p-2 text-muted hover:bg-card2 lg:hidden"
        aria-label="Abrir menu"
      >
        <Menu size={20} />
      </button>

      <h2 className="text-sm font-semibold text-ink lg:hidden">{titulo}</h2>

      <div className="relative ml-auto hidden max-w-xs flex-1 sm:block lg:ml-0">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="search"
          placeholder="Buscar no sistema..."
          className="w-full rounded-lg border border-line bg-card2 py-2 pl-9 pr-3 text-sm text-ink placeholder-muted transition-all focus:border-accent focus:bg-card focus:outline-none focus:ring-2 focus:ring-accent/25"
        />
      </div>

      {/* Indicador de back-end (nuvem x local) */}
      <span
        className={`ml-auto hidden items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium sm:flex lg:ml-0 ${
          supabaseAtivo ? 'border-pos/30 bg-pos/10 text-pos' : 'border-line bg-card2 text-muted'
        }`}
        title={supabaseAtivo ? 'Conectado ao back-end (Supabase)' : 'Dados salvos localmente neste navegador'}
      >
        {supabaseAtivo ? <Cloud size={14} /> : <HardDrive size={14} />}
        {supabaseAtivo ? 'Nuvem' : 'Local'}
      </span>

      {/* Relógio automático */}
      <div className="hidden items-center gap-2 rounded-lg border border-line bg-card2 px-3 py-1.5 text-xs font-medium text-muted md:flex">
        <Clock size={14} className="text-accent" />
        <span className="capitalize">{data}</span>
        <span className="tabular-nums text-ink">{hora}</span>
      </div>

      {/* Alterna entre tema escuro e claro */}
      {onAlternarTema && (
        <button
          onClick={onAlternarTema}
          className="flex items-center gap-2 rounded-lg border border-line px-2.5 py-2 text-muted transition-colors hover:bg-card2 hover:text-ink"
          title={tema === 'dark' ? 'Tema claro' : 'Tema escuro'}
          aria-label="Alternar tema"
        >
          {tema === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          <span className="hidden text-xs font-medium sm:inline">
            {tema === 'dark' ? 'Claro' : 'Escuro'}
          </span>
        </button>
      )}

      <button className="relative rounded-lg p-2 text-muted hover:bg-card2">
        <Bell size={20} />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 animate-pulse-alert rounded-full bg-neg ring-2 ring-canvas" />
      </button>

      {/* Perfil do usuário + sair */}
      <div className="flex items-center gap-2 border-l border-line pl-2 sm:pl-3">
        <span
          className={`hidden items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium sm:flex ${
            ehAdmin ? 'bg-accent/10 text-accent' : 'bg-amber-500/10 text-amber-500'
          }`}
          title={ehAdmin ? 'Administrador geral' : 'Convidado (somente leitura)'}
        >
          {ehAdmin ? <ShieldCheck size={14} /> : <Eye size={14} />}
          {usuario?.nome}
        </span>
        <button
          onClick={sair}
          className="flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-2 text-muted transition-colors hover:bg-neg/10 hover:text-neg"
          title="Sair"
          aria-label="Sair"
        >
          <LogOut size={16} />
          <span className="hidden text-xs font-medium md:inline">Sair</span>
        </button>
      </div>
    </header>
  );
}
