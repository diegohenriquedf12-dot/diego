import { useState } from 'react';
import { ERPProvider } from './context/ERPContext';
import Sidebar, { modulos } from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Fornecedores from './pages/Fornecedores';
import Estoque from './pages/Estoque';
import Vendas from './pages/Vendas';
import Financeiro from './pages/Financeiro';
import FluxoCaixa from './pages/FluxoCaixa';
import Relatorios from './pages/Relatorios';

export default function App() {
  const [pagina, setPagina] = useState('dashboard');
  const [menuAberto, setMenuAberto] = useState(false);

  const navegar = (id) => {
    setPagina(id);
    setMenuAberto(false);
  };

  const titulo = modulos.find((m) => m.id === pagina)?.nome || 'Dashboard';

  const paginas = {
    dashboard: <Dashboard irPara={navegar} />,
    clientes: <Clientes />,
    fornecedores: <Fornecedores />,
    estoque: <Estoque />,
    vendas: <Vendas />,
    financeiro: <Financeiro />,
    fluxo: <FluxoCaixa />,
    relatorios: <Relatorios />,
  };

  return (
    <ERPProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Sidebar
          ativo={pagina}
          onNavegar={navegar}
          aberto={menuAberto}
          onFechar={() => setMenuAberto(false)}
        />
        <div className="lg:pl-64">
          <Header titulo={titulo} onAbrirMenu={() => setMenuAberto(true)} />
          <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {paginas[pagina]}
          </main>
        </div>
      </div>
    </ERPProvider>
  );
}
