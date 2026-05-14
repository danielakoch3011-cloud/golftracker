import FinanceScreen from "./screens/FinanceScreen";
import LiveRound from "./screens/LiveRound.jsx";
import Stats from "./screens/Stats.jsx";
import Home from "./screens/Home.jsx";
import Shell from "./components/Shell.jsx";
import FinanceLine from "./components/FinanceLine.jsx";
import BarRow from "./components/BarRow.jsx";
import MiniInput from "./components/MiniInput.jsx";
import Trend from "./components/Trend.jsx";
import Kpi from "./components/Kpi.jsx";
import Card from "./components/Card.jsx";
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

const STORAGE_KEY = "golftrack_unicorn_rounds_v2";
const TRAINING_KEY = "golftrack_unicorn_trainings_v1";

const courses = {
  maxx: {
    name: "GolfMaxX Tuttenhof",
    holes: [
      [1, 4, 12, "Sicherer Start"],
      [2, 3, 8, "Mitte Grün"],
      [3, 3, 16, "2 Putts"],
      [4, 4, 2, "Kein Risiko"],
      [5, 3, 14, "Tempo"],
      [6, 5, 1, "Bogey akzeptieren"],
      [7, 3, 18, "Routine"],
      [8, 4, 4, "Fairway zuerst"],
      [9, 3, 10, "Ruhig finishen"],
    ].map(([n, par, hcp, focus]) => ({ n, par, hcp, focus })),
  },
  doerfl: {
    name: "GC Tuttendörfl",
    holes: [
      [1, 4, 9, "Ruhiger Start"],
      [2, 3, 15, "Mitte Grün"],
      [3, 5, 3, "Ball im Spiel"],
      [4, 4, 1, "Konservativ"],
      [5, 3, 17, "Nicht kurz"],
      [6, 4, 5, "Fairway"],
      [7, 4, 11, "Kontrolle"],
      [8, 3, 13, "2 Putts"],
      [9, 5, 7, "Heimspielen"],
    ].map(([n, par, hcp, focus]) => ({ n, par, hcp, focus })),
  },
};

const financeSettings = {
  membershipMonthly: 143,
  rangeBucketPrice: 3.3,
  trainerHour: 48,
};

const modules = [
  ["home", "Übersicht", "⌂"],
  ["round", "Runden", "⚑"],
  ["stats", "Statistiken", "▥"],
  ["live", "Live Caddie", "◉"],
  ["coach", "AI Coach", "✦"],
  ["finance", "Golf Finance", "€"],
  ["mental", "Mental", "◌"],
  ["plan", "Ziele", "◎"],
  ["tools", "Berichte", "▤"],
];

const demoRounds = [
  ["2026-04-06", "maxx", 66, [8, 7, 7, 8, 6, 9, 7, 8, 6], 30, 18, 3.4, "Erste dokumentierte Runde", [29, 8, 12, 0, 0], [4, 5, 7, 3, 4], [7, 6, 7, 7, true]],
  ["2026-04-11", "maxx", 56, [6, 5, 6, 7, 5, 8, 6, 7, 6], 55, 28, 3.0, "Beste frühe Runde", [29, 6, 10, 0, 0], [7, 7, 3, 6, 7], [7, 7, 7, 8, true]],
  ["2026-04-12", "maxx", 67, [8, 7, 8, 8, 7, 9, 6, 8, 6], 35, 20, 3.6, "Putting schwach", [29, 10, 8, 0, 6], [3, 5, 8, 3, 3], [6, 5, 7, 6, true]],
  ["2026-04-17", "maxx", 58, [6, 6, 6, 7, 6, 8, 6, 7, 6], 50, 31, 3.1, "Ruhiger gespielt", [29, 7, 12, 0, 0], [6, 6, 4, 5, 6], [7, 7, 7, 7, true]],
  ["2026-04-18", "maxx", 61, [7, 6, 7, 7, 6, 9, 6, 7, 6], 46, 24, 3.3, "Loch 6 teuer", [29, 8, 9, 0, 4], [5, 5, 7, 4, 4], [6, 6, 7, 6, true]],
  ["2026-04-25", "maxx", 54, [6, 5, 6, 6, 5, 8, 6, 6, 6], 62, 35, 2.9, "Kontrollierter", [29, 8, 11, 0, 0], [7, 7, 3, 6, 7], [8, 7, 8, 8, true]],
  ["2026-04-26", "maxx", 52, [5, 5, 6, 6, 5, 8, 5, 6, 6], 64, 38, 2.8, "Stabiler Abschlag", [29, 5, 13, 0, 0], [8, 8, 2, 7, 8], [8, 8, 8, 8, true]],
  ["2026-05-01", "doerfl", 49, [5, 4, 6, 6, 4, 6, 6, 5, 7], 67, 42, 2.7, "Guter Fokus", [45, 8, 14, 0, 0], [8, 8, 2, 8, 8], [9, 8, 8, 9, true]],
  ["2026-05-03", "doerfl", 51, [6, 4, 6, 6, 5, 6, 6, 5, 7], 59, 40, 2.9, "Kurzspiel besser", [45, 10, 16, 0, 0], [7, 7, 3, 7, 7], [8, 8, 7, 8, true]],
  ["2026-05-04", "doerfl", 47, [5, 4, 5, 5, 4, 6, 5, 5, 8], 72, 48, 2.6, "Bestwert", [45, 8, 18, 0, 0], [9, 8, 1, 9, 9], [9, 9, 8, 9, true]],
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
const uid = () => `r-${Date.now()}-${Math.random().toString(16).slice(2)}`;
const eur = (v) => `${Math.round(Number(v) || 0)}€`;
const avg = (v) => {
  const n = v.map(Number).filter(Number.isFinite);
  return n.length ? n.reduce((a, b) => a + b, 0) / n.length : 0;
};
const sortRounds = (r) => [...r].sort((a, b) => new Date(b.date) - new Date(a.date));

function roundCost(r) {
  const c = r.costs || {};
  return ["greenfee", "range", "food", "tournament", "other"].reduce((s, k) => s + (Number(c[k]) || 0), 0);
}

function trainingCost(t) {
  return (Number(t.buckets) || 0) * financeSettings.rangeBucketPrice + (Number(t.trainerHours) || 0) * financeSettings.trainerHour;
}

function mentalScore(r) {
  const m = r.mental || {};
  return avg([m.focus, m.energy, m.confidence, m.management, 10 - (Number(m.frustration) || 0)]);
}

function loadRounds() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(saved) || !saved.length) return demoRounds;

    const clean = saved
      .filter((r) => r && courses[r.courseKey] && Array.isArray(r.holes) && r.holes.length === 9)
      .map((r) => ({
        ...r,
        id: r.id || uid(),
        total: Number(r.total) || r.holes.reduce((s, v) => s + (Number(v) || 0), 0),
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
      { id: "t2", date: "2026-05-06", type: "Trainer", note: "Setup, Alignment", buckets: 1, trainerHours: 1 },
    ];
  } catch {
    return [];
  }
}

function persistTrainings(trainings) {
  localStorage.setItem(TRAINING_KEY, JSON.stringify(trainings));
}

function metrics(rounds) {
  const totals = rounds.map((r) => Number(r.total)).filter(Number.isFinite);
  return {
    rounds: rounds.length,
    avg: Math.round(avg(totals)),
    best: totals.length ? Math.min(...totals) : "—",
    fir: `${Math.round(avg(rounds.map((r) => r.fir)))}%`,
    gir: `${Math.round(avg(rounds.map((r) => r.gir)))}%`,
    putts: avg(rounds.map((r) => r.putts)).toFixed(1),
  };
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
    estimatedTraining,
    total: variableTotal + financeSettings.membershipMonthly + estimatedTraining,
    avgCost: rounds.length ? variableTotal / rounds.length : 0,
    byCategory,
  };
}

function mentalMetrics(rounds) {
  return {
    score: avg(rounds.map(mentalScore)),
    focus: avg(rounds.map((r) => r.mental?.focus)),
    frustration: avg(rounds.map((r) => r.mental?.frustration)),
    course: avg(rounds.map((r) => r.courseRating?.overall)),
  };
}

function analysis(rounds) {
  const sorted = sortRounds(rounds);
  const holes = Object.keys(courses)
    .flatMap((courseKey) => {
      const rs = sorted.filter((r) => r.courseKey === courseKey);
      return courses[courseKey].holes.map((h, i) => {
        const a = avg(rs.map((r) => r.holes?.[i]));
        return { ...h, courseKey, avg: a, overPar: a - h.par, rounds: rs.length };
      });
    })
    .filter((h) => h.rounds);
  return {
    sorted,
    latest: sorted[0],
    weakness: [...holes].sort((a, b) => b.overPar - a.overPar)[0],
  };
}
const blankForm = (courseKey = "maxx") => ({
  id: null,
  date: new Date().toISOString().slice(0, 10),
  courseKey,
  holes: Array(9).fill(""),
  fir: "",
  gir: "",
  putts: "",
  note: "",
  costs: { greenfee: "", range: "", food: "", tournament: "", other: "" },
  mental: { focus: 5, energy: 5, frustration: 5, confidence: 5, management: 5 },
  courseRating: { overall: 5, greens: 5, fairways: 5, atmosphere: 5, playAgain: true },
});

function RoundEntry({ rounds, setRounds }) {
  const [form, setForm] = useState(blankForm());
  const course = courses[form.courseKey];
  const total = form.holes.reduce((s, v) => s + (Number(v) || 0), 0);
  const complete = form.holes.every((v) => Number(v) > 0);
  const updateHole = (i, v) => {
    const h = [...form.holes];
    h[i] = v === "" ? "" : Math.max(1, Math.min(20, Number(v)));
    setForm({ ...form, holes: h });
  };
  const save = () => {
    if (!complete) return;
    const numObj = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, k === "playAgain" ? Boolean(v) : Number(v) || 0]));
    const payload = { ...form, id: form.id || uid(), total, holes: form.holes.map(Number), fir: Number(form.fir) || 0, gir: Number(form.gir) || 0, putts: Number(form.putts) || 0, costs: numObj(form.costs), mental: numObj(form.mental), courseRating: numObj(form.courseRating) };
    const updated = form.id ? rounds.map((r) => (r.id === form.id ? payload : r)) : [payload, ...rounds];
    setRounds(sortRounds(updated));
    persist(sortRounds(updated));
    setForm(blankForm(form.courseKey));
  };
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <Card className="p-8">
        <div className="mb-6 flex flex-wrap gap-3"><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold outline-none" /><select value={form.courseKey} onChange={(e) => setForm(blankForm(e.target.value))} className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold outline-none"><option value="maxx">GolfMaxX Tuttenhof</option><option value="doerfl">GC Tuttendörfl</option></select></div>
        <div className="text-sm font-semibold text-slate-600">Scorecard</div><div className="mt-2 text-6xl font-bold">{complete ? total : "—"}</div>
        <div className="mt-8 grid grid-cols-3 gap-3 md:grid-cols-9">{course.holes.map((h, i) => <div key={h.n} className="rounded-[1.2rem] bg-white p-3 text-center ring-1 ring-slate-200"><div className="text-xs font-bold">L{h.n}</div><div className="text-sm text-slate-500">P{h.par}</div><input value={form.holes[i]} onChange={(e) => updateHole(i, e.target.value)} type="number" className="mt-3 w-full rounded-xl bg-slate-50 px-2 py-3 text-center text-xl font-bold outline-none" /></div>)}</div>
        <div className="mt-6 grid gap-3 md:grid-cols-3"><MiniInput label="FIR %" value={form.fir} onChange={(v) => setForm({ ...form, fir: v })} /><MiniInput label="GIR %" value={form.gir} onChange={(v) => setForm({ ...form, gir: v })} /><MiniInput label="Ø Putts" value={form.putts} onChange={(v) => setForm({ ...form, putts: v })} /></div>
        <FinanceInputs form={form} setForm={setForm} />
        <RatingInputs form={form} setForm={setForm} />
        <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Notiz zur Runde" className="mt-6 min-h-24 w-full rounded-[1.5rem] bg-slate-100 p-4 text-sm outline-none" />
        <div className="mt-6 flex gap-3"><button onClick={save} disabled={!complete} className={cn("rounded-2xl px-5 py-3 text-sm font-bold", complete ? "bg-emerald-800 text-white" : "bg-slate-100 text-slate-500")}>Runde speichern</button><button onClick={() => setForm(blankForm(form.courseKey))} className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-bold">Zurücksetzen</button></div>
      </Card>
      <Card><div className="mb-5 text-lg font-bold">Letzte Runden</div>{sortRounds(rounds).slice(0, 8).map((r) => <div key={r.id} className="mb-3 rounded-xl bg-slate-50 p-4"><div className="flex justify-between"><b>{r.total} · {r.date}</b><button onClick={() => setForm({ ...blankForm(r.courseKey), ...r, holes: r.holes.map(String) })} className="text-sm font-bold text-emerald-800">Edit</button></div><div className="text-xs text-slate-500">{courses[r.courseKey]?.name}</div></div>)}</Card>
    </div>
  );
}

function FinanceInputs({ form, setForm }) {
  const fields = [["greenfee", "Greenfee €"], ["range", "Range €"], ["food", "Essen €"], ["tournament", "Turnier €"], ["other", "Sonstiges €"]];
  const sum = Object.values(form.costs).reduce((s, v) => s + (Number(v) || 0), 0);
  return <Card className="mt-6 bg-slate-50"><div className="mb-4 flex justify-between"><div><div className="text-lg font-bold">Kosten dieser Runde</div><div className="text-sm text-slate-500">Range Tuttendörfl: 3,30€ pro Korb</div></div><b className="text-emerald-800">{eur(sum)}</b></div><div className="grid gap-3 md:grid-cols-5">{fields.map(([k, l]) => <MiniInput key={k} label={l} value={form.costs[k]} onChange={(v) => setForm({ ...form, costs: { ...form.costs, [k]: v } })} />)}</div></Card>;
}

function RatingInputs({ form, setForm }) {
  const Slider = ({ group, k, label }) => <div><div className="mb-1 flex justify-between text-sm font-bold"><span>{label}</span><span>{form[group][k]}/10</span></div><input type="range" min="1" max="10" value={form[group][k]} onChange={(e) => setForm({ ...form, [group]: { ...form[group], [k]: e.target.value } })} className="w-full accent-emerald-800" /></div>;
  return <div className="mt-6 grid gap-6 xl:grid-cols-2"><Card className="bg-slate-50"><div className="mb-4 text-lg font-bold">Mental Check</div>{[["focus", "Fokus"], ["energy", "Energie"], ["frustration", "Frust"], ["confidence", "Selbstvertrauen"], ["management", "Course Mgmt"]].map(([k, l]) => <Slider key={k} group="mental" k={k} label={l} />)}</Card><Card className="bg-slate-50"><div className="mb-4 text-lg font-bold">Platz-Ranking</div>{[["overall", "Gesamt"], ["greens", "Greens"], ["fairways", "Fairways"], ["atmosphere", "Atmosphäre"]].map(([k, l]) => <Slider key={k} group="courseRating" k={k} label={l} />)}</Card></div>;
}
function CoachScreen({ rounds }) {
  const a = analysis(rounds);
  const [messages, setMessages] = useState([{ role: "coach", text: "System online. Frag mich: Was ist mein größter Hebel?" }]);
  const [input, setInput] = useState("");
  const speak = (t) => { if (window.speechSynthesis) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance(t)); } };
  const ask = (q) => { if (!q.trim()) return; const res = q.toLowerCase().includes("hebel") ? `Dein größter Hebel ist Loch ${a.weakness?.n || 6}: ${a.weakness?.focus || "Ball im Spiel halten"}.` : "Fokus: Kontrolle, Tempo und klares Course Management."; setMessages([...messages, { role: "you", text: q }, { role: "coach", text: res }]); setInput(""); speak(res); };
  return <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]"><Card className="bg-slate-950 p-8 text-white"><div className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">Caddie Intelligence</div><div className="mt-7 text-6xl font-bold">AI</div><button onClick={() => speak("JARVIS online. GolfTrack Unicorn ist bereit.")} className="mt-8 rounded-2xl bg-emerald-500 px-5 py-4 font-bold text-black">Stimme testen</button></Card><Card><div className="mb-5 text-lg font-bold">Command Deck</div><div className="space-y-3 rounded-2xl bg-slate-50 p-4">{messages.map((m, i) => <div key={i} className={cn("max-w-[88%] rounded-2xl px-4 py-3 text-sm", m.role === "you" ? "ml-auto bg-emerald-800 text-white" : "bg-white")}>{m.text}</div>)}</div><div className="mt-4 flex gap-2"><input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 rounded-2xl bg-slate-100 px-4 py-3 outline-none" /><button onClick={() => ask(input)} className="rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white">Senden</button></div></Card></div>;
}
function MentalScreen({ rounds }) {
  const m = mentalMetrics(rounds);
  const trend = sortRounds(rounds).slice().reverse().map((r, i) => ({ round: i + 1, score: mentalScore(r) }));
  const courseRows = Object.entries(courses).map(([k, c]) => {
    const rs = rounds.filter((r) => r.courseKey === k);
    return { name: c.name, rounds: rs.length, rating: avg(rs.map((r) => r.courseRating?.overall)), again: Math.round((rs.filter((r) => r.courseRating?.playAgain).length / Math.max(1, rs.length)) * 100) };
  });
  return <div className="space-y-6"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><Kpi icon="◌" label="Mental Score" value={m.score.toFixed(1)} sub="/10" /><Kpi icon="●" label="Fokus" value={m.focus.toFixed(1)} sub="/10" /><Kpi icon="↓" label="Frust" value={m.frustration.toFixed(1)} sub="niedriger ist besser" /><Kpi icon="★" label="Platz Rating" value={m.course.toFixed(1)} sub="/10" /></div><Card><div className="mb-5 text-lg font-bold">Mental Verlauf</div><div className="h-80"><Trend data={trend} area domain={[0, 10]} /></div></Card><Card><div className="mb-4 text-lg font-bold">Golfplatz Ranking</div>{courseRows.map((r) => <div key={r.name} className="grid grid-cols-5 border-t py-3 text-sm font-semibold"><span className="col-span-2">{r.name}</span><span>{r.rounds} R.</span><span>{r.rating.toFixed(1)}</span><span className="text-emerald-800">{r.again}%</span></div>)}</Card></div>;
}

function Plan() {
  return <Card><div className="text-2xl font-bold">Ziele</div><p className="mt-3 text-slate-600">Nächster Fokus: Loch 6 stabilisieren, Putts reduzieren, Mental Score über 7 halten.</p></Card>;
}

function Tools({ rounds, setRounds }) {
  return <div className="grid gap-6 md:grid-cols-2"><Card><div className="text-2xl font-bold">Backup</div><button onClick={() => navigator.clipboard?.writeText(JSON.stringify(rounds, null, 2))} className="mt-6 rounded-2xl bg-emerald-800 px-5 py-3 font-bold text-white">JSON kopieren</button></Card><Card><div className="text-2xl font-bold">Reset</div><button onClick={() => { setRounds(demoRounds); persist(demoRounds); }} className="mt-6 rounded-2xl bg-slate-100 px-5 py-3 font-bold">Demo-Daten laden</button></Card></div>;
}

export default function App() {
  const [tab, setTab] = useState("home");
  const [rounds, setRounds] = useState(loadRounds);
  const screens = {
  home: (
    <Home
      rounds={rounds}
      metrics={metrics}
      analysis={analysis}
      financeMetrics={financeMetrics}
      mentalMetrics={mentalMetrics}
      eur={eur}
      mentalScore={mentalScore}
    />
  ),

  round: <RoundEntry rounds={rounds} setRounds={setRounds} />,
  stats: (
  <Stats
    rounds={rounds}
    courses={courses}
    sortRounds={sortRounds}
    avg={avg}
    cn={cn}
  />
),
  live: (
  <LiveRound
    rounds={rounds}
    setRounds={setRounds}
    courses={courses}
    cn={cn}
    uid={uid}
    sortRounds={sortRounds}
    persist={persist}
  />
),
  coach: <CoachScreen rounds={rounds} />,
  finance: <FinanceScreen rounds={rounds} />,
  mental: <MentalScreen rounds={rounds} />,
  plan: <Plan />,
  tools: <Tools rounds={rounds} setRounds={setRounds} />,
};
  return <Shell tab={tab} setTab={setTab}>{screens[tab]}</Shell>;
}
