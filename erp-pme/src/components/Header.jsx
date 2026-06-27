import { useEffect, useState } from 'react';
import { Menu, Search, Bell, Clock } from 'lucide-react';

export default function Header({ titulo, onAbrirMenu }) {
  const [agora, setAgora] = useState(new Date());

  // Relógio em tempo real (data e hora automáticas)
  useEffect(() => {
    const id = setInterval(() => setAgora(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const data = agora.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });
  const hora = agora.toLocaleTimeString('pt-BR');

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md sm:px-6">
      <button
        onClick={onAbrirMenu}
        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
        aria-label="Abrir menu"
      >
        <Menu size={20} />
      </button>

      <h2 className="text-sm font-semibold text-slate-900 lg:hidden">{titulo}</h2>

      <div className="relative ml-auto hidden max-w-xs flex-1 sm:block lg:ml-0">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Buscar no sistema..."
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 placeholder-slate-400 transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
      </div>

      {/* Relógio automático */}
      <div className="ml-auto hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 md:flex lg:ml-0">
        <Clock size={14} className="text-brand-500" />
        <span className="capitalize">{data}</span>
        <span className="tabular-nums text-slate-900">{hora}</span>
      </div>

      <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100">
        <Bell size={20} />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 animate-pulse-alert rounded-full bg-rose-500 ring-2 ring-white" />
      </button>
    </header>
  );
}
