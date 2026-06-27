import { useState } from 'react';
import { Plus, Pencil, Trash2, Repeat, CalendarPlus, CheckCircle2 } from 'lucide-react';
import { useERP } from '../context/ERPContext';
import { moeda } from '../utils/format';
import { PageHeader, Card, EmptyState } from '../components/ui/Layout';
import DataTable from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Campo, Input, Select } from '../components/ui/Field';

const categorias = ['Aluguel', 'Salários', 'Energia', 'Água', 'Internet/Telefone', 'Impostos', 'Software/Assinaturas', 'Outros'];
const vazia = () => ({ descricao: '', categoria: 'Aluguel', valor: '', diaVencimento: 5, status: 'ativo' });

const mesAtualLabel = () =>
  new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

export default function DespesasFixas() {
  const { despesasFixas, salvarDespesaFixa, removerDespesaFixa, lancarDespesasFixasNoMes, somenteLeitura } = useERP();
  const [modal, setModal] = useState(null);
  const [aviso, setAviso] = useState('');

  const ativas = despesasFixas.filter((f) => f.status !== 'inativo');
  const totalMensal = ativas.reduce((s, f) => s + (Number(f.valor) || 0), 0);

  const salvar = () => {
    if (!modal.descricao.trim() || !(Number(modal.valor) > 0)) return;
    salvarDespesaFixa({ ...modal, valor: Number(modal.valor) || 0, diaVencimento: Number(modal.diaVencimento) || 1 });
    setModal(null);
  };

  const lancar = () => {
    const n = lancarDespesasFixasNoMes();
    setAviso(
      n > 0
        ? `${n} despesa(s) fixa(s) lançada(s) em ${mesAtualLabel()}. Veja no Financeiro → A pagar.`
        : `Nenhuma despesa nova para lançar — as fixas ativas de ${mesAtualLabel()} já foram lançadas.`
    );
    setTimeout(() => setAviso(''), 6000);
  };

  const colunas = [
    { chave: 'descricao', titulo: 'Despesa', render: (f) => (
      <div><p className="font-medium text-ink">{f.descricao}</p><p className="text-xs text-muted">{f.categoria}</p></div>
    ) },
    { chave: 'diaVencimento', titulo: 'Vence dia', render: (f) => `Dia ${f.diaVencimento}` },
    { chave: 'valor', titulo: 'Valor / mês', alinhar: 'right', render: (f) => <span className="font-semibold text-rose-600">{moeda(f.valor)}</span> },
    { chave: 'status', titulo: 'Status', render: (f) => <Badge status={f.status || 'ativo'} /> },
    { chave: 'acoes', titulo: '', alinhar: 'right', render: (f) =>
      somenteLeitura ? null : (
        <div className="flex justify-end gap-1">
          <button onClick={() => setModal(f)} className="rounded-lg p-1.5 text-muted hover:bg-card2 hover:text-ink" aria-label="Editar"><Pencil size={15} /></button>
          <button onClick={() => removerDespesaFixa(f.id)} className="rounded-lg p-1.5 text-muted hover:bg-rose-50 hover:text-rose-600" aria-label="Excluir"><Trash2 size={15} /></button>
        </div>
      ) },
  ];

  return (
    <div>
      <PageHeader
        titulo="Despesas fixas"
        descricao="Lançadas automaticamente todo mês no Financeiro. Use o botão para forçar o lançamento agora."
        acao={!somenteLeitura && (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={lancar}><CalendarPlus size={16} /> Lançar agora</Button>
            <Button onClick={() => setModal(vazia())}><Plus size={16} /> Nova despesa fixa</Button>
          </div>
        )}
      />

      {aviso && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-600">
          <CheckCircle2 size={16} /> {aviso}
        </div>
      )}

      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Card className="p-4"><p className="text-xs font-medium text-muted">Total fixo mensal</p><p className="mt-1 text-xl font-semibold text-rose-600">{moeda(totalMensal)}</p></Card>
        <Card className="p-4"><p className="text-xs font-medium text-muted">Despesas ativas</p><p className="mt-1 text-xl font-semibold text-ink">{ativas.length}</p></Card>
        <Card className="p-4"><p className="text-xs font-medium text-muted">Cadastradas</p><p className="mt-1 text-xl font-semibold text-ink">{despesasFixas.length}</p></Card>
      </div>

      <Card>
        <DataTable colunas={colunas} dados={despesasFixas} vazio={<EmptyState icone={Repeat} titulo="Nenhuma despesa fixa" descricao="Cadastre custos recorrentes para lançá-los no Financeiro a cada mês com um clique." />} />
      </Card>

      <Modal
        aberto={!!modal}
        titulo={modal?.id ? 'Editar despesa fixa' : 'Nova despesa fixa'}
        onFechar={() => setModal(null)}
        rodape={
          <>
            <Button variant="secondary" onClick={() => setModal(null)}>Cancelar</Button>
            <Button onClick={salvar} disabled={!modal?.descricao?.trim() || !(Number(modal?.valor) > 0)}>Salvar</Button>
          </>
        }
      >
        {modal && (
          <div className="space-y-4">
            <Campo label="Descrição"><Input value={modal.descricao} onChange={(e) => setModal({ ...modal, descricao: e.target.value })} placeholder="Ex.: Aluguel da loja" /></Campo>
            <div className="grid grid-cols-2 gap-4">
              <Campo label="Categoria">
                <Select value={modal.categoria} onChange={(e) => setModal({ ...modal, categoria: e.target.value })}>
                  {categorias.map((c) => <option key={c}>{c}</option>)}
                </Select>
              </Campo>
              <Campo label="Valor mensal (R$)"><Input type="number" step="0.01" min="0" value={modal.valor} onChange={(e) => setModal({ ...modal, valor: e.target.value })} placeholder="0,00" /></Campo>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Campo label="Vence no dia">
                <Select value={modal.diaVencimento} onChange={(e) => setModal({ ...modal, diaVencimento: Number(e.target.value) })}>
                  {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => <option key={d} value={d}>{d}</option>)}
                </Select>
              </Campo>
              <Campo label="Status">
                <Select value={modal.status} onChange={(e) => setModal({ ...modal, status: e.target.value })}>
                  <option value="ativo">Ativa</option>
                  <option value="inativo">Inativa</option>
                </Select>
              </Campo>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
