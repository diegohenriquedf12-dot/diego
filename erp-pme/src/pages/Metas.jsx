import { useMemo, useState } from 'react';
import { Target, Plus, Trophy, ArrowLeft, Trash2, CheckCircle2 } from 'lucide-react';
import { useERP } from '../context/ERPContext';
import { moeda } from '../utils/format';
import { Card, PageHeader } from '../components/ui/Layout';
import { Campo, Input, Select } from '../components/ui/Field';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { ProgressBar, ProgressRing, corPorMeta } from '../components/ui/Progress';
import AnimatedNumber from '../components/ui/AnimatedNumber';

const fmt = (m) => (m.tipo === 'moeda' ? (n) => moeda(n) : (n) => Math.round(n).toLocaleString('pt-BR'));

const vazio = { titulo: '', tipo: 'numero', atual: '', alvo: '', tom: 'blue' };

export default function Metas({ irPara }) {
  const { metas, salvarMeta, removerMeta } = useERP();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(vazio);

  const comPct = useMemo(
    () => metas.map((m) => ({ ...m, pct: m.alvo > 0 ? (m.atual / m.alvo) * 100 : 0 })),
    [metas]
  );
  const atingidas = comPct.filter((m) => m.pct >= 100).length;
  const mediaGeral = comPct.length
    ? Math.round(comPct.reduce((s, m) => s + Math.min(100, m.pct), 0) / comPct.length)
    : 0;

  const salvar = () => {
    if (!form.titulo) return;
    salvarMeta({ ...form, atual: Number(form.atual) || 0, alvo: Number(form.alvo) || 0 });
    setModal(false);
  };

  return (
    <div>
      <PageHeader
        titulo="Metas"
        descricao="Objetivos do mês com acompanhamento em tempo real."
        acao={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => irPara('dashboard')}><ArrowLeft size={16} /> Dashboard</Button>
            <Button onClick={() => { setForm(vazio); setModal(true); }}><Plus size={16} /> Nova meta</Button>
          </div>
        }
      />

      {/* Resumo geral com indicador circular */}
      <Card className="mb-4 flex flex-col items-center gap-6 p-6 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-5">
          <ProgressRing valor={mediaGeral} tom={corPorMeta(mediaGeral)} tamanho={104} espessura={10}>
            <div className="text-center">
              <p className="text-2xl font-bold text-ink tabular-nums">
                <AnimatedNumber valor={mediaGeral} formato={(n) => `${Math.round(n)}%`} />
              </p>
              <p className="text-[10px] text-muted">média</p>
            </div>
          </ProgressRing>
          <div>
            <h3 className="text-base font-semibold text-ink">Desempenho geral</h3>
            <p className="text-sm text-muted">Progresso médio de todas as metas ativas.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-5 py-4 text-emerald-700">
          <Trophy size={28} />
          <div>
            <p className="text-2xl font-bold tabular-nums">{atingidas}/{comPct.length}</p>
            <p className="text-xs font-medium">metas atingidas</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 stagger md:grid-cols-2 xl:grid-cols-3">
        {comPct.map((m) => {
          const tom = corPorMeta(m.pct);
          const concluida = m.pct >= 100;
          const formato = fmt(m);
          return (
            <Card
              key={m.id}
              className={`card-lift relative overflow-hidden p-5 ${concluida ? 'ring-2 ring-emerald-400' : ''}`}
            >
              {concluida && (
                <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 animate-glow-pulse">
                  <CheckCircle2 size={12} /> Concluída
                </span>
              )}
              <div className="flex items-center gap-2 text-muted">
                <Target size={15} />
                <h3 className="text-sm font-semibold text-ink">{m.titulo}</h3>
              </div>

              <p className="mt-3 text-2xl font-bold tracking-tight text-ink tabular-nums">
                <AnimatedNumber valor={m.atual} formato={formato} />
              </p>
              <p className="text-xs text-muted">de {formato(m.alvo)}</p>

              <div className="mt-4">
                <div className="mb-1 flex items-center justify-between text-xs font-medium">
                  <span className="text-muted">Progresso</span>
                  <span className={concluida ? 'text-emerald-600' : 'text-ink'}>
                    {Math.round(m.pct)}%
                  </span>
                </div>
                <ProgressBar valor={m.pct} tom={tom} altura="h-2.5" />
              </div>

              <div className="mt-4 flex justify-end">
                <button onClick={() => { setForm(m); setModal(true); }} className="rounded-lg px-2 py-1 text-xs font-medium text-accent hover:bg-accent/10">Editar</button>
                <button onClick={() => removerMeta(m.id)} className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50" aria-label="Excluir"><Trash2 size={15} /></button>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal
        aberto={modal}
        titulo={form.id ? 'Editar meta' : 'Nova meta'}
        onFechar={() => setModal(false)}
        rodape={
          <>
            <Button variant="ghost" onClick={() => setModal(false)}>Cancelar</Button>
            <Button onClick={salvar}>Salvar</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Campo label="Título">
            <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} className="sm:col-span-2" />
          </Campo>
          <Campo label="Tipo">
            <Select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
              <option value="numero">Número</option>
              <option value="moeda">Valor (R$)</option>
            </Select>
          </Campo>
          <Campo label="Atual"><Input type="number" step="0.01" value={form.atual} onChange={(e) => setForm({ ...form, atual: e.target.value })} /></Campo>
          <Campo label="Alvo"><Input type="number" step="0.01" value={form.alvo} onChange={(e) => setForm({ ...form, alvo: e.target.value })} /></Campo>
        </div>
      </Modal>
    </div>
  );
}
