import { useMemo, useState } from 'react';
import {
  ClipboardList,
  Plus,
  Search,
  Truck,
  PackageCheck,
  PackageSearch,
  Box,
  XCircle,
  ArrowLeft,
} from 'lucide-react';
import { useERP } from '../context/ERPContext';
import { etapasPedido } from '../data/seed';
import { moeda, dataBR } from '../utils/format';
import { Card, PageHeader, EmptyState } from '../components/ui/Layout';
import { Campo, Input, Select } from '../components/ui/Field';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';

const passoIcone = { recebido: Box, separacao: PackageSearch, enviado: Truck, entregue: PackageCheck };
const passoRotulo = { recebido: 'Recebido', separacao: 'Separação', enviado: 'Enviado', entregue: 'Entregue' };

// Barra de progresso de rastreamento com etapas animadas
function RastreioProgresso({ status }) {
  const cancelado = status === 'cancelado';
  const idx = etapasPedido.indexOf(status);
  const pct = cancelado ? 0 : (idx / (etapasPedido.length - 1)) * 100;

  return (
    <div>
      <div className="relative mb-3 h-1.5 w-full rounded-full bg-card2">
        <div
          className={`absolute inset-y-0 left-0 rounded-full ${cancelado ? 'bg-rose-400' : 'bg-gradient-to-r from-accent to-pos'}`}
          style={{ width: `${cancelado ? 100 : pct}%`, transition: 'width 1s cubic-bezier(.16,1,.3,1)' }}
        />
      </div>
      <div className="flex justify-between">
        {etapasPedido.map((etapa, i) => {
          const Icone = passoIcone[etapa];
          const ativo = !cancelado && i <= idx;
          const atual = !cancelado && i === idx;
          return (
            <div key={etapa} className="flex flex-1 flex-col items-center gap-1">
              <span
                className={`grid h-7 w-7 place-items-center rounded-full text-white transition-all duration-500 ${
                  ativo ? 'bg-accent' : 'bg-card2 text-muted'
                } ${atual ? 'ring-4 ring-accent' : ''}`}
              >
                <Icone size={14} />
              </span>
              <span className={`text-[10px] font-medium ${ativo ? 'text-ink' : 'text-muted'}`}>
                {passoRotulo[etapa]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const vazioForm = {
  clienteId: '',
  produto: '',
  qtd: 1,
  valor: '',
  data: new Date().toISOString().slice(0, 10),
  transportadora: '',
  rastreio: '',
  status: 'recebido',
  pagamento: 'pendente',
  entregaPrevista: '',
  entregaRealizada: '',
};

export default function Pedidos({ irPara }) {
  const { pedidos, clientes, salvarPedido, removerPedido } = useERP();
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(vazioForm);

  const nomeCliente = (id) => clientes.find((c) => c.id === id)?.nome || 'Cliente';

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return pedidos.filter((p) => {
      const okStatus = filtro === 'todos' || p.status === filtro;
      const okBusca =
        !q ||
        p.id.toLowerCase().includes(q) ||
        p.produto.toLowerCase().includes(q) ||
        nomeCliente(p.clienteId).toLowerCase().includes(q);
      return okStatus && okBusca;
    });
  }, [pedidos, busca, filtro, clientes]);

  const abrirNovo = () => {
    setForm(vazioForm);
    setModal(true);
  };

  const salvar = () => {
    if (!form.clienteId || !form.produto) return;
    salvarPedido({ ...form, qtd: Number(form.qtd), valor: Number(form.valor) || 0 });
    setModal(false);
  };

  const filtros = [
    { id: 'todos', nome: 'Todos' },
    { id: 'recebido', nome: 'Recebidos' },
    { id: 'separacao', nome: 'Separação' },
    { id: 'enviado', nome: 'Enviados' },
    { id: 'entregue', nome: 'Entregues' },
    { id: 'cancelado', nome: 'Cancelados' },
  ];

  return (
    <div>
      <PageHeader
        titulo="Pedidos"
        descricao="Acompanhe cada pedido do recebimento à entrega."
        acao={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => irPara('dashboard')}>
              <ArrowLeft size={16} /> Dashboard
            </Button>
            <Button onClick={abrirNovo}>
              <Plus size={16} /> Novo pedido
            </Button>
          </div>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nº, cliente ou produto..."
            className="w-full rounded-lg border border-line bg-card py-2 pl-9 pr-3 text-sm shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {filtros.map((f) => (
            <button
              key={f.id}
              onClick={() => setFiltro(f.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                filtro === f.id ? 'bg-accent text-white shadow-sm' : 'bg-card text-muted ring-1 ring-line hover:bg-card2'
              }`}
            >
              {f.nome}
            </button>
          ))}
        </div>
      </div>

      {filtrados.length === 0 ? (
        <Card>
          <EmptyState icone={ClipboardList} titulo="Nenhum pedido encontrado" descricao="Ajuste os filtros ou cadastre um novo pedido." />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 stagger md:grid-cols-2 xl:grid-cols-3">
          {filtrados.map((p) => (
            <Card key={p.id} className="card-lift overflow-hidden p-5">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted">#{p.id.replace('pd', '')}</p>
                  <h3 className="text-sm font-semibold text-ink">{nomeCliente(p.clienteId)}</h3>
                  <p className="text-xs text-muted">{p.qtd}× {p.produto}</p>
                </div>
                <div className="text-right">
                  <p className="text-base font-bold text-ink">{moeda(p.valor)}</p>
                  <Badge status={p.status}>{passoRotulo[p.status] || p.status}</Badge>
                </div>
              </div>

              <RastreioProgresso status={p.status} />

              <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-xs text-muted">
                <span className="inline-flex items-center gap-1">
                  <Truck size={13} /> {p.transportadora || '—'}
                </span>
                <span>Prev. {dataBR(p.entregaPrevista)}</span>
              </div>
              {p.rastreio && (
                <p className="mt-1 font-mono text-[11px] text-muted">Rastreio: {p.rastreio}</p>
              )}

              <div className="mt-3 flex gap-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    setForm(p);
                    setModal(true);
                  }}
                >
                  Editar
                </Button>
                <Button variant="danger" onClick={() => removerPedido(p.id)} aria-label="Excluir">
                  <XCircle size={16} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        aberto={modal}
        titulo={form.id ? 'Editar pedido' : 'Novo pedido'}
        onFechar={() => setModal(false)}
        rodape={
          <>
            <Button variant="ghost" onClick={() => setModal(false)}>Cancelar</Button>
            <Button onClick={salvar}>Salvar pedido</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Campo label="Cliente">
            <Select value={form.clienteId} onChange={(e) => setForm({ ...form, clienteId: e.target.value })}>
              <option value="">Selecione...</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </Select>
          </Campo>
          <Campo label="Produto">
            <Input value={form.produto} onChange={(e) => setForm({ ...form, produto: e.target.value })} placeholder="Produto" />
          </Campo>
          <Campo label="Quantidade">
            <Input type="number" min="1" value={form.qtd} onChange={(e) => setForm({ ...form, qtd: e.target.value })} />
          </Campo>
          <Campo label="Valor (R$)">
            <Input type="number" step="0.01" value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })} />
          </Campo>
          <Campo label="Transportadora">
            <Input value={form.transportadora} onChange={(e) => setForm({ ...form, transportadora: e.target.value })} />
          </Campo>
          <Campo label="Código de rastreio">
            <Input value={form.rastreio} onChange={(e) => setForm({ ...form, rastreio: e.target.value })} />
          </Campo>
          <Campo label="Status">
            <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {etapasPedido.map((s) => (
                <option key={s} value={s}>{passoRotulo[s]}</option>
              ))}
              <option value="cancelado">Cancelado</option>
            </Select>
          </Campo>
          <Campo label="Pagamento">
            <Select value={form.pagamento} onChange={(e) => setForm({ ...form, pagamento: e.target.value })}>
              <option value="pendente">Pendente</option>
              <option value="pago">Pago</option>
              <option value="estornado">Estornado</option>
            </Select>
          </Campo>
          <Campo label="Entrega prevista">
            <Input type="date" value={form.entregaPrevista} onChange={(e) => setForm({ ...form, entregaPrevista: e.target.value })} />
          </Campo>
          <Campo label="Entrega realizada">
            <Input type="date" value={form.entregaRealizada} onChange={(e) => setForm({ ...form, entregaRealizada: e.target.value })} />
          </Campo>
        </div>
      </Modal>
    </div>
  );
}
