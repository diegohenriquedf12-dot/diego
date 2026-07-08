import { useState } from 'react';
import { Plus, Pencil, PencilLine, Trash2, ShoppingCart, Search, X } from 'lucide-react';
import { useERP } from '../context/ERPContext';
import { moeda, dataBR, totalVenda, hoje } from '../utils/format';
import { PageHeader, Card, EmptyState } from '../components/ui/Layout';
import DataTable from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Campo, Input, Select } from '../components/ui/Field';

const vendaVazia = () => ({ clienteId: '', data: hoje(), itens: [], status: 'pago', pagamento: 'PIX' });
const manualVazia = () => ({ clienteNome: '', valor: '', data: hoje(), status: 'pago', pagamento: 'PIX' });

export default function Vendas() {
  const { vendas, clientes, produtos, salvarVenda, removerVenda, somenteLeitura } = useERP();
  const [busca, setBusca] = useState('');
  const [clienteFiltro, setClienteFiltro] = useState('todos'); // 'todos' ou nome do cliente
  const [modal, setModal] = useState(null);
  const [modalManual, setModalManual] = useState(null);
  const [confirmar, setConfirmar] = useState(null);
  const [produtoSel, setProdutoSel] = useState('');

  const nomeCliente = (v) => clientes.find((c) => c.id === v.clienteId)?.nome || v.clienteNome || '—';

  // Clientes que já compraram (para o filtro), em ordem alfabética
  const clientesQueCompraram = [...new Set(vendas.map(nomeCliente).filter((n) => n !== '—'))]
    .sort((a, b) => a.localeCompare(b, 'pt-BR'));

  const filtradas = vendas.filter((v) => {
    const nome = nomeCliente(v);
    return (
      (clienteFiltro === 'todos' || nome === clienteFiltro) &&
      (nome.toLowerCase().includes(busca.toLowerCase()) || v.id.includes(busca))
    );
  });

  // Totais do filtro atual (ignora vendas canceladas)
  const validasFiltradas = filtradas.filter((v) => v.status !== 'cancelado');
  const totalFiltrado = validasFiltradas.reduce((s, v) => s + totalVenda(v), 0);

  const adicionarItem = () => {
    if (!produtoSel) return;
    const prod = produtos.find((p) => p.id === produtoSel);
    if (modal.itens.some((i) => i.produtoId === produtoSel)) return;
    setModal({ ...modal, itens: [...modal.itens, { produtoId: prod.id, qtd: 1, preco: prod.preco }] });
    setProdutoSel('');
  };

  const atualizarQtd = (id, qtd) =>
    setModal({ ...modal, itens: modal.itens.map((i) => (i.produtoId === id ? { ...i, qtd: Math.max(1, Number(qtd) || 1) } : i)) });

  const removerItem = (id) =>
    setModal({ ...modal, itens: modal.itens.filter((i) => i.produtoId !== id) });

  const salvar = () => {
    if (!modal.clienteId || modal.itens.length === 0) return;
    salvarVenda(modal);
    setModal(null);
  };

  const salvarManual = () => {
    if (!modalManual.clienteNome.trim() || !(Number(modalManual.valor) > 0)) return;
    salvarVenda({
      ...(modalManual.id ? { id: modalManual.id } : {}),
      clienteId: '',
      clienteNome: modalManual.clienteNome.trim(),
      data: modalManual.data,
      pagamento: modalManual.pagamento,
      status: modalManual.status,
      itens: [],
      total: Number(modalManual.valor) || 0,
    });
    setModalManual(null);
  };

  const colunas = [
    { chave: 'id', titulo: 'Pedido', render: (v) => <span className="font-mono text-xs font-medium text-ink">#{v.id.replace('v', '')}</span> },
    { chave: 'cliente', titulo: 'Cliente', render: (v) => clientes.find((c) => c.id === v.clienteId)?.nome || v.clienteNome || '—' },
    { chave: 'data', titulo: 'Data', render: (v) => dataBR(v.data) },
    { chave: 'itens', titulo: 'Itens', render: (v) => (v.itens.length ? `${v.itens.length} item(s)` : 'Manual') },
    { chave: 'pagamento', titulo: 'Pagamento', render: (v) => (
      <span className="rounded-md bg-card2 px-2 py-0.5 text-xs font-medium text-muted">{v.pagamento}</span>
    ) },
    { chave: 'total', titulo: 'Total', alinhar: 'right', render: (v) => <span className="font-semibold text-ink">{moeda(totalVenda(v))}</span> },
    { chave: 'status', titulo: 'Status', render: (v) => <Badge status={v.status} /> },
    { chave: 'acoes', titulo: '', alinhar: 'right', render: (v) =>
      somenteLeitura ? null : (
        <div className="flex justify-end gap-1">
          <button
            onClick={() =>
              v.itens.length
                ? setModal({ ...v })
                : setModalManual({ id: v.id, clienteNome: v.clienteNome || '', valor: v.total ?? totalVenda(v), data: v.data, pagamento: v.pagamento, status: v.status })
            }
            className="rounded-lg p-1.5 text-muted hover:bg-card2 hover:text-ink"
            aria-label="Editar venda"
          >
            <Pencil size={15} />
          </button>
          <button onClick={() => setConfirmar(v)} className="rounded-lg p-1.5 text-muted hover:bg-rose-50 hover:text-rose-600" aria-label="Excluir venda"><Trash2 size={15} /></button>
        </div>
      ) },
  ];

  const totalModal = modal ? modal.itens.reduce((s, i) => s + i.qtd * i.preco, 0) : 0;

  return (
    <div>
      <PageHeader
        titulo="Vendas"
        descricao={`${vendas.filter((v) => v.status !== 'cancelado').length} pedidos válidos`}
        acao={!somenteLeitura && (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setModalManual(manualVazia())}><PencilLine size={16} /> Lançar manual</Button>
            <Button onClick={() => setModal(vendaVazia())}><Plus size={16} /> Nova venda</Button>
          </div>
        )}
      />

      {/* Totais do filtro atual — atualizam conforme o cliente selecionado */}
      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs font-medium text-muted">Valor total{clienteFiltro !== 'todos' ? ` — ${clienteFiltro}` : ''}</p>
          <p className="mt-1 text-xl font-semibold text-emerald-600">{moeda(totalFiltrado)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted">Vendas</p>
          <p className="mt-1 text-xl font-semibold text-ink">{validasFiltradas.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted">Clientes que compraram</p>
          <p className="mt-1 text-xl font-semibold text-ink">{clientesQueCompraram.length}</p>
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-3 border-b border-line p-4">
          <div className="relative max-w-sm flex-1">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por cliente ou nº do pedido..." className="w-full rounded-lg border border-line bg-card2 py-2 pl-9 pr-3 text-sm focus:border-accent focus:bg-card focus:outline-none focus:ring-2 focus:ring-accent/25" />
          </div>
          <select
            value={clienteFiltro}
            onChange={(e) => setClienteFiltro(e.target.value)}
            className="shrink-0 rounded-lg border border-line bg-card2 px-3 py-2 text-sm font-medium text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
          >
            <option value="todos">Todos os clientes</option>
            {clientesQueCompraram.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <DataTable colunas={colunas} dados={filtradas} vazio={<EmptyState icone={ShoppingCart} titulo="Nenhuma venda registrada" descricao="Registre vendas para acompanhar faturamento e baixar o estoque automaticamente." />} />
      </Card>

      <Modal
        aberto={!!modal}
        titulo={modal?.id ? `Editar venda #${String(modal.id).replace('v', '')}` : 'Nova venda'}
        onFechar={() => setModal(null)}
        rodape={
          <>
            <div className="mr-auto text-sm">
              <span className="text-muted">Total: </span>
              <span className="text-base font-semibold text-ink">{moeda(totalModal)}</span>
            </div>
            <Button variant="secondary" onClick={() => setModal(null)}>Cancelar</Button>
            <Button onClick={salvar} disabled={!modal?.clienteId || !modal?.itens.length}>Registrar venda</Button>
          </>
        }
      >
        {modal && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Campo label="Cliente">
                <Select value={modal.clienteId} onChange={(e) => setModal({ ...modal, clienteId: e.target.value })}>
                  <option value="">Selecione...</option>
                  {clientes.filter((c) => c.status === 'ativo').map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </Select>
              </Campo>
              <Campo label="Forma de pagamento">
                <Select value={modal.pagamento} onChange={(e) => setModal({ ...modal, pagamento: e.target.value })}>
                  {['PIX', 'Cartão', 'Boleto', 'Dinheiro'].map((p) => <option key={p}>{p}</option>)}
                </Select>
              </Campo>
            </div>

            <div>
              <span className="mb-1 block text-sm font-medium text-ink">Itens do pedido</span>
              <div className="flex gap-2">
                <Select value={produtoSel} onChange={(e) => setProdutoSel(e.target.value)}>
                  <option value="">Adicionar produto...</option>
                  {produtos.map((p) => <option key={p.id} value={p.id}>{p.nome} — {moeda(p.preco)}</option>)}
                </Select>
                <Button variant="secondary" onClick={adicionarItem} className="shrink-0"><Plus size={16} /></Button>
              </div>

              <div className="mt-3 space-y-2">
                {modal.itens.length === 0 && <p className="rounded-lg border border-dashed border-line py-6 text-center text-sm text-muted">Nenhum item adicionado.</p>}
                {modal.itens.map((i) => {
                  const prod = produtos.find((p) => p.id === i.produtoId);
                  return (
                    <div key={i.produtoId} className="flex items-center gap-2 rounded-lg border border-line bg-card2 px-3 py-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">{prod?.nome}</p>
                        <p className="text-xs text-muted">{moeda(i.preco)} · disp. {prod?.quantidade}</p>
                      </div>
                      <input type="number" min="1" value={i.qtd} onChange={(e) => atualizarQtd(i.produtoId, e.target.value)} className="w-16 rounded-md border border-line px-2 py-1 text-center text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25" />
                      <span className="w-24 text-right text-sm font-semibold text-ink">{moeda(i.qtd * i.preco)}</span>
                      <button onClick={() => removerItem(i.produtoId)} className="rounded-md p-1 text-muted hover:bg-rose-50 hover:text-rose-600"><X size={15} /></button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Campo label="Data">
                <input type="date" value={modal.data} onChange={(e) => setModal({ ...modal, data: e.target.value })} className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25" />
              </Campo>
              <Campo label="Situação">
                <Select value={modal.status} onChange={(e) => setModal({ ...modal, status: e.target.value })}>
                  <option value="pago">Pago</option>
                  <option value="pendente">Pendente</option>
                </Select>
              </Campo>
            </div>
          </div>
        )}
      </Modal>

      {/* Lançamento manual: registra uma venda só com nome do cliente e valor,
          sem precisar de produtos cadastrados (não baixa estoque). */}
      <Modal
        aberto={!!modalManual}
        titulo={modalManual?.id ? `Editar venda #${String(modalManual.id).replace('v', '')}` : 'Lançar venda manual'}
        onFechar={() => setModalManual(null)}
        rodape={
          <>
            <Button variant="secondary" onClick={() => setModalManual(null)}>Cancelar</Button>
            <Button onClick={salvarManual} disabled={!modalManual?.clienteNome?.trim() || !(Number(modalManual?.valor) > 0)}>Registrar</Button>
          </>
        }
      >
        {modalManual && (
          <div className="space-y-4">
            <Campo label="Cliente">
              <Input value={modalManual.clienteNome} onChange={(e) => setModalManual({ ...modalManual, clienteNome: e.target.value })} placeholder="Nome do cliente" />
            </Campo>
            <div className="grid grid-cols-2 gap-4">
              <Campo label="Valor (R$)">
                <Input type="number" step="0.01" min="0" value={modalManual.valor} onChange={(e) => setModalManual({ ...modalManual, valor: e.target.value })} placeholder="0,00" />
              </Campo>
              <Campo label="Data">
                <input type="date" value={modalManual.data} onChange={(e) => setModalManual({ ...modalManual, data: e.target.value })} className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25" />
              </Campo>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Campo label="Forma de pagamento">
                <Select value={modalManual.pagamento} onChange={(e) => setModalManual({ ...modalManual, pagamento: e.target.value })}>
                  {['PIX', 'Cartão', 'Boleto', 'Dinheiro'].map((p) => <option key={p}>{p}</option>)}
                </Select>
              </Campo>
              <Campo label="Situação">
                <Select value={modalManual.status} onChange={(e) => setModalManual({ ...modalManual, status: e.target.value })}>
                  <option value="pago">Pago</option>
                  <option value="pendente">Pendente</option>
                </Select>
              </Campo>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirmação antes de excluir uma venda */}
      <Modal
        aberto={!!confirmar}
        titulo="Excluir venda"
        onFechar={() => setConfirmar(null)}
        rodape={
          <>
            <Button variant="secondary" onClick={() => setConfirmar(null)}>Cancelar</Button>
            <Button onClick={() => { removerVenda(confirmar.id); setConfirmar(null); }}>Excluir</Button>
          </>
        }
      >
        {confirmar && (
          <p className="text-sm text-muted">
            Tem certeza que deseja excluir a venda{' '}
            <span className="font-semibold text-ink">#{String(confirmar.id).replace('v', '')}</span>
            {' '}({moeda(totalVenda(confirmar))})? Essa ação também remove a conta a receber gerada por ela e não pode ser desfeita.
          </p>
        )}
      </Modal>
    </div>
  );
}
