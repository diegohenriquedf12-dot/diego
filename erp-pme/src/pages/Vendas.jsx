import { useState } from 'react';
import { Plus, Trash2, ShoppingCart, Search, X } from 'lucide-react';
import { useERP } from '../context/ERPContext';
import { moeda, dataBR, totalVenda, hoje } from '../utils/format';
import { PageHeader, Card, EmptyState } from '../components/ui/Layout';
import DataTable from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Campo, Select } from '../components/ui/Field';

const vendaVazia = () => ({ clienteId: '', data: hoje(), itens: [], status: 'pago', pagamento: 'PIX' });

export default function Vendas() {
  const { vendas, clientes, produtos, salvarVenda } = useERP();
  const [busca, setBusca] = useState('');
  const [modal, setModal] = useState(null);
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

  const colunas = [
    { chave: 'id', titulo: 'Pedido', render: (v) => <span className="font-mono text-xs font-medium text-slate-700">#{v.id.replace('v', '')}</span> },
    { chave: 'cliente', titulo: 'Cliente', render: (v) => clientes.find((c) => c.id === v.clienteId)?.nome || '—' },
    { chave: 'data', titulo: 'Data', render: (v) => dataBR(v.data) },
    { chave: 'itens', titulo: 'Itens', render: (v) => `${v.itens.length} item(s)` },
    { chave: 'pagamento', titulo: 'Pagamento', render: (v) => (
      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{v.pagamento}</span>
    ) },
    { chave: 'total', titulo: 'Total', alinhar: 'right', render: (v) => <span className="font-semibold text-slate-900">{moeda(totalVenda(v))}</span> },
    { chave: 'status', titulo: 'Status', render: (v) => <Badge status={v.status} /> },
  ];

  const totalModal = modal ? modal.itens.reduce((s, i) => s + i.qtd * i.preco, 0) : 0;

  return (
    <div>
      <PageHeader
        titulo="Vendas"
        descricao={`${vendas.filter((v) => v.status !== 'cancelado').length} pedidos válidos`}
        acao={<Button onClick={() => setModal(vendaVazia())}><Plus size={16} /> Nova venda</Button>}
      />

      <Card>
        <div className="border-b border-slate-100 p-4">
          <div className="relative max-w-sm">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por cliente ou nº do pedido..." className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
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
              <span className="text-slate-500">Total: </span>
              <span className="text-base font-semibold text-slate-900">{moeda(totalModal)}</span>
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
              <span className="mb-1 block text-sm font-medium text-slate-700">Itens do pedido</span>
              <div className="flex gap-2">
                <Select value={produtoSel} onChange={(e) => setProdutoSel(e.target.value)}>
                  <option value="">Adicionar produto...</option>
                  {produtos.map((p) => <option key={p.id} value={p.id}>{p.nome} — {moeda(p.preco)}</option>)}
                </Select>
                <Button variant="secondary" onClick={adicionarItem} className="shrink-0"><Plus size={16} /></Button>
              </div>

              <div className="mt-3 space-y-2">
                {modal.itens.length === 0 && <p className="rounded-lg border border-dashed border-slate-200 py-6 text-center text-sm text-slate-400">Nenhum item adicionado.</p>}
                {modal.itens.map((i) => {
                  const prod = produtos.find((p) => p.id === i.produtoId);
                  return (
                    <div key={i.produtoId} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-800">{prod?.nome}</p>
                        <p className="text-xs text-slate-500">{moeda(i.preco)} · disp. {prod?.quantidade}</p>
                      </div>
                      <input type="number" min="1" value={i.qtd} onChange={(e) => atualizarQtd(i.produtoId, e.target.value)} className="w-16 rounded-md border border-slate-300 px-2 py-1 text-center text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                      <span className="w-24 text-right text-sm font-semibold text-slate-900">{moeda(i.qtd * i.preco)}</span>
                      <button onClick={() => removerItem(i.produtoId)} className="rounded-md p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><X size={15} /></button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Campo label="Data">
                <input type="date" value={modal.data} onChange={(e) => setModal({ ...modal, data: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
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
    </div>
  );
}
