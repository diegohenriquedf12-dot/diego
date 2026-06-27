import {
  LayoutDashboard,
  Users,
  Truck,
  Package,
  ShoppingCart,
  Wallet,
  ArrowLeftRight,
  BarChart3,
  X,
  Building2,
} from 'lucide-react';

export const modulos = [
  { id: 'dashboard', nome: 'Dashboard', icone: LayoutDashboard },
  { id: 'clientes', nome: 'Clientes', icone: Users },
  { id: 'fornecedores', nome: 'Fornecedores', icone: Truck },
  { id: 'estoque', nome: 'Estoque', icone: Package },
  { id: 'vendas', nome: 'Vendas', icone: ShoppingCart },
  { id: 'financeiro', nome: 'Financeiro', icone: Wallet },
  { id: 'fluxo', nome: 'Fluxo de caixa', icone: ArrowLeftRight },
  { id: 'relatorios', nome: 'Relatórios', icone: BarChart3 },
];

export default function Sidebar({ ativo, onNavegar, aberto, onFechar }) {
  return (
    <>
      {/* overlay mobile */}
      {aberto && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={onFechar}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-900 transition-transform duration-200 lg:translate-x-0 ${
          aberto ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between gap-2 px-5">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-500 text-white">
              <Building2 size={20} />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-white">Gestor PME</p>
              <p className="text-[11px] text-slate-400">ERP para pequenas empresas</p>
            </div>
          </div>
          <button
            onClick={onFechar}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 lg:hidden"
            aria-label="Fechar menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {modulos.map((m) => {
            const Icone = m.icone;
            const selecionado = ativo === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onNavegar(m.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  selecionado
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icone size={18} />
                {m.nome}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-700 text-sm font-semibold text-white">
              JM
            </span>
            <div className="leading-tight">
              <p className="text-sm font-medium text-white">João Martins</p>
              <p className="text-[11px] text-slate-400">Administrador</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
