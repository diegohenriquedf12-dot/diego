import { useState } from 'react';
import { Plus, Pencil, Trash2, CheckCircle2, Truck, Search } from 'lucide-react';
import { useERP } from '../context/ERPContext';
import { moeda, dataBR, hoje } from '../utils/format';
import { PageHeader, Card, EmptyState } from '../components/ui/Layout';
import DataTable from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Campo, Input, Select } from '../components/ui/Field';

const vazia = () => ({
  numero: '',
  fornecedor: 'Distribuidora Siqueira Bikes',
  data: hoje(),
  pagamento: 'Dinheiro',
  valor: '',
  status: 'pendente',
});

export default function Compras() {
  const { compras, salvarCompra, removerCompra, somenteLeitura } = useERP();
  const [busca, setBusca] = useState('');
  const [mostrarPagas, setMostrarPagas] = useState(false); // por padrão oculta as pagas
  const [modal, setModal] = useState(null);

  const filtradas = compras.filter(
    (c) =>
      (mostrarPagas || c.status !== 'pago') &&
      [c.numero, c.fornecedor, c.pagamento].join(' ').toLowerCase().includes(busca.toLowerCase())
  );

  const total = compras.reduce((s, c) => s + (Number(c.valor) || 0), 0);
  const totalPendente = compras
    .filter((c) => c.status !== 'pago')
    .reduce((s, c) => s + (Number(c.valor) || 0), 0);

  const salvar = () => {
    if (!modal.fornecedor.trim() || !(Number(modal.valor) > 0)) return;
    salvarCompra(modal);
    setModal(null);
  };

  const colunas = [
    { chave: 'numero', titulo: 'Nº', render: (c) => <span className="font-mono text-xs font-medium text-ink">{c.numero || '—'}</span> },
    { chave: 'fornecedor', titulo: 'Fornecedor', render: (c) => <span className="font-medium text-ink">{c.fornecedor}</span> },
    { chave: 'data', titulo: 'Data', render: (c) => dataBR(c.data) },
    { chave: 'pagamento', titulo: 'Pagamento', render: (c) => (
      <span className="rounded-md bg-card2 px-2 py-0.5 text-xs font-medium text-muted">{c.pagamento}</span>
    ) },
    { chave: 'valor', titulo: 'Valor', alinhar: 'right', render: (c) => <span className="font-semibold text-rose-600">{moeda(c.valor)}</span> },
    { chave: 'status', titulo: 'Situação', render: (c) => <Badge status={c.status} /> },
    { chave: 'acoes', titulo: '', alinhar: 'right', render: (c) =>
      somenteLeitura ? null : (
        <div className="flex justify-end gap-1">
          {c.status !== 'pago' && (
            <button onClick={() => salvarCompra({ ...c, status: 'pago' })} className="rounded-lg p-1.5 text-muted hover:bg-emerald-50 hover:text-emerald-600" title="Marcar como paga"><CheckCircle2 size={15} /></button>
          )}
          <button onClick={() => setModal({ ...c })} className="rounded-lg p-1.5 text-muted hover:bg-card2 hover:text-ink" aria-label="Editar"><Pencil size={15} /></button>
          <button onClick={() => removerCompra(c.id)} className="rounded-lg p-1.5 text-muted hover:bg-rose-50 hover:text-rose-600" aria-label="Excluir"><Trash2 size={15} /></button>
        </div>
      ) },
  ];

  return (
    <div>
      <PageHeader
        titulo="Compras"
        descricao={`${compras.length} compras registradas`}
        acao={!somenteLeitura && <Button onClick={() => setModal(vazia())}><Plus size={16} /> Nova compra</Button>}
      />

      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Card className="p-4"><p className="text-xs font-medium text-muted">Total em compras</p><p className="mt-1 text-xl font-semibold text-ink">{moeda(total)}</p></Card>
        <Card className="p-4"><p className="text-xs font-medium text-muted">A pagar</p><p className="mt-1 text-xl font-semibold text-rose-600">{moeda(totalPendente)}</p></Card>
        <Card className="p-4"><p className="text-xs font-medium text-muted">Quantidade</p><p className="mt-1 text-xl font-semibold text-ink">{compras.length}</p></Card>
      </div>

      <Card>
        <div className="flex items-center gap-3 border-b border-line p-4">
          <div className="relative max-w-sm flex-1">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por nº ou fornecedor..." className="w-full rounded-lg border border-line bg-card2 py-2 pl-9 pr-3 text-sm focus:border-accent focus:bg-card focus:outline-none focus:ring-2 focus:ring-accent/25" />
          </div>
          <button
            onClick={() => setMostrarPagas((v) => !v)}
            className={`shrink-0 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${mostrarPagas ? 'border-accent bg-accent text-accent-ink' : 'border-line text-muted hover:bg-card2'}`}
          >
            {mostrarPagas ? 'Ocultar pagas' : 'Mostrar pagas'}
          </button>
        </div>
        <DataTable colunas={colunas} dados={filtradas} vazio={<EmptyState icone={Truck} titulo="Nenhuma compra registrada" descricao="Registre compras para controlar o que você precisa pagar aos fornecedores." />} />
      </Card>

      <Modal
        aberto={!!modal}
        titulo={modal?.id ? 'Editar compra' : 'Nova compra'}
        onFechar={() => setModal(null)}
        rodape={
          <>
            <Button variant="secondary" onClick={() => setModal(null)}>Cancelar</Button>
            <Button onClick={salvar} disabled={!modal?.fornecedor?.trim() || !(Number(modal?.valor) > 0)}>Salvar</Button>
          </>
        }
      >
        {modal && (
          <div className="space-y-4">
            <Campo label="Fornecedor"><Input value={modal.fornecedor} onChange={(e) => setModal({ ...modal, fornecedor: e.target.value })} placeholder="Nome do fornecedor" /></Campo>
            <div className="grid grid-cols-2 gap-4">
              <Campo label="Nº do pedido"><Input value={modal.numero} onChange={(e) => setModal({ ...modal, numero: e.target.value })} placeholder="Opcional" /></Campo>
              <Campo label="Valor (R$)"><Input type="number" step="0.01" min="0" value={modal.valor} onChange={(e) => setModal({ ...modal, valor: e.target.value })} placeholder="0,00" /></Campo>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Campo label="Data">
                <input type="date" value={modal.data} onChange={(e) => setModal({ ...modal, data: e.target.value })} className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25" />
              </Campo>
              <Campo label="Forma de pagamento">
                <Select value={modal.pagamento} onChange={(e) => setModal({ ...modal, pagamento: e.target.value })}>
                  {['Dinheiro', 'PIX', 'Cartão', 'Boleto'].map((p) => <option key={p}>{p}</option>)}
                </Select>
              </Campo>
            </div>
            <Campo label="Situação">
              <Select value={modal.status} onChange={(e) => setModal({ ...modal, status: e.target.value })}>
                <option value="pendente">Pendente (a pagar)</option>
                <option value="pago">Paga</option>
              </Select>
            </Campo>
          </div>
        )}
      </Modal>
    </div>
  );
}
