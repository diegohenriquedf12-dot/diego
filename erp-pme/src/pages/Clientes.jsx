import { useState } from 'react';
import { Plus, Pencil, Trash2, Users, Search } from 'lucide-react';
import { useERP } from '../context/ERPContext';
import { dataBR } from '../utils/format';
import { PageHeader, Card, EmptyState } from '../components/ui/Layout';
import DataTable from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Campo, Input, Select } from '../components/ui/Field';

const vazio = { nome: '', documento: '', email: '', telefone: '', cidade: '', uf: 'SP', status: 'ativo' };

export default function Clientes() {
  const { clientes, salvarCliente, removerCliente, somenteLeitura } = useERP();
  const [busca, setBusca] = useState('');
  const [modal, setModal] = useState(null); // null | objeto cliente

  const filtrados = clientes.filter((c) =>
    [c.nome, c.documento, c.email, c.cidade].join(' ').toLowerCase().includes(busca.toLowerCase())
  );

  const salvar = () => {
    if (!modal.nome.trim()) return;
    salvarCliente({ ...modal, desde: modal.desde || new Date().toISOString().slice(0, 10) });
    setModal(null);
  };

  const colunas = [
    {
      chave: 'nome',
      titulo: 'Cliente',
      render: (c) => (
        <div>
          <p className="font-medium text-ink">{c.nome}</p>
          <p className="text-xs text-muted">{c.documento}</p>
        </div>
      ),
    },
    { chave: 'email', titulo: 'Contato', render: (c) => (
      <div><p className="text-ink">{c.email}</p><p className="text-xs text-muted">{c.telefone}</p></div>
    ) },
    { chave: 'cidade', titulo: 'Local', render: (c) => `${c.cidade}/${c.uf}` },
    { chave: 'desde', titulo: 'Cliente desde', render: (c) => dataBR(c.desde) },
    { chave: 'status', titulo: 'Status', render: (c) => <Badge status={c.status} /> },
    {
      chave: 'acoes',
      titulo: '',
      alinhar: 'right',
      render: (c) =>
        somenteLeitura ? null : (
          <div className="flex justify-end gap-1">
            <button onClick={() => setModal(c)} className="rounded-lg p-1.5 text-muted hover:bg-card2 hover:text-ink" aria-label="Editar"><Pencil size={15} /></button>
            <button onClick={() => removerCliente(c.id)} className="rounded-lg p-1.5 text-muted hover:bg-rose-50 hover:text-rose-600" aria-label="Excluir"><Trash2 size={15} /></button>
          </div>
        ),
    },
  ];

  return (
    <div>
      <PageHeader
        titulo="Clientes"
        descricao={`${clientes.length} cadastrados · ${clientes.filter((c) => c.status === 'ativo').length} ativos`}
        acao={!somenteLeitura && <Button onClick={() => setModal({ ...vazio })}><Plus size={16} /> Novo cliente</Button>}
      />

      <Card>
        <div className="border-b border-line p-4">
          <div className="relative max-w-sm">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome, documento ou cidade..."
              className="w-full rounded-lg border border-line bg-card2 py-2 pl-9 pr-3 text-sm focus:border-accent focus:bg-card focus:outline-none focus:ring-2 focus:ring-accent/25"
            />
          </div>
        </div>
        <DataTable
          colunas={colunas}
          dados={filtrados}
          vazio={<EmptyState icone={Users} titulo="Nenhum cliente encontrado" descricao="Ajuste a busca ou cadastre um novo cliente." />}
        />
      </Card>

      <Modal
        aberto={!!modal}
        titulo={modal?.id ? 'Editar cliente' : 'Novo cliente'}
        onFechar={() => setModal(null)}
        rodape={
          <>
            <Button variant="secondary" onClick={() => setModal(null)}>Cancelar</Button>
            <Button onClick={salvar}>Salvar</Button>
          </>
        }
      >
        {modal && (
          <div className="space-y-4">
            <Campo label="Nome / Razão social"><Input value={modal.nome} onChange={(e) => setModal({ ...modal, nome: e.target.value })} placeholder="Ex.: Padaria Pão Quente" /></Campo>
            <Campo label="CPF / CNPJ"><Input value={modal.documento} onChange={(e) => setModal({ ...modal, documento: e.target.value })} placeholder="00.000.000/0000-00" /></Campo>
            <div className="grid grid-cols-2 gap-4">
              <Campo label="E-mail"><Input type="email" value={modal.email} onChange={(e) => setModal({ ...modal, email: e.target.value })} /></Campo>
              <Campo label="Telefone"><Input value={modal.telefone} onChange={(e) => setModal({ ...modal, telefone: e.target.value })} /></Campo>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2"><Campo label="Cidade"><Input value={modal.cidade} onChange={(e) => setModal({ ...modal, cidade: e.target.value })} /></Campo></div>
              <Campo label="UF"><Input maxLength={2} value={modal.uf} onChange={(e) => setModal({ ...modal, uf: e.target.value.toUpperCase() })} /></Campo>
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
