import {
  LayoutDashboard,
  Users,
  Truck,
  Package,
  ShoppingCart,
  ClipboardList,
  Wallet,
  ArrowLeftRight,
  BarChart3,
  UserCog,
  Target,
  CalendarDays,
  X,
  Sparkles,
} from 'lucide-react';

// Navegação agrupada — a lista plana `modulos` é derivada para lookup de título
export const grupos = [
  {
    titulo: 'Principal',
    itens: [{ id: 'dashboard', nome: 'Dashboard', icone: LayoutDashboard }],
  },
  {
    titulo: 'Operação',
    itens: [
      { id: 'pedidos', nome: 'Pedidos', icone: ClipboardList },
      { id: 'vendas', nome: 'Vendas', icone: ShoppingCart },
      { id: 'estoque', nome: 'Produtos', icone: Package },
      { id: 'clientes', nome: 'Clientes', icone: Users },
      { id: 'fornecedores', nome: 'Fornecedores', icone: Truck },
    ],
  },
  {
    titulo: 'Financeiro',
    itens: [
      { id: 'financeiro', nome: 'Financeiro', icone: Wallet },
      { id: 'fluxo', nome: 'Fluxo de caixa', icone: ArrowLeftRight },
    ],
  },
  {
    titulo: 'Gestão',
    itens: [
      { id: 'funcionarios', nome: 'Funcionários', icone: UserCog },
      { id: 'metas', nome: 'Metas', icone: Target },
      { id: 'agenda', nome: 'Agenda', icone: CalendarDays },
      { id: 'relatorios', nome: 'Relatórios', icone: BarChart3 },
    ],
  },
];

export const modulos = grupos.flatMap((g) => g.itens);

export default function Sidebar({ ativo, onNavegar, aberto, onFechar }) {
  return (
    <>
      {aberto && (
        <div className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden" onClick={onFechar} />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-brand-900 transition-transform duration-200 lg:translate-x-0 ${
          aberto ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo / marca */}
        <div className="flex h-16 items-center justify-between gap-2 px-5">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-500/30">
              <Sparkles size={18} />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-bold text-white">Gestor PME</p>
              <p className="text-[11px] text-slate-400">Sistema empresarial</p>
            </div>
          </div>
          <button
            onClick={onFechar}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 lg:hidden"
            aria-label="Fechar menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
          {grupos.map((g) => (
            <div key={g.titulo}>
              <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                {g.titulo}
              </p>
              <div className="space-y-0.5">
                {g.itens.map((m) => {
                  const Icone = m.icone;
                  const selecionado = ativo === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => onNavegar(m.id)}
                      className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                        selecionado
                          ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icone size={18} className={selecionado ? '' : 'transition-transform group-hover:scale-110'} />
                      {m.nome}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-semibold text-white">
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
