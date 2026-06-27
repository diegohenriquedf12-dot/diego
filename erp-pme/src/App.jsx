import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { ERPProvider } from './context/ERPContext';
import { useAuth } from './context/AuthContext';
import Sidebar, { modulos } from './components/Sidebar';
import Header from './components/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Fornecedores from './pages/Fornecedores';
import Estoque from './pages/Estoque';
import Vendas from './pages/Vendas';
import Financeiro from './pages/Financeiro';
import FluxoCaixa from './pages/FluxoCaixa';
import Relatorios from './pages/Relatorios';
import Pedidos from './pages/Pedidos';
import Funcionarios from './pages/Funcionarios';
import Metas from './pages/Metas';
import Agenda from './pages/Agenda';

export default function App() {
  const { autenticado, somenteLeitura, pronto } = useAuth();
  const [pagina, setPagina] = useState('dashboard');
  const [menuAberto, setMenuAberto] = useState(false);
  // Tema: 'dark' ou 'light' (preferência salva no navegador)
  const [tema, setTema] = useState(() => localStorage.getItem('tema') || 'dark');

  useEffect(() => {
    localStorage.setItem('tema', tema);
    const raiz = document.documentElement;
    raiz.classList.toggle('dark', tema === 'dark');
    raiz.classList.toggle('light', tema === 'light');
  }, [tema]);

  const alternarTema = () => setTema((t) => (t === 'dark' ? 'light' : 'dark'));

  // Aguarda restaurar a sessão (Supabase) antes de decidir
  if (!pronto) {
    return <div className="grid min-h-screen place-items-center bg-canvas text-muted">Carregando…</div>;
  }

  // Sem login → tela de acesso
  if (!autenticado) {
    return <Login tema={tema} onAlternarTema={alternarTema} />;
  }

  const navegar = (id) => {
    setPagina(id);
    setMenuAberto(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const titulo = modulos.find((m) => m.id === pagina)?.nome || 'Dashboard';

  const paginas = {
    dashboard: <Dashboard irPara={navegar} />,
    pedidos: <Pedidos irPara={navegar} />,
    vendas: <Vendas />,
    estoque: <Estoque />,
    clientes: <Clientes />,
    fornecedores: <Fornecedores />,
    financeiro: <Financeiro />,
    fluxo: <FluxoCaixa />,
    funcionarios: <Funcionarios irPara={navegar} />,
    metas: <Metas irPara={navegar} />,
    agenda: <Agenda irPara={navegar} />,
    relatorios: <Relatorios />,
  };

  return (
    <ERPProvider>
      <div className="min-h-screen bg-canvas text-ink">
        <Sidebar
          ativo={pagina}
          onNavegar={navegar}
          aberto={menuAberto}
          onFechar={() => setMenuAberto(false)}
        />
        <div className="lg:pl-64">
          <Header
            titulo={titulo}
            onAbrirMenu={() => setMenuAberto(true)}
            tema={tema}
            onAlternarTema={alternarTema}
          />
          {somenteLeitura && (
            <div className="flex items-center justify-center gap-2 border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center text-xs font-medium text-amber-500">
              <Eye size={14} /> Modo convidado — somente leitura. Alterações estão desativadas.
            </div>
          )}
          <main key={pagina} className="mx-auto max-w-7xl animate-fade-up px-4 py-6 sm:px-6 lg:px-8">
            {paginas[pagina]}
          </main>
        </div>
      </div>
    </ERPProvider>
  );
}
