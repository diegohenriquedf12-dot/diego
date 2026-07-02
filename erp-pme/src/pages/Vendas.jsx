import { useState } from 'react';
import { Plus, PencilLine, Trash2, ShoppingCart, Search, X } from 'lucide-react';
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
  const [modal, setModal] = useState(null);
  const [modalManual, setModalManual] = useState(null);
  const [produtoSel, setProdutoSel] = useState('');

  const filtradas = vendas.filter((v) => {
    const cliente = clientes.find((c) => c.id === v.clienteId);
    return (cliente?.nome || '').toLowerCase().includes(busca.toLowerCase()) || v.id.includes(busca);
  });

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
        <div className="flex justify-end">
          <button onClick={() => removerVenda(v.id)} className="rounded-lg p-1.5 text-muted hover:bg-rose-50 hover:text-rose-600" aria-label="Excluir venda"><Trash2 size={15} /></button>
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

      <Card>
        <div className="border-b border-line p-4">
          <div className="relative max-w-sm">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por cliente ou nº do pedido..." className="w-full rounded-lg border border-line bg-card2 py-2 pl-9 pr-3 text-sm focus:border-accent focus:bg-card focus:outline-none focus:ring-2 focus:ring-accent/25" />
          </div>
        </div>
        <DataTable colunas={colunas} dados={filtradas} vazio={<EmptyState icone={ShoppingCart} titulo="Nenhuma venda registrada" descricao="Registre vendas para acompanhar faturamento e baixar o estoque automaticamente." />} />
      </Card>

      <Modal
        aberto={!!modal}
        titulo="Nova venda"
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
        titulo="Lançar venda manual"
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
    </div>
  );
}
