import { useState } from 'react';
import { Plus, Pencil, Trash2, Truck, Search } from 'lucide-react';
import { useERP } from '../context/ERPContext';
import { PageHeader, Card, EmptyState } from '../components/ui/Layout';
import DataTable from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Campo, Input, Select } from '../components/ui/Field';

const categorias = ['Matéria-prima', 'Embalagens', 'Componentes', 'Serviços', 'Escritório', 'Outros'];
const vazio = { nome: '', documento: '', email: '', telefone: '', categoria: 'Matéria-prima', status: 'ativo', prazo: 30 };

export default function Fornecedores() {
  const { fornecedores, salvarFornecedor, removerFornecedor } = useERP();
  const [busca, setBusca] = useState('');
  const [modal, setModal] = useState(null);

  const filtrados = fornecedores.filter((f) =>
    [f.nome, f.documento, f.categoria].join(' ').toLowerCase().includes(busca.toLowerCase())
  );

  const salvar = () => {
    if (!modal.nome.trim()) return;
    salvarFornecedor({ ...modal, prazo: Number(modal.prazo) || 0 });
    setModal(null);
  };

  const colunas = [
    { chave: 'nome', titulo: 'Fornecedor', render: (f) => (
      <div><p className="font-medium text-slate-900">{f.nome}</p><p className="text-xs text-slate-500">{f.documento}</p></div>
    ) },
    { chave: 'categoria', titulo: 'Categoria', render: (f) => (
      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{f.categoria}</span>
    ) },
    { chave: 'email', titulo: 'Contato', render: (f) => (
      <div><p className="text-slate-700">{f.email}</p><p className="text-xs text-slate-500">{f.telefone}</p></div>
    ) },
    { chave: 'prazo', titulo: 'Prazo pgto.', render: (f) => `${f.prazo} dias` },
    { chave: 'status', titulo: 'Status', render: (f) => <Badge status={f.status} /> },
    { chave: 'acoes', titulo: '', alinhar: 'right', render: (f) => (
      <div className="flex justify-end gap-1">
        <button onClick={() => setModal(f)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Editar"><Pencil size={15} /></button>
        <button onClick={() => removerFornecedor(f.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Excluir"><Trash2 size={15} /></button>
      </div>
    ) },
  ];

  return (
    <div>
      <PageHeader
        titulo="Fornecedores"
        descricao={`${fornecedores.length} cadastrados`}
        acao={<Button onClick={() => setModal({ ...vazio })}><Plus size={16} /> Novo fornecedor</Button>}
      />
      <Card>
        <div className="border-b border-slate-100 p-4">
          <div className="relative max-w-sm">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar fornecedor..." className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
          </div>
        </div>
        <DataTable colunas={colunas} dados={filtrados} vazio={<EmptyState icone={Truck} titulo="Nenhum fornecedor encontrado" descricao="Cadastre fornecedores para controlar compras e prazos." />} />
      </Card>

      <Modal
        aberto={!!modal}
        titulo={modal?.id ? 'Editar fornecedor' : 'Novo fornecedor'}
        onFechar={() => setModal(null)}
        rodape={<><Button variant="secondary" onClick={() => setModal(null)}>Cancelar</Button><Button onClick={salvar}>Salvar</Button></>}
      >
        {modal && (
          <div className="space-y-4">
            <Campo label="Nome / Razão social"><Input value={modal.nome} onChange={(e) => setModal({ ...modal, nome: e.target.value })} /></Campo>
            <Campo label="CNPJ"><Input value={modal.documento} onChange={(e) => setModal({ ...modal, documento: e.target.value })} /></Campo>
            <div className="grid grid-cols-2 gap-4">
              <Campo label="E-mail"><Input type="email" value={modal.email} onChange={(e) => setModal({ ...modal, email: e.target.value })} /></Campo>
              <Campo label="Telefone"><Input value={modal.telefone} onChange={(e) => setModal({ ...modal, telefone: e.target.value })} /></Campo>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Campo label="Categoria">
                <Select value={modal.categoria} onChange={(e) => setModal({ ...modal, categoria: e.target.value })}>
                  {categorias.map((c) => <option key={c}>{c}</option>)}
                </Select>
              </Campo>
              <Campo label="Prazo de pagamento (dias)"><Input type="number" min="0" value={modal.prazo} onChange={(e) => setModal({ ...modal, prazo: e.target.value })} /></Campo>
            </div>
            <Campo label="Status">
              <Select value={modal.status} onChange={(e) => setModal({ ...modal, status: e.target.value })}>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </Select>
            </Campo>
          </div>
        )}
      </Modal>
    </div>
  );
}
