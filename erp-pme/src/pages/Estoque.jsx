import { useState } from 'react';
import { Plus, Pencil, Trash2, Package, Search, AlertTriangle } from 'lucide-react';
import { useERP } from '../context/ERPContext';
import { moeda, nivelEstoque } from '../utils/format';
import { PageHeader, Card, EmptyState } from '../components/ui/Layout';
import DataTable from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Campo, Input, Select } from '../components/ui/Field';

const categorias = ['Insumos', 'Embalagens', 'Bebidas', 'Componentes', 'Outros'];
const vazio = { nome: '', sku: '', categoria: 'Insumos', custo: 0, preco: 0, quantidade: 0, estoqueMinimo: 0, unidade: 'un' };

export default function Estoque() {
  const { produtos, salvarProduto, removerProduto, indicadores, somenteLeitura } = useERP();
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [modal, setModal] = useState(null);

  const filtrados = produtos.filter((p) => {
    const casa = [p.nome, p.sku, p.categoria].join(' ').toLowerCase().includes(busca.toLowerCase());
    const nivel = nivelEstoque(p);
    const passaFiltro = filtro === 'todos' || (filtro === 'baixo' && nivel !== 'ok');
    return casa && passaFiltro;
  });

  const salvar = () => {
    if (!modal.nome.trim()) return;
    salvarProduto({
      ...modal,
      custo: Number(modal.custo) || 0,
      preco: Number(modal.preco) || 0,
      quantidade: Number(modal.quantidade) || 0,
      estoqueMinimo: Number(modal.estoqueMinimo) || 0,
    });
    setModal(null);
  };

  const colunas = [
    { chave: 'nome', titulo: 'Produto', render: (p) => (
      <div><p className="font-medium text-ink">{p.nome}</p><p className="text-xs text-muted">{p.sku} · {p.categoria}</p></div>
    ) },
    { chave: 'preco', titulo: 'Preço venda', alinhar: 'right', render: (p) => moeda(p.preco) },
    { chave: 'custo', titulo: 'Custo', alinhar: 'right', render: (p) => <span className="text-muted">{moeda(p.custo)}</span> },
    { chave: 'quantidade', titulo: 'Qtd.', alinhar: 'right', render: (p) => (
      <span className="font-semibold text-ink">{p.quantidade} <span className="text-xs font-normal text-muted">{p.unidade}</span></span>
    ) },
    { chave: 'nivel', titulo: 'Situação', render: (p) => <Badge status={nivelEstoque(p)} /> },
    { chave: 'acoes', titulo: '', alinhar: 'right', render: (p) =>
      somenteLeitura ? null : (
        <div className="flex justify-end gap-1">
          <button onClick={() => setModal(p)} className="rounded-lg p-1.5 text-muted hover:bg-card2 hover:text-ink"><Pencil size={15} /></button>
          <button onClick={() => removerProduto(p.id)} className="rounded-lg p-1.5 text-muted hover:bg-rose-50 hover:text-rose-600"><Trash2 size={15} /></button>
        </div>
      ) },
  ];

  return (
    <div>
      <PageHeader
        titulo="Estoque"
        descricao={`${produtos.length} produtos · ${moeda(indicadores.valorEstoque)} em estoque`}
        acao={!somenteLeitura && <Button onClick={() => setModal({ ...vazio })}><Plus size={16} /> Novo produto</Button>}
      />

      {indicadores.estoqueBaixo > 0 && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertTriangle size={16} />
          {indicadores.estoqueBaixo} produto(s) no nível mínimo ou esgotado(s). Reabasteça para não perder vendas.
        </div>
      )}

      <Card>
        <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar produto ou SKU..." className="w-full rounded-lg border border-line bg-card2 py-2 pl-9 pr-3 text-sm focus:border-accent focus:bg-card focus:outline-none focus:ring-2 focus:ring-accent/25" />
          </div>
          <div className="flex gap-1 rounded-lg bg-card2 p-1 text-sm">
            {[['todos', 'Todos'], ['baixo', 'Estoque baixo']].map(([v, l]) => (
              <button key={v} onClick={() => setFiltro(v)} className={`rounded-md px-3 py-1.5 font-medium transition-colors ${filtro === v ? 'bg-card text-ink shadow-sm' : 'text-muted hover:text-ink'}`}>{l}</button>
            ))}
          </div>
        </div>
        <DataTable colunas={colunas} dados={filtrados} vazio={<EmptyState icone={Package} titulo="Nenhum produto encontrado" descricao="Cadastre produtos para controlar entradas, saídas e custos." />} />
      </Card>

      <Modal
        aberto={!!modal}
        titulo={modal?.id ? 'Editar produto' : 'Novo produto'}
        onFechar={() => setModal(null)}
        rodape={<><Button variant="secondary" onClick={() => setModal(null)}>Cancelar</Button><Button onClick={salvar}>Salvar</Button></>}
      >
        {modal && (
          <div className="space-y-4">
            <Campo label="Nome do produto"><Input value={modal.nome} onChange={(e) => setModal({ ...modal, nome: e.target.value })} /></Campo>
            <div className="grid grid-cols-2 gap-4">
              <Campo label="SKU / Código"><Input value={modal.sku} onChange={(e) => setModal({ ...modal, sku: e.target.value })} /></Campo>
              <Campo label="Categoria">
                <Select value={modal.categoria} onChange={(e) => setModal({ ...modal, categoria: e.target.value })}>
                  {categorias.map((c) => <option key={c}>{c}</option>)}
                </Select>
              </Campo>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Campo label="Custo (R$)"><Input type="number" step="0.01" min="0" value={modal.custo} onChange={(e) => setModal({ ...modal, custo: e.target.value })} /></Campo>
              <Campo label="Preço de venda (R$)"><Input type="number" step="0.01" min="0" value={modal.preco} onChange={(e) => setModal({ ...modal, preco: e.target.value })} /></Campo>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Campo label="Quantidade"><Input type="number" min="0" value={modal.quantidade} onChange={(e) => setModal({ ...modal, quantidade: e.target.value })} /></Campo>
              <Campo label="Estoque mínimo"><Input type="number" min="0" value={modal.estoqueMinimo} onChange={(e) => setModal({ ...modal, estoqueMinimo: e.target.value })} /></Campo>
              <Campo label="Unidade"><Input value={modal.unidade} onChange={(e) => setModal({ ...modal, unidade: e.target.value })} placeholder="un, kg, cx" /></Campo>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
