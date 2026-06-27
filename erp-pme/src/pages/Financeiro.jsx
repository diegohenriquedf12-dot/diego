import { useState } from 'react';
import { Plus, ArrowDownCircle, ArrowUpCircle, CheckCircle2, Trash2, Wallet } from 'lucide-react';
import { useERP } from '../context/ERPContext';
import { moeda, dataBR, situacaoConta, hoje } from '../utils/format';
import { PageHeader, Card, EmptyState } from '../components/ui/Layout';
import DataTable from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Campo, Input, Select } from '../components/ui/Field';

const vazio = { tipo: 'receber', descricao: '', valor: 0, vencimento: hoje(), status: 'pendente', categoria: 'Vendas' };

export default function Financeiro() {
  const { contas, indicadores, salvarConta, removerConta, quitarConta } = useERP();
  const [aba, setAba] = useState('todas'); // todas | receber | pagar
  const [modal, setModal] = useState(null);

  const filtradas = contas.filter((c) => aba === 'todas' || c.tipo === aba);

  const salvar = () => {
    if (!modal.descricao.trim()) return;
    salvarConta({ ...modal, valor: Number(modal.valor) || 0 });
    setModal(null);
  };

  const colunas = [
    { chave: 'tipo', titulo: 'Tipo', render: (c) => (
      <span className="inline-flex items-center gap-1.5">
        {c.tipo === 'receber'
          ? <ArrowUpCircle size={16} className="text-emerald-500" />
          : <ArrowDownCircle size={16} className="text-rose-500" />}
        <Badge status={c.tipo} />
      </span>
    ) },
    { chave: 'descricao', titulo: 'Descrição', render: (c) => (
      <div><p className="font-medium text-ink">{c.descricao}</p><p className="text-xs text-muted">{c.categoria}</p></div>
    ) },
    { chave: 'vencimento', titulo: 'Vencimento', render: (c) => dataBR(c.vencimento) },
    { chave: 'valor', titulo: 'Valor', alinhar: 'right', render: (c) => (
      <span className={`font-semibold ${c.tipo === 'receber' ? 'text-emerald-600' : 'text-rose-600'}`}>
        {c.tipo === 'receber' ? '+' : '−'} {moeda(c.valor)}
      </span>
    ) },
    { chave: 'status', titulo: 'Situação', render: (c) => <Badge status={situacaoConta(c)} /> },
    { chave: 'acoes', titulo: '', alinhar: 'right', render: (c) => (
      <div className="flex justify-end gap-1">
        {c.status !== 'pago' && (
          <button onClick={() => quitarConta(c.id)} className="rounded-lg p-1.5 text-muted hover:bg-emerald-50 hover:text-emerald-600" title="Marcar como pago"><CheckCircle2 size={15} /></button>
        )}
        <button onClick={() => removerConta(c.id)} className="rounded-lg p-1.5 text-muted hover:bg-rose-50 hover:text-rose-600"><Trash2 size={15} /></button>
      </div>
    ) },
  ];

  return (
    <div>
      <PageHeader
        titulo="Financeiro"
        descricao="Contas a pagar e a receber"
        acao={<Button onClick={() => setModal({ ...vazio })}><Plus size={16} /> Novo lançamento</Button>}
      />

      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="p-4"><p className="text-xs font-medium text-muted">A receber</p><p className="mt-1 text-xl font-semibold text-emerald-600">{moeda(indicadores.aReceber)}</p></Card>
        <Card className="p-4"><p className="text-xs font-medium text-muted">A pagar</p><p className="mt-1 text-xl font-semibold text-rose-600">{moeda(indicadores.aPagar)}</p></Card>
        <Card className="p-4"><p className="text-xs font-medium text-muted">Recebido</p><p className="mt-1 text-xl font-semibold text-ink">{moeda(indicadores.recebido)}</p></Card>
        <Card className="p-4"><p className="text-xs font-medium text-muted">Saldo previsto</p><p className="mt-1 text-xl font-semibold text-ink">{moeda(indicadores.aReceber - indicadores.aPagar)}</p></Card>
      </div>

      <Card>
        <div className="flex gap-1 border-b border-line p-3">
          {[['todas', 'Todas'], ['receber', 'A receber'], ['pagar', 'A pagar']].map(([v, l]) => (
            <button key={v} onClick={() => setAba(v)} className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${aba === v ? 'bg-accent text-accent-ink' : 'text-muted hover:bg-card2'}`}>{l}</button>
          ))}
        </div>
        <DataTable colunas={colunas} dados={filtradas} vazio={<EmptyState icone={Wallet} titulo="Nenhum lançamento" descricao="Registre contas a pagar e a receber para controlar seu caixa." />} />
      </Card>

      <Modal
        aberto={!!modal}
        titulo={modal?.id ? 'Editar lançamento' : 'Novo lançamento'}
        onFechar={() => setModal(null)}
        rodape={<><Button variant="secondary" onClick={() => setModal(null)}>Cancelar</Button><Button onClick={salvar}>Salvar</Button></>}
      >
        {modal && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {[['receber', 'A receber', ArrowUpCircle], ['pagar', 'A pagar', ArrowDownCircle]].map(([v, l, Ic]) => (
                <button key={v} onClick={() => setModal({ ...modal, tipo: v })} className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${modal.tipo === v ? (v === 'receber' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-rose-500 bg-rose-50 text-rose-700') : 'border-line text-muted hover:bg-card2'}`}>
                  <Ic size={16} /> {l}
                </button>
              ))}
            </div>
            <Campo label="Descrição"><Input value={modal.descricao} onChange={(e) => setModal({ ...modal, descricao: e.target.value })} placeholder="Ex.: Aluguel, NF fornecedor..." /></Campo>
            <div className="grid grid-cols-2 gap-4">
              <Campo label="Valor (R$)"><Input type="number" step="0.01" min="0" value={modal.valor} onChange={(e) => setModal({ ...modal, valor: e.target.value })} /></Campo>
              <Campo label="Vencimento">
                <input type="date" value={modal.vencimento} onChange={(e) => setModal({ ...modal, vencimento: e.target.value })} className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
              </Campo>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Campo label="Categoria"><Input value={modal.categoria} onChange={(e) => setModal({ ...modal, categoria: e.target.value })} /></Campo>
              <Campo label="Situação">
                <Select value={modal.status} onChange={(e) => setModal({ ...modal, status: e.target.value })}>
                  <option value="pendente">Pendente</option>
                  <option value="pago">Pago</option>
                </Select>
              </Campo>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
