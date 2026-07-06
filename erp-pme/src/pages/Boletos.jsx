import { useState } from 'react';
import { Plus, Pencil, Trash2, CheckCircle2, Barcode, Search, AlertTriangle } from 'lucide-react';
import { useERP } from '../context/ERPContext';
import { moeda, dataBR, situacaoConta, hoje } from '../utils/format';
import { PageHeader, Card, EmptyState } from '../components/ui/Layout';
import DataTable from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Campo, Input } from '../components/ui/Field';

const vazio = () => ({ descricao: '', beneficiario: '', valor: '', vencimento: hoje(), status: 'pendente' });

export default function Boletos() {
  const { boletos, boletosAlerta, salvarBoleto, removerBoleto, somenteLeitura } = useERP();
  const [busca, setBusca] = useState('');
  const [mostrarPagos, setMostrarPagos] = useState(false); // por padrão oculta os pagos
  const [modal, setModal] = useState(null);

  const filtrados = boletos.filter(
    (b) =>
      (mostrarPagos || b.status !== 'pago') &&
      [b.descricao, b.beneficiario].join(' ').toLowerCase().includes(busca.toLowerCase())
  );

  const total = boletos.reduce((s, b) => s + (Number(b.valor) || 0), 0);
  const totalPendente = boletos
    .filter((b) => b.status !== 'pago')
    .reduce((s, b) => s + (Number(b.valor) || 0), 0);

  const salvar = () => {
    if (!(Number(modal.valor) > 0) || !modal.vencimento) return;
    salvarBoleto(modal);
    setModal(null);
  };

  const colunas = [
    { chave: 'descricao', titulo: 'Boleto', render: (b) => (
      <div><p className="font-medium text-ink">{b.descricao || 'Boleto'}</p><p className="text-xs text-muted">{b.beneficiario}</p></div>
    ) },
    { chave: 'vencimento', titulo: 'Vencimento', render: (b) => dataBR(b.vencimento) },
    { chave: 'valor', titulo: 'Valor total', alinhar: 'right', render: (b) => <span className="font-semibold text-rose-600">{moeda(b.valor)}</span> },
    { chave: 'status', titulo: 'Situação', render: (b) => <Badge status={situacaoConta({ status: b.status, vencimento: b.vencimento })} /> },
    { chave: 'acoes', titulo: '', alinhar: 'right', render: (b) =>
      somenteLeitura ? null : (
        <div className="flex justify-end gap-1">
          {b.status !== 'pago' && (
            <button onClick={() => salvarBoleto({ ...b, status: 'pago' })} className="rounded-lg p-1.5 text-muted hover:bg-emerald-50 hover:text-emerald-600" title="Marcar como pago"><CheckCircle2 size={15} /></button>
          )}
          <button onClick={() => setModal(b)} className="rounded-lg p-1.5 text-muted hover:bg-card2 hover:text-ink" aria-label="Editar"><Pencil size={15} /></button>
          <button onClick={() => removerBoleto(b.id)} className="rounded-lg p-1.5 text-muted hover:bg-rose-50 hover:text-rose-600" aria-label="Excluir"><Trash2 size={15} /></button>
        </div>
      ) },
  ];

  return (
    <div>
      <PageHeader
        titulo="Boletos"
        descricao="Boletos a pagar — com vencimento e valor total"
        acao={!somenteLeitura && <Button onClick={() => setModal(vazio())}><Plus size={16} /> Novo boleto</Button>}
      />

      {boletosAlerta?.total > 0 && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm font-medium text-amber-600">
          <AlertTriangle size={16} className="animate-pulse-alert" />
          {boletosAlerta.total} boleto(s) vencendo em até 5 dias
          {boletosAlerta.vencidos > 0 ? ` — sendo ${boletosAlerta.vencidos} já vencido(s)!` : '.'}
        </div>
      )}

      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Card className="p-4"><p className="text-xs font-medium text-muted">Total em boletos</p><p className="mt-1 text-xl font-semibold text-ink">{moeda(total)}</p></Card>
        <Card className="p-4"><p className="text-xs font-medium text-muted">A pagar</p><p className="mt-1 text-xl font-semibold text-rose-600">{moeda(totalPendente)}</p></Card>
        <Card className="p-4"><p className="text-xs font-medium text-muted">Quantidade</p><p className="mt-1 text-xl font-semibold text-ink">{boletos.length}</p></Card>
      </div>

      <Card>
        <div className="flex items-center gap-3 border-b border-line p-4">
          <div className="relative max-w-sm flex-1">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por descrição ou beneficiário..." className="w-full rounded-lg border border-line bg-card2 py-2 pl-9 pr-3 text-sm focus:border-accent focus:bg-card focus:outline-none focus:ring-2 focus:ring-accent/25" />
          </div>
          <button
            onClick={() => setMostrarPagos((v) => !v)}
            className={`shrink-0 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${mostrarPagos ? 'border-accent bg-accent text-accent-ink' : 'border-line text-muted hover:bg-card2'}`}
          >
            {mostrarPagos ? 'Ocultar pagos' : 'Mostrar pagos'}
          </button>
        </div>
        <DataTable colunas={colunas} dados={filtrados} vazio={<EmptyState icone={Barcode} titulo="Nenhum boleto" descricao="Cadastre boletos com vencimento e valor para controlar o que precisa pagar." />} />
      </Card>

      <Modal
        aberto={!!modal}
        titulo={modal?.id ? 'Editar boleto' : 'Novo boleto'}
        onFechar={() => setModal(null)}
        rodape={
          <>
            <Button variant="secondary" onClick={() => setModal(null)}>Cancelar</Button>
            <Button onClick={salvar} disabled={!(Number(modal?.valor) > 0) || !modal?.vencimento}>Salvar</Button>
          </>
        }
      >
        {modal && (
          <div className="space-y-4">
            <Campo label="Descrição"><Input value={modal.descricao} onChange={(e) => setModal({ ...modal, descricao: e.target.value })} placeholder="Ex.: Boleto fornecedor X" /></Campo>
            <Campo label="Beneficiário (quem recebe)"><Input value={modal.beneficiario} onChange={(e) => setModal({ ...modal, beneficiario: e.target.value })} placeholder="Nome da empresa/pessoa" /></Campo>
            <div className="grid grid-cols-2 gap-4">
              <Campo label="Valor total (R$)"><Input type="number" step="0.01" min="0" value={modal.valor} onChange={(e) => setModal({ ...modal, valor: e.target.value })} placeholder="0,00" /></Campo>
              <Campo label="Vencimento">
                <input type="date" value={modal.vencimento} onChange={(e) => setModal({ ...modal, vencimento: e.target.value })} className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25" />
              </Campo>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
