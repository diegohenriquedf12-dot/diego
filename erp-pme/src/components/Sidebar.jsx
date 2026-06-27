import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingBag,
  ShoppingCart,
  ClipboardList,
  Wallet,
  ArrowLeftRight,
  Repeat,
  BarChart3,
  UserCog,
  Target,
  CalendarDays,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
      { id: 'compras', nome: 'Compras', icone: ShoppingBag },
    ],
  },
  {
    titulo: 'Financeiro',
    itens: [
      { id: 'financeiro', nome: 'Financeiro', icone: Wallet },
      { id: 'despesasfixas', nome: 'Despesas fixas', icone: Repeat },
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
  const { usuario, ehAdmin } = useAuth();
  const iniciais = (usuario?.nome || '?')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <>
      {aberto && (
        <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden" onClick={onFechar} />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-line bg-card transition-transform duration-200 lg:translate-x-0 ${
          aberto ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo / marca */}
        <div className="flex h-16 items-center justify-between gap-2 px-5">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-accent-ink shadow-lg">
              <Sparkles size={18} />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-bold text-ink">Gestão Siqueira</p>
              <p className="text-[11px] text-muted">Sistema empresarial</p>
            </div>
          </div>
          <button
            onClick={onFechar}
            className="rounded-lg p-1.5 text-muted hover:bg-card2 lg:hidden"
            aria-label="Fechar menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
          {grupos.map((g) => (
            <div key={g.titulo}>
              <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
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
                          ? 'bg-accent text-accent-ink shadow-lg'
                          : 'text-muted hover:bg-card2 hover:text-ink'
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

        <div className="border-t border-line p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-sm font-semibold text-accent-ink">
              {iniciais}
            </span>
            <div className="leading-tight">
              <p className="text-sm font-medium text-ink">{usuario?.nome || 'Visitante'}</p>
              <p className="text-[11px] text-muted">{ehAdmin ? 'Administrador geral' : 'Convidado'}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
