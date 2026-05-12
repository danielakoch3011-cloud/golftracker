import React, { useState } from "react";
import {
  Area,
  AreaChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { courses, financeSettings, modules } from "./data";

const STORAGE_KEY = "golftrack_unicorn_rounds_v2";
const TRAINING_KEY = "golftrack_unicorn_trainings_v1";

const demoRounds = [
  ["2026-04-06", "maxx", 66, [8,7,7,8,6,9,7,8,6], 30, 18, 3.4, "Erste dokumentierte Runde", [29,8,12,0,0], [4,5,7,3,4], [7,6,7,7,true]],
  ["2026-04-11", "maxx", 56, [6,5,6,7,5,8,6,7,6], 55, 28, 3.0, "Beste frühe Runde", [29,6,10,0,0], [7,7,3,6,7], [7,7,7,8,true]],
  ["2026-04-12", "maxx", 67, [8,7,8,8,7,9,6,8,6], 35, 20, 3.6, "Putting schwach", [29,10,8,0,6], [3,5,8,3,3], [6,5,7,6,true]],
  ["2026-04-17", "maxx", 58, [6,6,6,7,6,8,6,7,6], 50, 31, 3.1, "Ruhiger gespielt", [29,7,12,0,0], [6,6,4,5,6], [7,7,7,7,true]],
  ["2026-04-18", "maxx", 61, [7,6,7,7,6,9,6,7,6], 46, 24, 3.3, "Loch 6 teuer", [29,8,9,0,4], [5,5,7,4,4], [6,6,7,6,true]],
  ["2026-04-25", "maxx", 54, [6,5,6,6,5,8,6,6,6], 62, 35, 2.9, "Kontrollierter", [29,8,11,0,0], [7,7,3,6,7], [8,7,8,8,true]],
  ["2026-04-26", "maxx", 52, [5,5,6,6,5,8,5,6,6], 64, 38, 2.8, "Stabiler Abschlag", [29,5,13,0,0], [8,8,2,7,8], [8,8,8,8,true]],
  ["2026-05-01", "doerfl", 49, [5,4,6,6,4,6,6,5,7], 67, 42, 2.7, "Guter Fokus", [45,8,14,0,0], [8,8,2,8,8], [9,8,8,9,true]],
  ["2026-05-03", "doerfl", 51, [6,4,6,6,5,6,6,5,7], 59, 40, 2.9, "Kurzspiel besser", [45,10,16,0,0], [7,7,3,7,7], [8,8,7,8,true]],
  ["2026-05-04", "doerfl", 47, [5,4,5,5,4,6,5,5,8], 72, 48, 2.6, "Bestwert", [45,8,18,0,0], [9,8,1,9,9], [9,9,8,9,true]],
].map(([date, courseKey, total, holes, fir, gir, putts, note, c, m, cr], i) => ({
  id: `r${i + 1}`,
  date,
  courseKey,
  total,
  holes,
  fir,
  gir,
  putts,
  note,
  costs: { greenfee: c[0], range: c[1], food: c[2], tournament: c[3], other: c[4] },
  mental: { focus: m[0], energy: m[1], frustration: m[2], confidence: m[3], management: m[4] },
  courseRating: { overall: cr[0], greens: cr[1], fairways: cr[2], atmosphere: cr[3], playAgain: cr[4] },
}));

const cn = (...x) => x.filter(Boolean).join(" ");
const avg = (v) => {
  const n = v.map(Number).filter(Number.isFinite);
  return n.length ? n.reduce((a, b) => a + b, 0) / n.length : 0;
};
const sortRounds = (r) => [...r].sort((a, b) => new Date(b.date) - new Date(a.date));
const uid = () => `r-${Date.now()}-${Math.random().toString(16).slice(2)}`;
const eur = (v) => `${Math.round(Number(v) || 0)}€`;

function loadRounds() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(saved) || saved.length === 0) return demoRounds;

    const clean = saved
      .filter((r) => r && courses[r.courseKey] && Array.isArray(r.holes) && r.holes.length === 9)
      .map((r) => ({
        ...r,
        id: r.id || uid(),
        date: r.date || new Date().toISOString().slice(0, 10),
        total: Number(r.total) || r.holes.reduce((s, v) => s + (Number(v) || 0), 0),
        fir: Number(r.fir) || 0,
        gir: Number(r.gir) || 0,
        putts: Number(r.putts) || 0,
        costs: { greenfee: 0, range: 0, food: 0, tournament: 0, other: 0, ...(r.costs || {}) },
        mental: { focus: 5, energy: 5, frustration: 5, confidence: 5, management: 5, ...(r.mental || {}) },
        courseRating: { overall: 5, greens: 5, fairways: 5, atmosphere: 5, playAgain: true, ...(r.courseRating || {}) },
      }));

    return clean.length ? clean : demoRounds;
  } catch {
    return demoRounds;
  }
}
function persist(rounds) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rounds));
}
function loadTrainings() {
  try {
    return JSON.parse(localStorage.getItem(TRAINING_KEY)) || [
      { id: "t1", date: "2026-05-02", type: "Range", note: "Driver 80%, Tempo", buckets: 2, trainerHours: 0 },
      { id: "t2", date: "2026-05-06", type: "Trainer", note: "Setup, Alignment, kurze Eisen", buckets: 1, trainerHours: 1 },
    ];
  } catch {
    return [];
  }
}
function persistTrainings(trainings) {
  localStorage.setItem(TRAINING_KEY, JSON.stringify(trainings));
}
function trainingCost(t) {
  return (Number(t.buckets) || 0) * financeSettings.rangeBucketPrice + (Number(t.trainerHours) || 0) * financeSettings.trainerHour;
}

function metrics(rounds) {
  const totals = rounds.map((r) => r.total);
  return {
    rounds: rounds.length,
    avg: Math.round(avg(totals)),
    best: Math.min(...totals),
    fir: `${Math.round(avg(rounds.map((r) => r.fir)))}%`,
    gir: `${Math.round(avg(rounds.map((r) => r.gir)))}%`,
    putts: avg(rounds.map((r) => r.putts)).toFixed(1),
  };
}

function roundCost(r) {
  const c = r.costs || {};
  return ["greenfee", "range", "food", "tournament", "other"].reduce((s, k) => s + (Number(c[k]) || 0), 0);
}
function financeMetrics(rounds) {
  const byCategory = ["greenfee", "range", "food", "tournament", "other"].reduce((o, k) => {
    o[k] = rounds.reduce((s, r) => s + (Number(r.costs?.[k]) || 0), 0);
    return o;
  }, {});
  const variableTotal = rounds.reduce((s, r) => s + roundCost(r), 0);
  const estimatedTraining = rounds.length * financeSettings.trainerHour * 0.15;
  return {
    variableTotal,
    fixedMonthly: financeSettings.membershipMonthly,
    estimatedTraining,
    total: variableTotal + financeSettings.membershipMonthly + estimatedTraining,
    avgCost: rounds.length ? variableTotal / rounds.length : 0,
    byCategory,
    mostExpensive: sortRounds(rounds).sort((a, b) => roundCost(b) - roundCost(a))[0],
  };
}
function mentalScore(r) {
  const m = r.mental || {};
  return avg([m.focus, m.energy, m.confidence, m.management, 10 - (Number(m.frustration) || 0)]);
}
function mentalMetrics(rounds) {
  return {
    score: avg(rounds.map(mentalScore)),
    focus: avg(rounds.map((r) => r.mental?.focus)),
    frustration: avg(rounds.map((r) => r.mental?.frustration)),
    course: avg(rounds.map((r) => r.courseRating?.overall)),
    playAgain: Math.round((rounds.filter((r) => r.courseRating?.playAgain).length / Math.max(1, rounds.length)) * 100),
  };
}
function analysis(rounds) {
  const sorted = sortRounds(rounds);
  const holes = Object.keys(courses).flatMap((courseKey) => {
    const rs = sorted.filter((r) => r.courseKey === courseKey);
    return courses[courseKey].holes.map((h, i) => {
      const a = avg(rs.map((r) => r.holes?.[i]));
      return { ...h, courseKey, avg: a, overPar: a - h.par, rounds: rs.length };
    });
  }).filter((h) => h.rounds);
  return {
    sorted,
    latest: sorted[0],
    weakness: [...holes].sort((a, b) => b.overPar - a.overPar)[0],
    trend: sorted.length > 3 ? avg(sorted.slice(3, 6).map((r) => r.total)) - avg(sorted.slice(0, 3).map((r) => r.total)) : 0,
  };
}

function Card({ children, className = "" }) {
  return <section className={cn("rounded-[1.35rem] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.04)]", className)}>{children}</section>;
}
function Trend({ data, area = false, domain }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      {area ? (
        <AreaChart data={data} margin={{ left: 4, right: 16, top: 8, bottom: 4 }}>
          <defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#166534" stopOpacity={0.18} /><stop offset="100%" stopColor="#166534" stopOpacity={0.02} /></linearGradient></defs>
          <XAxis dataKey="round" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
          <YAxis domain={domain} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
          <Tooltip contentStyle={{ borderRadius: 14, border: "1px solid #e2e8f0", fontSize: 12 }} />
          <Area type="monotone" dataKey="score" stroke="#166534" strokeWidth={2.5} fill="url(#fill)" />
        </AreaChart>
      ) : (
        <LineChart data={data}><Line type="monotone" dataKey="score" stroke="#166534" strokeWidth={2} dot={false} /></LineChart>
      )}
    </ResponsiveContainer>
  );
}
function Kpi({ icon, label, value, sub, trend }) {
  return (
    <Card className="min-h-[170px]">
      <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-800">{icon}</div><div className="text-sm font-bold text-slate-700">{label}</div></div>
      <div className="mt-5 text-4xl font-bold">{value}</div>
      {trend && <div className="mt-4 h-10"><Trend data={trend} /></div>}
      {sub && <div className="mt-3 text-sm font-medium text-slate-500">{sub}</div>}
    </Card>
  );
}
function MiniInput({ label, value, onChange, type = "text" }) {
  return (
    <label className="rounded-[1.2rem] bg-white p-4 ring-1 ring-slate-200">
      <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-600">{label}</div>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-2xl font-bold outline-none transition focus:border-emerald-500 focus:bg-white"
      />
    </label>
  );
}
function BarRow({ label, value }) {
  const safeValue = Math.max(6, Math.min(100, Number(value) || 0));
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm font-semibold text-slate-600">
        <span>{label}</span>
        <span>{Math.round(Number(value) || 0)}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100">
        <div className="h-2 rounded-full bg-emerald-800" style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}

function Shell({ tab, setTab, children }) {
  const active = modules.find(([id]) => id === tab)?.[1] || "Übersicht";
  return (
    <div className="min-h-screen bg-[#f7f8f5] text-[#101418] antialiased">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[268px] border-r border-slate-200 bg-white px-5 py-7 lg:flex lg:flex-col">
        <div className="flex items-center gap-3 px-2"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-2xl text-emerald-800">⚑</div><div className="text-2xl font-bold">GolfTrack</div></div>
        <nav className="mt-10 space-y-2">{modules.map(([id, label, icon]) => <button key={id} onClick={() => setTab(id)} className={cn("flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left text-[15px] font-semibold transition", tab === id ? "bg-emerald-50 text-emerald-900 ring-1 ring-emerald-100" : "text-slate-600 hover:bg-slate-50")}><span className="w-5 text-xl">{icon}</span>{label}</button>)}</nav>
        <div className="mt-auto rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">System Status</div><div className="mt-2 flex items-center gap-2"><div className="h-2.5 w-2.5 rounded-full bg-emerald-500" /><div className="text-sm font-bold">UNICORN AI ONLINE</div></div></div>
      </aside>
      <main className="pb-24 lg:ml-[268px] lg:pb-0">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-2xl"><div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 md:px-8"><div><h1 className="text-2xl font-bold">Hallo Dani! 👋</h1><p className="mt-1 text-sm font-medium text-slate-500">Hier ist deine {active} Performance Übersicht.</p></div><button onClick={() => setTab("round")} className="hidden rounded-xl bg-emerald-800 px-6 py-3 text-sm font-bold text-white md:block">+ Runde hinzufügen</button></div></header>
        <div className="mx-auto max-w-[1440px] px-5 py-6 md:px-8 md:py-8">{children}</div>
      </main>
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white p-2 lg:hidden"><div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${modules.length},1fr)` }}>{modules.map(([id, label]) => <button key={id} onClick={() => setTab(id)} className={cn("rounded-xl px-1 py-3 text-[10px] font-bold", tab === id ? "bg-emerald-800 text-white" : "text-slate-500")}>{label.split(" ")[0]}</button>)}</div></div>
    </div>
  );
}

function Home({ rounds }) {
  const m = metrics(rounds), a = analysis(rounds), f = financeMetrics(rounds), mt = mentalMetrics(rounds);
  const trend = a.sorted.slice().reverse().map((r, i) => ({ round: i + 1, score: r.total }));
  const latest = a.latest;
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><Kpi icon="⚑" label="Runden" value={m.rounds} sub="gespeichert" trend={trend} /><Kpi icon="●" label="Ø Score" value={m.avg} sub="9 Loch" trend={trend} /><Kpi icon="€" label="Golf Kosten" value={eur(f.total)} sub={`Ø ${eur(f.avgCost)} / Runde`} trend={a.sorted.slice().reverse().map((r,i)=>({round:i+1,score:roundCost(r)}))} /><Kpi icon="◌" label="Mental" value={mt.score.toFixed(1)} sub="Score / 10" trend={a.sorted.slice().reverse().map((r,i)=>({round:i+1,score:mentalScore(r)}))} /></div>
        <Card><div className="mb-5 text-lg font-bold">Score Verlauf</div><div className="h-[330px]"><Trend data={trend} area domain={[36, 72]} /></div></Card>
        <div className="grid gap-6 xl:grid-cols-2"><Card><div className="text-lg font-bold">Stärken & Schwächen</div><div className="mt-5 grid gap-4 md:grid-cols-2"><div><div className="mb-3 text-sm font-bold text-emerald-700">Stärken</div><BarRow label="Putten" value={Math.max(35, 100 - Number(m.putts) * 16)} /><BarRow label="Fokus" value={mt.focus * 10} /></div><div><div className="mb-3 text-sm font-bold text-rose-600">Hebel</div><BarRow label={`Loch ${a.weakness?.n || 6}`} value={70} /><BarRow label="Frust senken" value={Math.max(10, 100 - mt.frustration * 10)} /></div></div></Card><Card><div className="text-lg font-bold">AI Kurzbriefing</div><p className="mt-4 text-sm font-semibold leading-7 text-slate-600">Dein größter Hebel ist Loch {a.weakness?.n || 6}. Stabilisiere dort das Risiko und halte den Mental Score über 7.</p></Card></div>
      </div>
      <div className="space-y-6"><Card><div className="text-lg font-bold">Letzte Runde</div><div className="mt-4 text-sm font-semibold text-slate-700">{latest ? courses[latest.courseKey].name : "—"}</div><div className="mt-1 text-sm text-slate-500">{latest?.date}</div><div className="mt-6 text-5xl font-bold">{latest?.total || "—"}</div></Card><Card><div className="mb-4 text-lg font-bold">Letzte Runden</div>{a.sorted.slice(0, 5).map((r) => <div key={r.id} className="flex justify-between border-t border-slate-100 py-3"><span className="text-sm font-semibold">{r.date}</span><b>{r.total}</b></div>)}</Card></div>
    </div>
  );
}

const blankForm = (courseKey = "maxx") => ({ id: null, date: new Date().toISOString().slice(0, 10), courseKey, holes: Array(9).fill(""), fir: "", gir: "", putts: "", note: "", costs: { greenfee: "", range: "", food: "", tournament: "", other: "" }, mental: { focus: 5, energy: 5, frustration: 5, confidence: 5, management: 5 }, courseRating: { overall: 5, greens: 5, fairways: 5, atmosphere: 5, playAgain: true } });

function RoundEntry({ rounds, setRounds }) {
  const [form, setForm] = useState(blankForm());
  const course = courses[form.courseKey];
  const total = form.holes.reduce((s, v) => s + (Number(v) || 0), 0);
  const complete = form.holes.every((v) => Number(v) > 0);
  const updateHole = (i, v) => { const h = [...form.holes]; h[i] = v === "" ? "" : Math.max(1, Math.min(20, Number(v))); setForm({ ...form, holes: h }); };
  const save = () => {
    if (!complete) return;
    const numObj = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, k === "playAgain" ? Boolean(v) : Number(v) || 0]));
    const payload = { ...form, id: form.id || uid(), total, holes: form.holes.map(Number), fir: Number(form.fir) || 0, gir: Number(form.gir) || 0, putts: Number(form.putts) || 0, costs: numObj(form.costs), mental: numObj(form.mental), courseRating: numObj(form.courseRating) };
    const updated = form.id ? rounds.map((r) => r.id === form.id ? payload : r) : [payload, ...rounds];
    setRounds(sortRounds(updated)); persist(sortRounds(updated)); setForm(blankForm(form.courseKey));
  };
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <Card className="p-8">
        <div className="mb-6 flex flex-wrap gap-3"><input type="date" value={form.date} onChange={(e)=>setForm({...form,date:e.target.value})} className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold outline-none" /><select value={form.courseKey} onChange={(e)=>setForm(blankForm(e.target.value))} className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold outline-none"><option value="maxx">GolfMaxX Tuttenhof</option><option value="doerfl">GC Tuttendörfl</option></select></div>
        <div className="text-sm font-semibold text-slate-600">Scorecard</div><div className="mt-2 text-6xl font-bold">{complete ? total : "—"}</div>
        <div className="mt-8 grid grid-cols-3 gap-3 md:grid-cols-9">{course.holes.map((h,i)=><div key={h.n} className="rounded-[1.2rem] bg-white p-3 text-center ring-1 ring-slate-200"><div className="text-xs font-bold">L{h.n}</div><div className="text-sm text-slate-500">P{h.par}</div><input value={form.holes[i]} onChange={(e)=>updateHole(i,e.target.value)} type="number" className="mt-3 w-full rounded-xl bg-slate-50 px-2 py-3 text-center text-xl font-bold outline-none" /></div>)}</div>
        <div className="mt-6 grid gap-3 md:grid-cols-3"><MiniInput label="FIR %" value={form.fir} onChange={(v)=>setForm({...form,fir:v})}/><MiniInput label="GIR %" value={form.gir} onChange={(v)=>setForm({...form,gir:v})}/><MiniInput label="Ø Putts" value={form.putts} onChange={(v)=>setForm({...form,putts:v})}/></div>
        <FinanceInputs form={form} setForm={setForm} />
        <RatingInputs form={form} setForm={setForm} />
        <textarea value={form.note} onChange={(e)=>setForm({...form,note:e.target.value})} placeholder="Notiz zur Runde" className="mt-6 min-h-24 w-full rounded-[1.5rem] bg-slate-100 p-4 text-sm outline-none" />
        <div className="mt-6 flex gap-3"><button onClick={save} disabled={!complete} className={cn("rounded-2xl px-5 py-3 text-sm font-bold", complete ? "bg-emerald-800 text-white" : "bg-slate-100 text-slate-500")}>Runde speichern</button><button onClick={()=>setForm(blankForm(form.courseKey))} className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-bold">Zurücksetzen</button></div>
      </Card>
      <Card><div className="mb-5 text-lg font-bold">Letzte Runden</div>{sortRounds(rounds).slice(0,8).map((r)=><div key={r.id} className="mb-3 rounded-xl bg-slate-50 p-4"><div className="flex justify-between"><b>{r.total} · {r.date}</b><button onClick={()=>setForm({...blankForm(r.courseKey),...r,holes:r.holes.map(String)})} className="text-sm font-bold text-emerald-800">Edit</button></div><div className="text-xs text-slate-500">{courses[r.courseKey]?.name}</div></div>)}</Card>
    </div>
  );
}
function FinanceInputs({ form, setForm }) {
  const fields = [["greenfee","Greenfee €"],["range","Range €"],["food","Essen €"],["tournament","Turnier €"],["other","Sonstiges €"]];
  const sum = Object.values(form.costs).reduce((s,v)=>s+(Number(v)||0),0);
  return <Card className="mt-6 bg-slate-50"><div className="mb-4 flex justify-between"><div><div className="text-lg font-bold">Kosten dieser Runde</div><div className="text-sm text-slate-500">Range Tuttendörfl: 3,30€ pro Korb</div></div><b className="text-emerald-800">{eur(sum)}</b></div><div className="grid gap-3 md:grid-cols-5">{fields.map(([k,l])=><MiniInput key={k} label={l} value={form.costs[k]} onChange={(v)=>setForm({...form,costs:{...form.costs,[k]:v}})}/>)}</div></Card>;
}
function RatingInputs({ form, setForm }) {
  const Slider = ({ group, k, label }) => <div><div className="mb-1 flex justify-between text-sm font-bold"><span>{label}</span><span>{form[group][k]}/10</span></div><input type="range" min="1" max="10" value={form[group][k]} onChange={(e)=>setForm({...form,[group]:{...form[group],[k]:e.target.value}})} className="w-full accent-emerald-800" /></div>;
  return <div className="mt-6 grid gap-6 xl:grid-cols-2"><Card className="bg-slate-50"><div className="mb-4 text-lg font-bold">Mental Check</div>{[["focus","Fokus"],["energy","Energie"],["frustration","Frust"],["confidence","Selbstvertrauen"],["management","Course Mgmt"]].map(([k,l])=><Slider key={k} group="mental" k={k} label={l}/>)}</Card><Card className="bg-slate-50"><div className="mb-4 text-lg font-bold">Platz-Ranking</div>{[["overall","Gesamt"],["greens","Greens"],["fairways","Fairways"],["atmosphere","Atmosphäre"]].map(([k,l])=><Slider key={k} group="courseRating" k={k} label={l}/>)}</Card></div>;
}

function Stats({ rounds }) {
  const [courseKey,setCourseKey]=useState("maxx"), [hole,setHole]=useState(1);
  const course=courses[courseKey], rs=sortRounds(rounds).filter(r=>r.courseKey===courseKey), h=course.holes[hole-1];
  const trend=rs.slice().reverse().map((r,i)=>({round:i+1,score:Number(r.holes?.[hole-1])||null}));
  const replay=rs[0]?.holes?.map((score,i)=>({hole:`L${i+1}`,score}))||[];
  return <div className="space-y-6"><Card><div className="mb-5 flex justify-between gap-4"><div><div className="text-lg font-bold">Performance Heatmap</div><div className="text-sm text-slate-500">Klick auf ein Loch für Details.</div></div><div className="flex rounded-2xl bg-slate-100 p-1">{Object.entries(courses).map(([k,c])=><button key={k} onClick={()=>{setCourseKey(k);setHole(1);}} className={cn("rounded-xl px-4 py-2 text-xs font-bold",courseKey===k?"bg-white":"text-slate-500")}>{c.name}</button>)}</div></div><div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-9">{course.holes.map((x,i)=>{const mini=rs.slice().reverse().map((r,j)=>({round:j+1,score:r.holes?.[i]}));return <button key={x.n} onClick={()=>setHole(x.n)} className={cn("rounded-xl bg-white p-4 text-left ring-1 ring-slate-200",hole===x.n&&"ring-2 ring-emerald-600")}><div className="text-sm font-bold text-slate-500">Loch</div><div className="text-4xl font-bold">{x.n}</div><div className="mt-2 text-sm font-semibold">Ø {avg(rs.map(r=>r.holes?.[i])).toFixed(1)}</div><div className="mt-3 h-12"><Trend data={mini}/></div></button>})}</div></Card><div className="grid gap-6 xl:grid-cols-[1fr_360px]"><Card><div className="mb-5 text-lg font-bold">Loch {hole} Verlauf</div><div className="h-80"><Trend data={trend} area /></div></Card><Card><div className="text-lg font-bold">Loch-Analyse</div><div className="mt-5 rounded-2xl bg-emerald-50 p-4"><b>{h.focus}</b><p className="mt-2 text-sm text-slate-600">Par {h.par} · HCP {h.hcp}</p></div></Card></div><Card><div className="mb-5 text-lg font-bold">Round Replay</div><div className="h-80"><ResponsiveContainer width="100%" height="100%"><LineChart data={replay}><XAxis dataKey="hole"/><YAxis/><Tooltip/><Line type="monotone" dataKey="score" stroke="#166534" strokeWidth={3}/></LineChart></ResponsiveContainer></div></Card></div>;
}

function LiveRound({ rounds, setRounds }) {
  const [hole,setHole]=useState(1), [scores,setScores]=useState({}), [sun,setSun]=useState(false), [saved,setSaved]=useState(false);
  const course=courses.maxx, h=course.holes[hole-1];
  const save=(v)=>{setScores({...scores,[hole]:v}); if(window.speechSynthesis){speechSynthesis.speak(new SpeechSynthesisUtterance(`Loch ${hole}, Score ${v}`));}};
  const total=Object.values(scores).reduce((s,v)=>s+v,0), played=Object.keys(scores).length;
  const finishRound=()=>{
    if(played!==9) return;
    const holes=Array.from({length:9},(_,i)=>Number(scores[i+1])||0);
    const payload={
      id:uid(),
      date:new Date().toISOString().slice(0,10),
      courseKey:"maxx",
      total,
      holes,
      fir:0,
      gir:0,
      putts:0,
      note:"Automatisch aus Live Caddie gespeichert",
      costs:{greenfee:0,range:0,food:0,tournament:0,other:0},
      mental:{focus:7,energy:7,frustration:3,confidence:7,management:7},
      courseRating:{overall:8,greens:7,fairways:7,atmosphere:8,playAgain:true},
    };
    const updated=sortRounds([payload,...rounds]);
    setRounds(updated);
    persist(updated);
    setSaved(true);
  };
  return <div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]"><Card className={cn("bg-slate-950 p-8 text-white",sun&&"bg-white text-black")}><div className="flex justify-between"><div><div className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">Live Round</div><div className="mt-5 text-8xl font-bold">{hole}</div><div>Par {h.par} · HCP {h.hcp}</div></div><button onClick={()=>setSun(!sun)} className="h-12 rounded-full bg-emerald-500 px-5 font-bold text-black">☀</button></div><div className="mt-8 rounded-3xl bg-white/10 p-6"><b>AI Caddie Briefing</b><p className="mt-3 text-2xl font-bold">{h.focus}. Kontrolle vor Risiko.</p></div><div className="mt-8 grid grid-cols-3 gap-4">{[h.par-1,h.par,h.par+1].map((v,i)=><button key={v} onClick={()=>save(v)} className="rounded-3xl bg-emerald-500 px-4 py-10 text-4xl font-black text-black">{v}<div className="text-xs">{["Birdie","Par","Bogey"][i]}</div></button>)}</div><div className="mt-6 grid grid-cols-2 gap-3"><button onClick={()=>setHole(Math.max(1,hole-1))} className="rounded-2xl bg-white/10 p-4 font-bold">← Zurück</button><button onClick={()=>setHole(Math.min(9,hole+1))} className="rounded-2xl bg-emerald-500 p-4 font-bold text-black">Weiter →</button></div>

<div className="mt-4 grid gap-3">
  <button
    onClick={finishRound}
    disabled={played!==9 || saved}
    className={cn(
      "rounded-2xl p-4 text-sm font-bold transition",
      played===9 && !saved
        ? "bg-white text-black"
        : "bg-white/10 text-white/40"
    )}
  >
    {saved ? "Runde gespeichert ✓" : "Live Runde speichern"}
  </button>
</div></Card><Card><div className="text-lg font-bold">Live Status</div><div className="mt-6 grid gap-4"><Kpi icon="Σ" label="Live Score" value={played?total:"—"} sub={`${played}/9 gespielt`}/><Kpi icon="◉" label="Aktuelles Loch" value={hole} sub={h.focus}/></div></Card></div>;
}

function CoachScreen({ rounds }) {
  const a=analysis(rounds), [messages,setMessages]=useState([{role:"coach",text:"System online. Frag mich: Was ist mein größter Hebel?"}]), [input,setInput]=useState("");
  const speak=(t)=>{ if(window.speechSynthesis){speechSynthesis.cancel(); speechSynthesis.speak(new SpeechSynthesisUtterance(t));} };
  const ask=(q)=>{ if(!q.trim())return; const res=q.toLowerCase().includes("hebel")?`Dein größter Hebel ist Loch ${a.weakness?.n||6}: ${a.weakness?.focus||"Ball im Spiel halten"}.`:`Fokus: Kontrolle, Tempo und klares Course Management.`; setMessages([...messages,{role:"you",text:q},{role:"coach",text:res}]); setInput(""); speak(res); };
  return <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]"><Card className="bg-slate-950 p-8 text-white"><div className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">Caddie Intelligence</div><div className="mt-7 text-6xl font-bold">AI</div><button onClick={()=>speak("JARVIS online. GolfTrack Unicorn ist bereit.")} className="mt-8 rounded-2xl bg-emerald-500 px-5 py-4 font-bold text-black">Stimme testen</button></Card><Card><div className="mb-5 text-lg font-bold">Command Deck</div><div className="space-y-3 rounded-2xl bg-slate-50 p-4">{messages.map((m,i)=><div key={i} className={cn("max-w-[88%] rounded-2xl px-4 py-3 text-sm",m.role==="you"?"ml-auto bg-emerald-800 text-white":"bg-white")}>{m.text}</div>)}</div><div className="mt-4 flex gap-2"><input value={input} onChange={(e)=>setInput(e.target.value)} className="flex-1 rounded-2xl bg-slate-100 px-4 py-3 outline-none"/><button onClick={()=>ask(input)} className="rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white">Senden</button></div></Card></div>;
}

function FinanceScreen({ rounds }) {
  const f = financeMetrics(rounds);
  const [trainings, setTrainings] = useState(loadTrainings);
  const [trainingForm, setTrainingForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    type: "Range",
    note: "",
    buckets: 1,
    trainerHours: 0,
  });
  const sorted = sortRounds(rounds);
  const [settings, setSettings] = useState({
    membershipMonthly: financeSettings.membershipMonthly,
    referenceGreenfeeWeekday: 25,
    referenceGreenfeeWeekend: 29,
    rangeBuckets: 4,
    trainerHours: 1,
  });

  const trend = sorted.slice().reverse().map((r, i) => ({ round: i + 1, score: roundCost(r) }));
  const cats = [
    ["Greenfees", f.byCategory.greenfee],
    ["Range", f.byCategory.range],
    ["Essen", f.byCategory.food],
    ["Turniere", f.byCategory.tournament],
    ["Sonstiges", f.byCategory.other],
  ];
  const max = Math.max(...cats.map(([, v]) => v), 1);

  const rangeMonthly = Number(settings.rangeBuckets || 0) * financeSettings.rangeBucketPrice;
  const trainerMonthly = Number(settings.trainerHours || 0) * financeSettings.trainerHour;
  const trainingTotal = trainings.reduce((sum, t) => sum + trainingCost(t), 0);
  const monthlyTotal = Number(settings.membershipMonthly || 0) + rangeMonthly + trainerMonthly;
  const realTotalWithTrainings = f.variableTotal + Number(settings.membershipMonthly || 0) + trainingTotal;
  const breakEvenWeekday = Number(settings.referenceGreenfeeWeekday) > 0
    ? Math.ceil(Number(settings.membershipMonthly || 0) / Number(settings.referenceGreenfeeWeekday))
    : 0;

  const breakEvenWeekend = Number(settings.referenceGreenfeeWeekend) > 0
    ? Math.ceil(Number(settings.membershipMonthly || 0) / Number(settings.referenceGreenfeeWeekend))
    : 0;
  

  const updateSetting = (key, value) => setSettings({ ...settings, [key]: value });
  const saveTraining = () => {
    const next = [{ ...trainingForm, id: uid(), buckets: Number(trainingForm.buckets) || 0, trainerHours: Number(trainingForm.trainerHours) || 0 }, ...trainings];
    setTrainings(next);
    persistTrainings(next);
    setTrainingForm({ date: new Date().toISOString().slice(0, 10), type: "Range", note: "", buckets: 1, trainerHours: 0 });
  };
  const deleteTraining = (id) => {
    const next = trainings.filter((t) => t.id !== id);
    setTrainings(next);
    persistTrainings(next);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Kpi icon="€" label="Gesamt real" value={eur(realTotalWithTrainings)} sub="Runden + Training + Mitgliedschaft" trend={trend} />
        <Kpi icon="⚑" label="Ø Runde" value={eur(f.avgCost)} sub="variable Kosten" trend={trend} />
        <Kpi icon="◉" label="Mitgliedschaft" value={eur(settings.membershipMonthly)} sub="pro Monat" />
        <Kpi icon="⛳" label="Training" value={eur(trainingTotal)} sub={`${trainings.length} Einheiten`} />
        <Kpi icon="↔" label="Break-even" value={`${breakEvenWeekday}/${breakEvenWeekend}`} sub="Woche / Wochenende" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <Card>
          <div className="mb-5 text-lg font-bold">Kostenverlauf</div>
          <div className="h-80"><Trend data={trend} area /></div>
        </Card>

        <Card>
          <div className="text-lg font-bold">Finance Cockpit</div>
          <div className="mt-1 text-sm font-semibold text-slate-500">Hier kannst du deine echten Fixkosten testen.</div>

          <div className="mt-5 space-y-3">
            <MiniInput label="Mitgliedschaft €/Monat" value={settings.membershipMonthly} onChange={(v) => updateSetting("membershipMonthly", v)} />
            <MiniInput label="Greenfee Woche €" value={settings.referenceGreenfeeWeekday} onChange={(v) => updateSetting("referenceGreenfeeWeekday", v)} />
            <MiniInput label="Greenfee Wochenende €" value={settings.referenceGreenfeeWeekend} onChange={(v) => updateSetting("referenceGreenfeeWeekend", v)} />
            <MiniInput label="Range Körbe / Monat" value={settings.rangeBuckets} onChange={(v) => updateSetting("rangeBuckets", v)} />
            <MiniInput label="Trainerstunden / Monat" value={settings.trainerHours} onChange={(v) => updateSetting("trainerHours", v)} />
          </div>

          <div className="mt-6 rounded-2xl bg-emerald-50 p-5 ring-1 ring-emerald-100">
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">Break-even</div>
            <div className="mt-2 text-4xl font-bold text-emerald-900">{breakEvenWeekday} / {breakEvenWeekend}</div>
            <p className="mt-2 text-sm font-semibold leading-6 text-emerald-800">
              Unter der Woche lohnt sich die Mitgliedschaft ab ca. {breakEvenWeekday} Runden bei 25€ Greenfee.
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-emerald-800">
              Am Wochenende ab ca. {breakEvenWeekend} Runden bei 29€ Greenfee.
            </p>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <Card>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <div className="text-lg font-bold">Training Kalender</div>
              <div className="mt-1 text-sm font-semibold text-slate-500">Datum, Inhalt und Kosten deiner Trainingseinheiten.</div>
            </div>
            <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800">{eur(trainingTotal)}</div>
          </div>

          <div className="grid gap-3 md:grid-cols-5">
            <label className="rounded-[1.2rem] bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-600">Datum</div>
              <input type="date" value={trainingForm.date} onChange={(e) => setTrainingForm({ ...trainingForm, date: e.target.value })} className="mt-2 w-full bg-transparent text-sm font-bold outline-none" />
            </label>
            <label className="rounded-[1.2rem] bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-600">Typ</div>
              <select value={trainingForm.type} onChange={(e) => setTrainingForm({ ...trainingForm, type: e.target.value })} className="mt-2 w-full bg-transparent text-sm font-bold outline-none">
                <option>Range</option>
                <option>Trainer</option>
                <option>Putting</option>
                <option>Short Game</option>
                <option>Fitness</option>
              </select>
            </label>
            <MiniInput label="Körbe" value={trainingForm.buckets} onChange={(v) => setTrainingForm({ ...trainingForm, buckets: v })} />
            <MiniInput label="Trainer h" value={trainingForm.trainerHours} onChange={(v) => setTrainingForm({ ...trainingForm, trainerHours: v })} />
            <div className="rounded-[1.2rem] bg-emerald-50 p-4 ring-1 ring-emerald-100">
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">Kosten</div>
              <div className="mt-2 text-2xl font-bold text-emerald-900">{eur(trainingCost(trainingForm))}</div>
            </div>
          </div>

          <textarea value={trainingForm.note} onChange={(e) => setTrainingForm({ ...trainingForm, note: e.target.value })} placeholder="Was hast du trainiert? z. B. Driver 80%, Putting Tempo, Bunker…" className="mt-4 min-h-20 w-full rounded-[1.2rem] bg-slate-50 p-4 text-sm font-semibold outline-none ring-1 ring-slate-200" />
          <button onClick={saveTraining} className="mt-4 rounded-2xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white">Training speichern</button>

          <div className="mt-6 space-y-3">
            {trainings.slice(0, 8).map((t) => (
              <div key={t.id} className="grid gap-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 md:grid-cols-[110px_100px_1fr_80px_40px] md:items-center">
                <div className="text-sm font-bold text-slate-700">{t.date}</div>
                <div className="text-sm font-bold text-emerald-800">{t.type}</div>
                <div className="text-sm font-semibold text-slate-600">{t.note || "—"}</div>
                <div className="text-right text-sm font-bold text-slate-900">{eur(trainingCost(t))}</div>
                <button onClick={() => deleteTraining(t.id)} className="text-sm font-bold text-rose-600">×</button>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="text-lg font-bold">Training Finance</div>
          <div className="mt-5 space-y-4">
            <FinanceLine label="Training gesamt" value={trainingTotal} />
            <FinanceLine label="Range gesamt" value={trainings.reduce((s, t) => s + (Number(t.buckets) || 0) * financeSettings.rangeBucketPrice, 0)} />
            <FinanceLine label="Trainer gesamt" value={trainings.reduce((s, t) => s + (Number(t.trainerHours) || 0) * financeSettings.trainerHour, 0)} />
            <div className="border-t border-slate-200 pt-4">
              <FinanceLine label="Real Total inkl. Training" value={realTotalWithTrainings} strong />
            </div>
          </div>
          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-700">
            Jede Trainerstunde wird mit 48€ gerechnet. Jeder Rangekorb mit 3,30€. So siehst du sofort, was Training zusätzlich zu den Runden wirklich kostet.
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <Card>
          <div className="text-lg font-bold">Monatskosten Simulation</div>
          <div className="mt-5 space-y-4">
            <FinanceLine label="Mitgliedschaft" value={settings.membershipMonthly} />
            <FinanceLine label={`Range (${settings.rangeBuckets} × 3,30€)`} value={rangeMonthly} />
            <FinanceLine label={`Trainer (${settings.trainerHours} × 48€)`} value={trainerMonthly} />
            <div className="border-t border-slate-200 pt-4">
              <FinanceLine label="Gesamt pro Monat" value={monthlyTotal} strong />
            </div>
          </div>
        </Card>

        <Card>
          <div className="text-lg font-bold">Kategorien</div>
          <div className="mt-5 space-y-4">
            {cats.map(([l, v]) => (
              <div key={l}>
                <div className="mb-2 flex justify-between text-sm font-semibold"><span>{l}</span><span>{eur(v)}</span></div>
                <div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-emerald-800" style={{ width: `${Math.max(4, v / max * 100)}%` }} /></div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm font-semibold">
            Rangekorb Tuttendörfl: 3,30€ · Trainerstunde: 48€ · Mitgliedschaft: 143€/Monat.
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-4 text-lg font-bold">Rundenwert</div>
        {sorted.slice(0, 8).map((r) => (
          <div key={r.id} className="grid grid-cols-4 border-t py-3 text-sm font-semibold">
            <span>{r.date}</span>
            <span>{(courses[r.courseKey]?.name || "Unbekannter Platz")}</span>
            <span className="text-right">{r.total}</span>
            <span className="text-right text-emerald-800">{eur(roundCost(r))}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

function FinanceLine({ label, value, strong = false }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className={cn("text-sm font-semibold", strong ? "text-slate-950" : "text-slate-600")}>{label}</div>
      <div className={cn("font-bold", strong ? "text-2xl text-emerald-900" : "text-slate-800")}>{eur(value)}</div>
    </div>
  );
}

function MentalScreen({ rounds }) {
  const m=mentalMetrics(rounds), trend=sortRounds(rounds).slice().reverse().map((r,i)=>({round:i+1,score:mentalScore(r)}));
  const courseRows=Object.entries(courses).map(([k,c])=>{const rs=rounds.filter(r=>r.courseKey===k);return {name:c.name, rounds:rs.length, rating:avg(rs.map(r=>r.courseRating?.overall)), greens:avg(rs.map(r=>r.courseRating?.greens)), again:Math.round(rs.filter(r=>r.courseRating?.playAgain).length/Math.max(1,rs.length)*100)}});
  return <div className="space-y-6"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><Kpi icon="◌" label="Mental Score" value={m.score.toFixed(1)} sub="/10" trend={trend}/><Kpi icon="●" label="Fokus" value={m.focus.toFixed(1)} sub="/10"/><Kpi icon="↓" label="Frust" value={m.frustration.toFixed(1)} sub="niedriger ist besser"/><Kpi icon="★" label="Platz Rating" value={m.course.toFixed(1)} sub="/10"/></div><Card><div className="mb-5 text-lg font-bold">Mental Verlauf</div><div className="h-80"><Trend data={trend} area domain={[0,10]}/></div></Card><Card><div className="mb-4 text-lg font-bold">Golfplatz Ranking</div>{courseRows.map(r=><div key={r.name} className="grid grid-cols-5 border-t py-3 text-sm font-semibold"><span className="col-span-2">{r.name}</span><span>{r.rounds} R.</span><span>{r.rating.toFixed(1)}</span><span className="text-emerald-800">{r.again}%</span></div>)}</Card></div>;
}

function Plan() { return <Card><div className="text-2xl font-bold">Ziele</div><p className="mt-3 text-slate-600">Nächster Fokus: Loch 6 stabilisieren, Putts reduzieren, Mental Score über 7 halten.</p></Card>; }
function Tools({ rounds,setRounds }) { return <div className="grid gap-6 md:grid-cols-2"><Card><div className="text-2xl font-bold">Backup</div><button onClick={()=>navigator.clipboard?.writeText(JSON.stringify(rounds,null,2))} className="mt-6 rounded-2xl bg-emerald-800 px-5 py-3 font-bold text-white">JSON kopieren</button></Card><Card><div className="text-2xl font-bold">Reset</div><button onClick={()=>{setRounds(demoRounds);persist(demoRounds)}} className="mt-6 rounded-2xl bg-slate-100 px-5 py-3 font-bold">Demo-Daten laden</button></Card></div>; }

export default function App() {
  const [tab,setTab]=useState("home");
  const [rounds,setRounds]=useState(loadRounds);
  const screens={home:<Home rounds={rounds}/>,round:<RoundEntry rounds={rounds} setRounds={setRounds}/>,stats:<Stats rounds={rounds}/>,live:<LiveRound rounds={rounds} setRounds={setRounds}/>,coach:<CoachScreen rounds={rounds}/>,finance:<FinanceScreen rounds={rounds}/>,mental:<MentalScreen rounds={rounds}/>,plan:<Plan/>,tools:<Tools rounds={rounds} setRounds={setRounds}/>};
  return <Shell tab={tab} setTab={setTab}>{screens[tab]}</Shell>;
}
