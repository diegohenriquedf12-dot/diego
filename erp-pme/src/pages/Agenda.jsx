import { useMemo, useState } from 'react';
import {
  CalendarDays, Plus, ChevronLeft, ChevronRight, ArrowLeft,
  Users2, CreditCard, AlertCircle, Gift, CalendarClock, Trash2,
} from 'lucide-react';
import { useERP } from '../context/ERPContext';
import { dataBR } from '../utils/format';
import { Card, PageHeader } from '../components/ui/Layout';
import { Campo, Input, Select } from '../components/ui/Field';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

const tipos = {
  reuniao: { rotulo: 'Reunião', icone: Users2, cls: 'bg-brand-500', chip: 'bg-brand-50 text-brand-700' },
  pagamento: { rotulo: 'Pagamento', icone: CreditCard, cls: 'bg-rose-500', chip: 'bg-rose-50 text-rose-700' },
  vencimento: { rotulo: 'Vencimento', icone: AlertCircle, cls: 'bg-amber-500', chip: 'bg-amber-50 text-amber-700' },
  aniversario: { rotulo: 'Aniversário', icone: Gift, cls: 'bg-violet-500', chip: 'bg-violet-50 text-violet-700' },
  evento: { rotulo: 'Evento', icone: CalendarClock, cls: 'bg-emerald-500', chip: 'bg-emerald-50 text-emerald-700' },
};

const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const iso = (a, m, d) => `${a}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
const hojeISO = new Date().toISOString().slice(0, 10);
const vazio = { data: hojeISO, hora: '', titulo: '', tipo: 'reuniao' };

export default function Agenda({ irPara }) {
  const { eventos, salvarEvento, removerEvento } = useERP();
  const [ref, setRef] = useState(() => { const d = new Date(); return { ano: d.getFullYear(), mes: d.getMonth() }; });
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(vazio);

  const porDia = useMemo(() => {
    const mapa = {};
    eventos.forEach((e) => { (mapa[e.data] = mapa[e.data] || []).push(e); });
    return mapa;
  }, [eventos]);

  // Monta a grade do mês (com células vazias antes do dia 1)
  const celulas = useMemo(() => {
    const primeiro = new Date(ref.ano, ref.mes, 1).getDay();
    const dias = new Date(ref.ano, ref.mes + 1, 0).getDate();
    const arr = Array.from({ length: primeiro }, () => null);
    for (let d = 1; d <= dias; d++) arr.push(d);
    return arr;
  }, [ref]);

  const mover = (delta) => setRef((r) => {
    const m = r.mes + delta;
    return { ano: r.ano + Math.floor(m / 12), mes: ((m % 12) + 12) % 12 };
  });

  const proximos = useMemo(
    () => [...eventos].filter((e) => e.data >= hojeISO).sort((a, b) => a.data.localeCompare(b.data)).slice(0, 6),
    [eventos]
  );

  const salvar = () => {
    if (!form.titulo) return;
    salvarEvento(form);
    setModal(false);
  };

  return (
    <div>
      <PageHeader
        titulo="Agenda"
        descricao="Compromissos, pagamentos, vencimentos e eventos."
        acao={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => irPara('dashboard')}><ArrowLeft size={16} /> Dashboard</Button>
            <Button onClick={() => { setForm(vazio); setModal(true); }}><Plus size={16} /> Novo evento</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900">{meses[ref.mes]} {ref.ano}</h3>
            <div className="flex gap-1">
              <button onClick={() => mover(-1)} className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100"><ChevronLeft size={18} /></button>
              <button onClick={() => mover(1)} className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100"><ChevronRight size={18} /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {diasSemana.map((d) => (
              <div key={d} className="pb-2 text-[11px] font-semibold uppercase text-slate-400">{d}</div>
            ))}
            {celulas.map((dia, i) => {
              if (dia === null) return <div key={`v${i}`} />;
              const data = iso(ref.ano, ref.mes, dia);
              const evs = porDia[data] || [];
              const ehHoje = data === hojeISO;
              return (
                <div
                  key={data}
                  className={`min-h-[68px] rounded-lg border p-1.5 text-left transition-colors animate-fade-in ${
                    ehHoje ? 'border-brand-500 bg-brand-50/60 ring-1 ring-brand-500/30' : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <span className={`text-xs font-semibold ${ehHoje ? 'text-brand-600' : 'text-slate-500'}`}>{dia}</span>
                  <div className="mt-1 space-y-0.5">
                    {evs.slice(0, 2).map((e) => (
                      <div key={e.id} className={`truncate rounded px-1 py-0.5 text-[9px] font-medium text-white ${tipos[e.tipo]?.cls || 'bg-slate-400'}`} title={e.titulo}>
                        {e.titulo}
                      </div>
                    ))}
                    {evs.length > 2 && <p className="text-[9px] text-slate-400">+{evs.length - 2}</p>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap gap-3 border-t border-slate-100 pt-3">
            {Object.entries(tipos).map(([k, t]) => (
              <span key={k} className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <span className={`h-2.5 w-2.5 rounded-full ${t.cls}`} /> {t.rotulo}
              </span>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 text-base font-semibold text-slate-900">Próximos compromissos</h3>
          <ul className="space-y-2 stagger">
            {proximos.map((e) => {
              const t = tipos[e.tipo] || tipos.evento;
              const Icone = t.icone;
              return (
                <li key={e.id} className="group flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-slate-50">
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${t.chip}`}><Icone size={16} /></span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">{e.titulo}</p>
                    <p className="text-xs text-slate-500">{dataBR(e.data)}{e.hora && ` · ${e.hora}`}</p>
                  </div>
                  <button onClick={() => removerEvento(e.id)} className="rounded-lg p-1.5 text-slate-300 opacity-0 transition-opacity hover:bg-rose-50 hover:text-rose-500 group-hover:opacity-100" aria-label="Excluir"><Trash2 size={14} /></button>
                </li>
              );
            })}
            {proximos.length === 0 && <p className="py-6 text-center text-sm text-slate-400">Nenhum compromisso futuro.</p>}
          </ul>
        </Card>
      </div>

      <Modal
        aberto={modal}
        titulo="Novo evento"
        onFechar={() => setModal(false)}
        rodape={
          <>
            <Button variant="ghost" onClick={() => setModal(false)}>Cancelar</Button>
            <Button onClick={salvar}>Salvar</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Campo label="Título"><Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} /></Campo>
          <Campo label="Tipo">
            <Select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
              {Object.entries(tipos).map(([k, t]) => <option key={k} value={k}>{t.rotulo}</option>)}
            </Select>
          </Campo>
          <Campo label="Data"><Input type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} /></Campo>
          <Campo label="Hora"><Input type="time" value={form.hora} onChange={(e) => setForm({ ...form, hora: e.target.value })} /></Campo>
        </div>
      </Modal>
    </div>
  );
}
