import { useMemo, useState } from 'react';
import { UserCog, Plus, Search, Users, Wallet, Building2, ArrowLeft, Trash2 } from 'lucide-react';
import { useERP } from '../context/ERPContext';
import { moeda, dataBR } from '../utils/format';
import { Card, PageHeader, EmptyState } from '../components/ui/Layout';
import { Campo, Input, Select } from '../components/ui/Field';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import DataTable from '../components/ui/DataTable';
import KpiCard from '../components/ui/KpiCard';

const vazio = {
  nome: '', cargo: '', departamento: '', salario: '', diaPagamento: 5, admissao: '',
  contato: '', email: '', status: 'ativo', ferias: 'Disponível',
};

export default function Funcionarios({ irPara }) {
  const { funcionarios, indicadores, salvarFuncionario, removerFuncionario, somenteLeitura } = useERP();
  const [busca, setBusca] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(vazio);

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return funcionarios.filter(
      (f) => !q || f.nome.toLowerCase().includes(q) || f.cargo.toLowerCase().includes(q) || f.departamento.toLowerCase().includes(q)
    );
  }, [funcionarios, busca]);

  const departamentos = new Set(funcionarios.map((f) => f.departamento)).size;

  const salvar = () => {
    if (!form.nome) return;
    salvarFuncionario({ ...form, salario: Number(form.salario) || 0, diaPagamento: Number(form.diaPagamento) || 5 });
    setModal(false);
  };

  const colunas = [
    {
      chave: 'nome',
      titulo: 'Funcionário',
      render: (f) => (
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-xs font-semibold text-accent-ink">
            {f.nome.split(' ').map((n) => n[0]).slice(0, 2).join('')}
          </span>
          <div>
            <p className="font-medium text-ink">{f.nome}</p>
            <p className="text-xs text-muted">{f.email}</p>
          </div>
        </div>
      ),
    },
    { chave: 'cargo', titulo: 'Cargo' },
    { chave: 'departamento', titulo: 'Departamento', render: (f) => <Badge>{f.departamento}</Badge> },
    { chave: 'salario', titulo: 'Salário', alinhar: 'right', render: (f) => moeda(f.salario) },
    { chave: 'admissao', titulo: 'Admissão', render: (f) => dataBR(f.admissao) },
    { chave: 'status', titulo: 'Status', render: (f) => <Badge status={f.status} /> },
    {
      chave: 'acoes',
      titulo: '',
      alinhar: 'right',
      render: (f) =>
        somenteLeitura ? null : (
          <div className="flex justify-end gap-1">
            <button onClick={() => { setForm(f); setModal(true); }} className="rounded-lg px-2 py-1 text-xs font-medium text-accent hover:bg-accent/10">Editar</button>
            <button onClick={() => removerFuncionario(f.id)} className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50" aria-label="Excluir"><Trash2 size={15} /></button>
          </div>
        ),
    },
  ];

  return (
    <div>
      <PageHeader
        titulo="Funcionários"
        descricao="Equipe, cargos e folha de pagamento."
        acao={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => irPara('dashboard')}><ArrowLeft size={16} /> Dashboard</Button>
            {!somenteLeitura && (
              <Button onClick={() => { setForm(vazio); setModal(true); }}><Plus size={16} /> Novo funcionário</Button>
            )}
          </div>
        }
      />

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard icone={Users} tom="blue" label="Colaboradores ativos" valor={indicadores.totalFuncionarios} />
        <KpiCard icone={Wallet} tom="emerald" label="Folha mensal" valor={indicadores.folha} formato={(n) => moeda(n)} />
        <KpiCard icone={Building2} tom="violet" label="Departamentos" valor={departamentos} />
      </div>

      <Card>
        <div className="border-b border-line p-4">
          <div className="relative max-w-sm">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar funcionário..."
              className="w-full rounded-lg border border-line bg-card2 py-2 pl-9 pr-3 text-sm focus:border-accent focus:bg-card focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>
        <DataTable
          colunas={colunas}
          dados={filtrados}
          vazio={<EmptyState icone={UserCog} titulo="Nenhum funcionário" descricao="Cadastre o primeiro colaborador." />}
        />
      </Card>

      <Modal
        aberto={modal}
        titulo={form.id ? 'Editar funcionário' : 'Novo funcionário'}
        onFechar={() => setModal(false)}
        rodape={
          <>
            <Button variant="ghost" onClick={() => setModal(false)}>Cancelar</Button>
            <Button onClick={salvar}>Salvar</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Campo label="Nome"><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></Campo>
          <Campo label="Cargo"><Input value={form.cargo} onChange={(e) => setForm({ ...form, cargo: e.target.value })} /></Campo>
          <Campo label="Departamento"><Input value={form.departamento} onChange={(e) => setForm({ ...form, departamento: e.target.value })} /></Campo>
          <Campo label="Salário (R$)"><Input type="number" step="0.01" value={form.salario} onChange={(e) => setForm({ ...form, salario: e.target.value })} /></Campo>
          <Campo label="Dia de pagamento">
            <Select value={form.diaPagamento ?? 5} onChange={(e) => setForm({ ...form, diaPagamento: Number(e.target.value) })}>
              {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => <option key={d} value={d}>Dia {d}</option>)}
            </Select>
          </Campo>
          <Campo label="Admissão"><Input type="date" value={form.admissao} onChange={(e) => setForm({ ...form, admissao: e.target.value })} /></Campo>
          <Campo label="Contato"><Input value={form.contato} onChange={(e) => setForm({ ...form, contato: e.target.value })} /></Campo>
          <Campo label="Email"><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Campo>
          <Campo label="Status">
            <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="ativo">Ativo</option>
              <option value="afastado">Afastado</option>
              <option value="inativo">Inativo</option>
            </Select>
          </Campo>
          <Campo label="Férias">
            <Select value={form.ferias} onChange={(e) => setForm({ ...form, ferias: e.target.value })}>
              <option>Disponível</option>
              <option>Agendada</option>
              <option>Em férias</option>
            </Select>
          </Campo>
        </div>
      </Modal>
    </div>
  );
}
