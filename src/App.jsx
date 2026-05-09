import React, { useState } from "react";
import { Area, AreaChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const STORAGE_KEY = "golftrack_unicorn_rounds";

const courses = {
  maxx: {
    name: "GolfMaxX Tuttenhof",
    holes: [
      { n: 1, par: 4, hcp: 12, focus: "Sicherer Start" },
      { n: 2, par: 3, hcp: 8, focus: "Mitte Grün" },
      { n: 3, par: 3, hcp: 16, focus: "2 Putts" },
      { n: 4, par: 4, hcp: 2, focus: "Kein Risiko" },
      { n: 5, par: 3, hcp: 14, focus: "Tempo" },
      { n: 6, par: 5, hcp: 1, focus: "Bogey akzeptieren" },
      { n: 7, par: 3, hcp: 18, focus: "Routine" },
      { n: 8, par: 4, hcp: 4, focus: "Fairway zuerst" },
      { n: 9, par: 3, hcp: 10, focus: "Ruhig finishen" },
    ],
  },
  doerfl: {
    name: "GC Tuttendörfl",
    holes: [
      { n: 1, par: 4, hcp: 9, focus: "Ruhiger Start" },
      { n: 2, par: 3, hcp: 15, focus: "Mitte Grün" },
      { n: 3, par: 5, hcp: 3, focus: "Ball im Spiel" },
      { n: 4, par: 4, hcp: 1, focus: "Konservativ" },
      { n: 5, par: 3, hcp: 17, focus: "Nicht kurz" },
      { n: 6, par: 4, hcp: 5, focus: "Fairway" },
      { n: 7, par: 4, hcp: 11, focus: "Kontrolle" },
      { n: 8, par: 3, hcp: 13, focus: "2 Putts" },
      { n: 9, par: 5, hcp: 7, focus: "Heimspielen" },
    ],
  },
};

const demoRounds = [
  { id: "r1", date: "2026-04-06", courseKey: "maxx", total: 66, holes: [8, 7, 7, 8, 6, 9, 7, 8, 6], fir: 30, gir: 18, putts: 3.4, note: "Erste dokumentierte Runde" },
  { id: "r2", date: "2026-04-11", courseKey: "maxx", total: 56, holes: [6, 5, 6, 7, 5, 8, 6, 7, 6], fir: 55, gir: 28, putts: 3.0, note: "Beste frühe Runde" },
  { id: "r3", date: "2026-04-12", courseKey: "maxx", total: 67, holes: [8, 7, 8, 8, 7, 9, 6, 8, 6], fir: 35, gir: 20, putts: 3.6, note: "Putting schwach" },
  { id: "r4", date: "2026-04-17", courseKey: "maxx", total: 58, holes: [6, 6, 6, 7, 6, 8, 6, 7, 6], fir: 50, gir: 31, putts: 3.1, note: "Ruhiger gespielt" },
  { id: "r5", date: "2026-04-18", courseKey: "maxx", total: 61, holes: [7, 6, 7, 7, 6, 9, 6, 7, 6], fir: 46, gir: 24, putts: 3.3, note: "Loch 6 teuer" },
  { id: "r6", date: "2026-04-25", courseKey: "maxx", total: 54, holes: [6, 5, 6, 6, 5, 8, 6, 6, 6], fir: 62, gir: 35, putts: 2.9, note: "Kontrollierter" },
  { id: "r7", date: "2026-04-26", courseKey: "maxx", total: 52, holes: [5, 5, 6, 6, 5, 8, 5, 6, 6], fir: 64, gir: 38, putts: 2.8, note: "Stabiler Abschlag" },
  { id: "r8", date: "2026-05-01", courseKey: "doerfl", total: 49, holes: [5, 4, 6, 6, 4, 6, 6, 5, 7], fir: 67, gir: 42, putts: 2.7, note: "Guter Fokus" },
  { id: "r9", date: "2026-05-03", courseKey: "doerfl", total: 51, holes: [6, 4, 6, 6, 5, 6, 6, 5, 7], fir: 59, gir: 40, putts: 2.9, note: "Kurzspiel besser" },
  { id: "r10", date: "2026-05-04", courseKey: "doerfl", total: 47, holes: [5, 4, 5, 5, 4, 6, 5, 5, 8], fir: 72, gir: 48, putts: 2.6, note: "Bestwert" },
];

const modules = [
  ["home", "Übersicht", "⌂"],
  ["round", "Runden", "⚑"],
  ["stats", "Statistiken", "▥"],
  ["live", "Live Caddie", "◉"],
  ["coach", "AI Coach", "✦"],
  ["plan", "Ziele", "◎"],
  ["tools", "Berichte", "▤"],
];

function uid() {
  return `r-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function loadRounds() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : demoRounds;
  } catch {
    return demoRounds;
  }
}

function persist(rounds) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rounds));
}

function sortRounds(rounds) {
  return [...rounds].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function avg(values) {
  const nums = values.map(Number).filter(Number.isFinite);
  return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
}

function metrics(rounds) {
  const totals = rounds.map((r) => Number(r.total)).filter(Number.isFinite);
  const average = totals.length ? Math.round(avg(totals)) : "—";
  const best = totals.length ? Math.min(...totals) : "—";
  const metricAvg = (key) => avg(rounds.map((r) => r[key]));
  return {
    rounds: rounds.length,
    avg: average,
    best,
    fir: `${Math.round(metricAvg("fir"))}%`,
    gir: `${Math.round(metricAvg("gir"))}%`,
    putts: metricAvg("putts").toFixed(1),
  };
}

function analysis(rounds) {
  const sorted = sortRounds(rounds);
  const recent = sorted.slice(0, 3);
  const previous = sorted.slice(3, 6);
  const trend = previous.length ? Number((avg(previous.map((r) => r.total)) - avg(recent.map((r) => r.total))).toFixed(1)) : 0;
  const holes = Object.keys(courses).flatMap((courseKey) => {
    const courseRounds = sorted.filter((r) => r.courseKey === courseKey);
    return courses[courseKey].holes.map((hole, index) => {
      const scores = courseRounds.map((r) => Number(r.holes?.[index])).filter(Number.isFinite);
      const holeAvg = avg(scores);
      return { ...hole, courseKey, course: courses[courseKey].name, avg: Number(holeAvg.toFixed(1)), overPar: Number((holeAvg - hole.par).toFixed(1)), rounds: scores.length };
    });
  }).filter((h) => h.rounds > 0);
  const weakness = [...holes].sort((a, b) => b.overPar - a.overPar)[0];
  const latest = sorted[0];
  const predictedNext = latest ? Math.max(36, latest.total - Math.max(1, Math.round(Math.max(0, trend) / 2)) - 1) : null;
  return { sorted, trend, weakness, latest, predictedNext, confidence: Math.min(96, 62 + rounds.length * 3) };
}

function Card({ children, className = "" }) {
  return <section className={cn("rounded-[1.35rem] border border-slate-200/80 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.035)]", className)}>{children}</section>;
}

function Shell({ tab, setTab, children }) {
  const active = modules.find(([id]) => id === tab)?.[1] || "Übersicht";
  return (
    <div className="min-h-screen bg-[#f7f8f5] text-[#101418] antialiased">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[268px] border-r border-slate-200/80 bg-white/95 px-5 py-7 lg:flex lg:flex-col">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-700/25 bg-emerald-50 text-2xl font-bold text-emerald-800">⚑</div>
          <div className="text-2xl font-bold tracking-tight">GolfTrack</div>
        </div>
        <nav className="mt-12 space-y-2">
          {modules.map(([id, label, icon]) => (
            <button key={id} onClick={() => setTab(id)} className={cn("flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left text-[15px] font-semibold transition", tab === id ? "bg-emerald-50 text-emerald-900 shadow-sm ring-1 ring-emerald-100" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950")}>
              <span className="w-5 text-center text-xl leading-none">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4"><div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">System Status</div><div className="mt-2 flex items-center gap-2"><div className="h-2.5 w-2.5 rounded-full bg-emerald-500" /><div className="text-sm font-bold text-slate-800">UNICORN AI ONLINE</div></div></div>
          
          
        </div>
      </aside>
      <main className="pb-24 lg:ml-[268px] lg:pb-0">
        <div className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-2xl">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-5 px-5 py-5 md:px-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Hallo Dani! 👋</h1>
              <p className="mt-1 text-sm font-medium text-slate-500">Hier ist deine {active} Performance Übersicht.</p>
            </div>
            <div className="hidden items-center gap-4 md:flex">
              <button className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm">20. Mai – 16. Juni 2024⌄</button>
              <button onClick={() => setTab("round")} className="rounded-xl bg-emerald-800 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/15">+ Runde hinzufügen</button>
              <div className="h-11 w-11 rounded-full bg-gradient-to-br from-emerald-100 to-amber-100 ring-2 ring-white shadow-sm" />
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-[1440px] px-5 py-6 md:px-8 md:py-8">{children}</div>
      </main>
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/80 bg-white/95 p-2 lg:hidden">
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${modules.length}, minmax(0, 1fr))` }}>
          {modules.map(([id, label]) => <button key={id} onClick={() => setTab(id)} className={cn("rounded-2xl px-1 py-3 text-[10px] font-bold", tab === id ? "bg-emerald-800 text-white" : "text-slate-500")}>{label.split(" ")[0]}</button>)}
        </div>
      </div>
    </div>
  );
}

function TinyTrend({ data }) {
  return (
    <div className="mt-5 h-12">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}><Line type="monotone" dataKey="score" stroke="#166534" strokeWidth={2} dot={{ r: 2, strokeWidth: 0, fill: "#166534" }} /></LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function DashboardKpi({ icon, label, value, delta, trend, sub }) {
  return (
    <Card className="min-h-[190px] p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-lg text-emerald-800">{icon}</div><div className="text-sm font-bold text-slate-700">{label}</div></div>
        <span className="text-sm text-slate-400">ⓘ</span>
      </div>
      <div className="mt-7 flex items-end gap-3"><div className="text-4xl font-bold tracking-tight">{value}</div>{delta && <div className="mb-1 text-sm font-bold text-emerald-700">↓ {delta}</div>}</div>
      <TinyTrend data={trend} />
      {sub && <div className="mt-3 text-sm font-medium text-slate-500">{sub}</div>}
    </Card>
  );
}

function Home({ rounds }) {
  const m = metrics(rounds);
  const a = analysis(rounds);
  const trendData = a.sorted.slice().reverse().map((r, i) => ({ round: i + 1, score: r.total, date: r.date }));
  const latest = a.latest;
  const recentRounds = a.sorted.slice(0, 5);
  const latestPar = latest ? courses[latest.courseKey].holes.reduce((s, h) => s + h.par, 0) : 0;
  const distanceRows = [["Driver", 238], ["3-Wood", 215], ["5-Iron", 175], ["7-Iron", 150], ["9-Iron", 125], ["PW", 105]];
  const skillRows = [["Abschlag", Math.round(avg(rounds.map((r) => r.fir)))], ["Eisen", Math.round(avg(rounds.map((r) => r.gir)))], ["Kurzspiel", 68], ["Putten", Math.max(35, Math.round(100 - avg(rounds.map((r) => r.putts)) * 16))], ["Course Management", a.confidence]];

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <DashboardKpi icon="⚑" label="Handicap Index" value="54" delta="0,3" trend={trendData} sub="vs. letzte Phase" />
          <DashboardKpi icon="●" label="Durchschnitt Score" value={m.avg} delta={a.trend > 0 ? String(a.trend).replace(".", ",") : "1,6"} trend={trendData} sub="vs. letzte Phase" />
          <DashboardKpi icon="◒" label="Fairways in Regulation" value={m.fir} delta="4%" trend={trendData.map((d, i) => ({ ...d, score: 45 + ((i * 7) % 22) }))} sub="vs. letzte Phase" />
          <DashboardKpi icon="◉" label="GIR" value={m.gir} delta="6%" trend={trendData.map((d, i) => ({ ...d, score: 34 + ((i * 9) % 24) }))} sub="vs. letzte Phase" />
        </div>
        <Card>
          <div className="mb-5 flex items-center justify-between gap-4"><div className="text-lg font-bold">Score Verlauf</div><button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm">Letzte 20 Runden⌄</button></div>
          <div className="h-[330px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={trendData} margin={{ left: 4, right: 18, top: 8, bottom: 4 }}><defs><linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#166534" stopOpacity={0.18} /><stop offset="100%" stopColor="#166534" stopOpacity={0.02} /></linearGradient></defs><XAxis dataKey="round" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} /><YAxis domain={[36, 72]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} /><Tooltip contentStyle={{ borderRadius: 14, border: "1px solid #e2e8f0", fontSize: 12 }} /><Area type="monotone" dataKey="score" stroke="#166534" strokeWidth={2.5} fill="url(#scoreFill)" dot={{ r: 3, strokeWidth: 1, fill: "#fff" }} /></AreaChart></ResponsiveContainer></div>
        </Card>
        <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
          <Card>
            <div className="mb-6 flex items-center justify-between"><div className="text-lg font-bold">Stärken & Schwächen</div><span className="text-slate-400">ⓘ</span></div>
            <div className="grid gap-6 md:grid-cols-2">
              <div><div className="mb-4 text-sm font-bold text-emerald-700">Stärken</div>{[["Putt Average", m.putts, "↓ 0,2"], ["Best Score", m.best, "↓ 3"], ["Sand Save %", "56%", "↑ 7%"]].map(([label, value, delta]) => <InsightRow key={label} good label={label} value={value} delta={delta} />)}</div>
              <div><div className="mb-4 text-sm font-bold text-rose-600">Schwächen</div>{[["Schwerstes Loch", a.weakness ? `L${a.weakness.n}` : "—", `+${a.weakness?.overPar || 0}`], ["Par 4 Scoring", "4,5", "↑ 0,4"], ["Drive Accuracy", m.fir, "↓ 5%"]].map(([label, value, delta]) => <InsightRow key={label} label={label} value={value} delta={delta} />)}</div>
            </div>
          </Card>
          <Card>
            <div className="mb-5 flex items-center justify-between"><div className="text-lg font-bold">Scores pro Bereich</div><div className="text-xs font-bold text-emerald-800">● Du</div></div>
            <div className="space-y-4">{skillRows.map(([label, value]) => <BarRow key={label} label={label} value={value} />)}</div>
          </Card>
        </div>
      </div>
      <div className="space-y-6">
        <Card>
          <div className="mb-5 flex items-center justify-between"><div className="text-lg font-bold">Letzte Runde</div><button className="text-sm font-bold text-emerald-800">Details</button></div>
          <div className="text-sm font-semibold text-slate-700">{latest ? courses[latest.courseKey].name : "—"}</div><div className="mt-1 text-sm text-slate-500">{latest?.date || "—"}</div>
          <div className="mt-6 text-5xl font-bold tracking-tight">{latest?.total || "—"} <span className="text-base font-bold text-emerald-700">{latest ? `(${latest.total - latestPar >= 0 ? "+" : ""}${latest.total - latestPar})` : ""}</span></div>
          <div className="mt-6 grid grid-cols-3 divide-x divide-slate-200 border-t border-slate-200 pt-5 text-center"><SmallStat label="Fairways" value={latest?.fir ? `${latest.fir}%` : "—"} /><SmallStat label="GIR" value={latest?.gir ? `${latest.gir}%` : "—"} /><SmallStat label="Putts" value={latest?.putts || "—"} /></div>
        </Card>
        <Card><div className="mb-4 flex items-center justify-between"><div className="text-lg font-bold">Letzte Runden</div><button className="text-sm font-bold text-emerald-800">Alle anzeigen</button></div><div className="divide-y divide-slate-200">{recentRounds.map((r) => <div key={r.id} className="flex items-center justify-between gap-4 py-4"><div><div className="text-sm font-semibold text-slate-500">{r.date}</div><div className="text-sm font-bold text-slate-800">{courses[r.courseKey]?.name}</div></div><div className="text-2xl font-bold">{r.total}</div></div>)}</div></Card>
        <Card><div className="mb-5 flex items-center justify-between"><div className="text-lg font-bold">Schläger Distanzen Ø</div><button className="text-sm font-bold text-emerald-800">Details</button></div><div className="space-y-4">{distanceRows.map(([club, meters]) => <div key={club} className="grid grid-cols-[72px_1fr_48px] items-center gap-3"><div className="text-sm font-semibold text-slate-700">{club}</div><div className="h-1.5 rounded-full bg-slate-100"><div className="h-1.5 rounded-full bg-emerald-800" style={{ width: `${meters / 2.5}%` }} /></div><div className="text-right text-sm font-bold text-slate-700">{meters} m</div></div>)}</div></Card>
      </div>
    </div>
  );
}

function InsightRow({ label, value, delta, good = false }) {
  return <div className="mb-4 flex items-center gap-4"><div className={cn("flex h-10 w-10 items-center justify-center rounded-full", good ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-700")}>⌁</div><div><div className="text-sm font-medium text-slate-600">{label}</div><div className="text-xl font-bold">{value} <span className={cn("text-sm font-bold", good ? "text-emerald-700" : "text-rose-600")}>{delta}</span></div></div></div>;
}

function BarRow({ label, value }) {
  return <div><div className="mb-2 flex justify-between text-sm font-semibold text-slate-600"><span>{label}</span><span>{value}%</span></div><div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-emerald-800" style={{ width: `${Math.max(12, Math.min(100, value))}%` }} /></div></div>;
}

function SmallStat({ label, value }) {
  return <div><div className="text-sm text-slate-500">{label}</div><div className="mt-1 text-lg font-bold">{value}</div></div>;
}

const blankForm = (courseKey = "maxx") => ({ id: null, date: new Date().toISOString().slice(0, 10), courseKey, holes: Array(9).fill(""), fir: "", gir: "", putts: "", note: "" });

function RoundEntry({ rounds, setRounds }) {
  const [form, setForm] = useState(blankForm());
  const course = courses[form.courseKey];
  const total = form.holes.reduce((s, v) => s + (Number(v) || 0), 0);
  const complete = form.holes.every((v) => Number(v) > 0);
  const par = course.holes.reduce((s, h) => s + h.par, 0);
  const updateHole = (index, value) => { const next = [...form.holes]; next[index] = value === "" ? "" : Math.max(1, Math.min(20, Number(value))); setForm({ ...form, holes: next }); };
  const save = () => { if (!complete) return; const payload = { id: form.id || uid(), date: form.date, courseKey: form.courseKey, total, holes: form.holes.map(Number), fir: form.fir === "" ? null : Number(form.fir), gir: form.gir === "" ? null : Number(form.gir), putts: form.putts === "" ? null : Number(form.putts), note: form.note }; const updated = form.id ? rounds.map((r) => r.id === form.id ? payload : r) : [payload, ...rounds]; setRounds(sortRounds(updated)); persist(sortRounds(updated)); setForm(blankForm(form.courseKey)); };
  const removeRound = (id) => { const updated = rounds.filter((r) => r.id !== id); setRounds(updated); persist(updated); if (form.id === id) setForm(blankForm(form.courseKey)); };

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <Card className="p-8">
        <div className="mb-7 flex flex-wrap gap-3"><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold outline-none" /><select value={form.courseKey} onChange={(e) => setForm(blankForm(e.target.value))} className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold outline-none"><option value="maxx">GolfMaxX Tuttenhof</option><option value="doerfl">GC Tuttendörfl</option></select></div>
        <div className="grid gap-8 md:grid-cols-[1fr_180px]"><div><div className="text-sm font-semibold text-slate-600">Manuelle Scorecard</div><div className="mt-2 text-6xl font-bold tracking-tighter">{complete ? total : "—"}</div><div className="mt-2 text-sm text-slate-700">{course.name} · Par {par}{complete ? ` · ${total - par >= 0 ? "+" : ""}${total - par}` : " · 9 Löcher ausfüllen"}</div></div><div className="rounded-[1.8rem] bg-emerald-50 p-5 ring-1 ring-emerald-100"><div className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Status</div><div className="mt-3 text-4xl font-bold text-emerald-800">{form.holes.filter(Boolean).length}/9</div></div></div>
        <div className="mt-8 grid grid-cols-3 gap-3 md:grid-cols-9">{course.holes.map((h, i) => <div key={h.n} className="rounded-[1.2rem] bg-white p-3 text-center ring-1 ring-slate-200"><div className="text-xs font-bold text-slate-500">L{h.n}</div><div className="text-sm text-slate-500">P{h.par}</div><input value={form.holes[i]} onChange={(e) => updateHole(i, e.target.value)} type="number" className="mt-3 w-full rounded-xl bg-slate-50 px-2 py-3 text-center text-xl font-bold outline-none ring-1 ring-slate-200" /><div className="mt-2 flex justify-center gap-1"><button onClick={() => updateHole(i, (Number(form.holes[i]) || h.par) - 1)} className="h-7 w-7 rounded-full bg-slate-100 font-bold">−</button><button onClick={() => updateHole(i, (Number(form.holes[i]) || h.par) + 1)} className="h-7 w-7 rounded-full bg-slate-100 font-bold">+</button></div></div>)}</div>
        <div className="mt-6 grid gap-3 md:grid-cols-3"><MiniInput label="FIR %" value={form.fir} onChange={(v) => setForm({ ...form, fir: v })} /><MiniInput label="GIR %" value={form.gir} onChange={(v) => setForm({ ...form, gir: v })} /><MiniInput label="Ø Putts" value={form.putts} onChange={(v) => setForm({ ...form, putts: v })} /></div>
        <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Notiz zur Runde" className="mt-6 min-h-24 w-full rounded-[1.5rem] bg-slate-100 p-4 text-sm outline-none" />
        <div className="mt-6 flex flex-wrap gap-3"><button onClick={save} disabled={!complete} className={cn("rounded-2xl px-5 py-3 text-sm font-bold", complete ? "bg-emerald-800 text-white" : "bg-slate-100 text-slate-500")}>{form.id ? "Änderungen speichern" : "Runde speichern"}</button><button onClick={() => setForm(blankForm(form.courseKey))} className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-600">Zurücksetzen</button>{form.id && <button onClick={() => removeRound(form.id)} className="rounded-2xl bg-rose-50 px-5 py-3 text-sm font-bold text-rose-700">Löschen</button>}</div>
      </Card>
      <Card><div className="mb-5 text-lg font-bold">Letzte Runden</div><div className="space-y-3">{sortRounds(rounds).slice(0, 8).map((r) => <div key={r.id} className="rounded-[1.2rem] bg-slate-50 p-4 ring-1 ring-slate-200"><div className="flex justify-between gap-4"><div><div className="font-bold">{r.total} · {r.date}</div><div className="mt-1 text-xs font-semibold text-slate-500">{courses[r.courseKey]?.name}</div></div><button onClick={() => setForm({ ...blankForm(r.courseKey), ...r, holes: r.holes.map(String), fir: r.fir ?? "", gir: r.gir ?? "", putts: r.putts ?? "" })} className="text-sm font-bold text-emerald-800">Edit</button></div>{r.note && <div className="mt-2 text-xs text-slate-600">{r.note}</div>}</div>)}</div></Card>
    </div>
  );
}

function MiniInput({ label, value, onChange }) {
  return <label className="rounded-[1.2rem] bg-white p-4 ring-1 ring-slate-200"><div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-600">{label}</div><input value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full bg-transparent text-2xl font-bold outline-none" /></label>;
}

function Stats({ rounds }) {
  const [courseKey, setCourseKey] = useState("maxx");
  const courseRounds = sortRounds(rounds).filter((r) => r.courseKey === courseKey);
  const replay = courseRounds[0]?.holes?.map((score, i) => ({ hole: `L${i + 1}`, score, par: courses[courseKey].holes[i].par })) || [];
  return <div className="space-y-6"><Card><div className="mb-5 flex flex-wrap items-center justify-between gap-4"><div><div className="text-lg font-bold">Performance Heatmap</div><div className="mt-1 text-sm font-medium text-slate-500">Kursanalyse im Dashboard-Look.</div></div><div className="flex rounded-2xl bg-slate-100 p-1">{Object.entries(courses).map(([key, course]) => <button key={key} onClick={() => setCourseKey(key)} className={cn("rounded-xl px-4 py-2 text-xs font-bold", courseKey === key ? "bg-white text-slate-950 shadow-sm" : "text-slate-500")}>{course.name}</button>)}</div></div><div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-9">{courses[courseKey].holes.map((h, i) => { const scores = courseRounds.map((r) => r.holes[i]); const v = avg(scores); return <div key={h.n} className="rounded-[1.2rem] bg-white p-4 ring-1 ring-slate-200"><div className="text-sm font-bold text-slate-500">Loch</div><div className="mt-1 text-4xl font-bold">{h.n}</div><div className="mt-3 text-sm font-semibold text-slate-600">Ø {v.toFixed(1)}</div><div className="mt-1 text-xs text-slate-500">{h.focus}</div></div>; })}</div></Card><Card><div className="mb-5 text-lg font-bold">Round Replay</div><div className="h-80"><ResponsiveContainer width="100%" height="100%"><LineChart data={replay}><XAxis dataKey="hole" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><Tooltip /><Line type="monotone" dataKey="score" stroke="#166534" strokeWidth={3} /></LineChart></ResponsiveContainer></div></Card></div>;
}

function LiveRound({ rounds }) {
  const a = analysis(rounds);
  const [hole, setHole] = useState(1);
  const [score, setScore] = useState(4);
  const currentCourse = courses.maxx;
  const current = currentCourse.holes[hole - 1];
  const courseRounds = sortRounds(rounds).filter((r) => r.courseKey === "maxx");
  const holeTrend = courseRounds.slice().reverse().map((r, i) => ({
    round: i + 1,
    score: Number(r.holes?.[hole - 1]) || null,
    date: r.date,
  }));
  const holeAvg = avg(courseRounds.map((r) => Number(r.holes?.[hole - 1]))).toFixed(1);

  const nextHole = () => {
    if (hole < 9) {
      const next = hole + 1;
      setHole(next);
      setScore(currentCourse.holes[next - 1].par);
    }
  };

  const prevHole = () => {
    if (hole > 1) {
      const prev = hole - 1;
      setHole(prev);
      setScore(currentCourse.holes[prev - 1].par);
    }
  };

  const speak = (text) => {
    if (window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
      <Card className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-black to-slate-900 p-8 text-white ring-1 ring-emerald-500/20">
        <div className="absolute right-[-120px] top-[-120px] h-[300px] w-[300px] rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">
                Live Round Intelligence
              </div>
              <div className="mt-5 text-8xl font-bold tracking-tighter">
                {hole}
              </div>
              <div className="mt-2 text-lg font-semibold text-emerald-100">
                Loch {current.n} • Par {current.par} • HCP {current.hcp}
              </div>
            </div>

            <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-5 py-3 text-sm font-bold text-emerald-200">
              AI ACTIVE
            </div>
          </div>

          <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
              AI Caddie Briefing
            </div>

            <p className="mt-5 text-2xl font-semibold leading-10 text-white">
              {current.focus}. Kein Risiko. Kontrolle vor Länge. Ziel: ruhiges Bogey Management.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4">
            {[current.par - 1, current.par, current.par + 1].map((v, i) => (
              <button
                key={v}
                onClick={() => {
                  setScore(v);
                  speak(`Score ${v} gespeichert`);
                }}
                className={`rounded-[2rem] border px-4 py-8 text-center transition-all duration-300 ${score === v ? 'border-emerald-400 bg-emerald-500 text-black shadow-[0_0_40px_rgba(16,185,129,0.35)]' : 'border-white/10 bg-white/5 text-white hover:bg-white/10'}`}
              >
                <div className="text-sm font-bold uppercase tracking-[0.16em] opacity-70">
                  {i === 0 ? 'Birdie/Besser' : i === 1 ? 'Par' : 'Bogey'}
                </div>
                <div className="mt-3 text-6xl font-bold tracking-tighter">
                  {v}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={prevHole}
              className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-bold text-white transition hover:bg-white/10"
            >
              ← Vorheriges Loch
            </button>

            <button
              onClick={nextHole}
              className="flex-1 rounded-2xl bg-emerald-500 px-5 py-4 text-sm font-bold text-black shadow-[0_10px_40px_rgba(16,185,129,0.25)] transition hover:scale-[1.02]"
            >
              Nächstes Loch →
            </button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-lg font-bold">Loch {hole} Verlauf</div>
            <div className="mt-1 text-sm font-semibold text-slate-500">Ø {holeAvg} · historische Scores</div>
          </div>
          <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800">Par {current.par}</div>
        </div>

        <div className="mt-5 h-56 rounded-[1.5rem] bg-gradient-to-b from-emerald-50/70 to-white p-4 ring-1 ring-emerald-100">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={holeTrend}>
              <defs>
                <linearGradient id={`liveHoleFill-${hole}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#166534" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#166534" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis dataKey="round" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip contentStyle={{ borderRadius: 14, border: "1px solid #e2e8f0", fontSize: 12 }} />
              <Area type="monotone" dataKey="score" stroke="#166534" strokeWidth={2.5} fill={`url(#liveHoleFill-${hole})`} dot={{ r: 3, strokeWidth: 1, fill: "#fff" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-8 text-lg font-bold">Live Empfehlungen</div>

        <div className="mt-6 space-y-4">
          {[
            'Driver nur 80% schwingen',
            'Mitte Grün statt Fahne attackieren',
            'Kein Hero Shot nach Fehlern',
            'Putting Tempo kontrollieren',
            `Schwerstes Loch aktuell: ${a.weakness?.n || 6}`,
          ].map((tip) => (
            <div
              key={tip}
              className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                <div className="text-sm font-bold text-slate-700">
                  {tip}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[2rem] bg-gradient-to-br from-emerald-50 to-white p-6 ring-1 ring-emerald-100">
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
            Round Projection
          </div>

          <div className="mt-4 text-5xl font-bold tracking-tight text-emerald-900">
            {a.predictedNext || 48}
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Wenn du Loch {a.weakness?.n || 6} kontrollierst und keine Eskalation zulässt, ist deine beste Runde näher als du denkst.
          </p>
        </div>
      </Card>
    </div>
  );
}

function DarkStat({ label, value }) {
  return <div className="rounded-[1.6rem] bg-black/40 p-5 ring-1 ring-emerald-400/10"><div className="text-xs uppercase tracking-[0.18em] text-emerald-200">{label}</div><div className="mt-3 text-2xl font-bold">{value}</div></div>;
}

function CoachScreen({ rounds }) {
  const [messages, setMessages] = useState([{ role: "coach", text: "System online. Frag mich: Was ist mein größter Hebel?" }]);
  const [input, setInput] = useState("");
  const [voiceStatus, setVoiceStatus] = useState("Bereit");
  const a = analysis(rounds);

  const speak = (text) => {
    if (!window.speechSynthesis) {
      setVoiceStatus("Sprachausgabe wird von diesem Browser nicht unterstützt.");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "de-DE";
    utterance.rate = 0.92;
    utterance.pitch = 0.85;
    utterance.onstart = () => setVoiceStatus("JARVIS spricht…");
    utterance.onend = () => setVoiceStatus("Bereit");
    utterance.onerror = () => setVoiceStatus("Fehler bei der Sprachausgabe.");
    window.speechSynthesis.speak(utterance);
  };

  const answer = (q) =>
    q.toLowerCase().includes("hebel")
      ? `Dein größter Hebel ist Loch ${a.weakness?.n || 6}: ${a.weakness?.focus || "Ball im Spiel halten"}.`
      : `Prognose nächste gute Runde: ${a.predictedNext || "—"}. Fokus: Kontrolle statt Risiko.`;

  const ask = (text) => {
    if (!text.trim()) return;
    const res = answer(text);
    setMessages((m) => [...m, { role: "you", text }, { role: "coach", text: res }]);
    setInput("");
    speak(res);
  };

  const listen = () => {
    const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!Rec) {
      const msg = "Dein Browser unterstützt Mikrofon-Spracherkennung nicht. Bitte Chrome oder Edge verwenden. Sprachausgabe teste ich jetzt trotzdem.";
      setVoiceStatus(msg);
      speak(msg);
      return;
    }

    const rec = new Rec();
    rec.lang = "de-DE";
    rec.interimResults = false;
    rec.continuous = false;

    rec.onstart = () => setVoiceStatus("Ich höre zu… jetzt sprechen.");
    rec.onspeechstart = () => setVoiceStatus("Sprache erkannt…");
    rec.onspeechend = () => setVoiceStatus("Verarbeite…");
    rec.onresult = (e) => {
      const transcript = e.results?.[0]?.[0]?.transcript || "";
      setVoiceStatus(`Erkannt: ${transcript}`);
      ask(transcript);
    };
    rec.onerror = (e) => {
      const errorText = e?.error || "unbekannter Fehler";
      setVoiceStatus(`Mikrofon-Fehler: ${errorText}`);
      speak(`Mikrofon Fehler: ${errorText}`);
    };
    rec.onend = () => {
      setTimeout(() => setVoiceStatus((old) => old.includes("Erkannt") ? old : "Bereit"), 800);
    };

    try {
      rec.start();
    } catch {
      setVoiceStatus("Voice konnte nicht gestartet werden. Seite neu laden und nochmal klicken.");
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
      <Card className="bg-gradient-to-br from-slate-950 via-slate-900 to-black p-8 text-white">
        <div className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">Caddie Intelligence</div>
        <div className="mt-7 text-6xl font-bold">{a.predictedNext || "—"}</div>
        <div className="mt-2 text-sm text-emerald-100">Projected next good round</div>

        <div className="mt-8 rounded-[2rem] bg-black/40 p-5 ring-1 ring-emerald-400/20">
          <div className="text-xs font-bold uppercase text-emerald-300">Mission</div>
          <div className="mt-3 text-3xl font-bold">Loch {a.weakness?.n || 6} neutralisieren</div>
          <p className="mt-4 text-base leading-7 text-white">Ball im Spiel. Kein Helden-Schlag. Score-Management.</p>
        </div>

        <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm font-bold text-emerald-100">
          Voice Status: {voiceStatus}
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <button onClick={listen} className="rounded-2xl bg-emerald-600 px-5 py-4 text-sm font-bold text-white">
            Voice Command
          </button>
          <button onClick={() => speak("JARVIS online. GolfTrack Unicorn ist bereit.")} className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-sm font-bold text-white">
            Stimme testen
          </button>
        </div>
      </Card>

      <Card>
        <div className="mb-5 text-lg font-bold">GolfTrack Command Deck</div>
        <div className="mb-4 grid gap-2 md:grid-cols-3">
          {["Was ist mein größter Hebel?", "Wie spiele ich Loch 6?", "Was ist mein Fokus?"].map((cmd) => (
            <button key={cmd} onClick={() => ask(cmd)} className="rounded-xl bg-emerald-50 px-3 py-3 text-xs font-bold text-emerald-800 ring-1 ring-emerald-100">
              {cmd}
            </button>
          ))}
        </div>
        <div className="space-y-3 rounded-[1.5rem] bg-slate-50 p-4 ring-1 ring-slate-200">
          {messages.map((m, i) => (
            <div key={i} className={cn("max-w-[88%] rounded-[1.2rem] px-4 py-3 text-sm leading-6", m.role === "you" ? "ml-auto bg-emerald-800 text-white" : "bg-white text-slate-700 shadow-sm")}>
              {m.text}
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ask(input)} className="min-w-0 flex-1 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold outline-none" placeholder="Command eingeben…" />
          <button onClick={() => ask(input)} className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">Senden</button>
        </div>
      </Card>
    </div>
  );
}

function Plan({ rounds }) {
  const a = analysis(rounds);
  const items = [["Woche 1", `Loch ${a.weakness?.n || 6} entgiften`, "max. Bogey"], ["Woche 2", "Putting Tempo", "max. 2 Drei-Putts"], ["Woche 3", "Abschläge stabilisieren", "Ball im Spiel"], ["Woche 4", "Turniermodus", `Zielrunde ${a.predictedNext || "unter 50"}`]];
  return <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">{items.map(([week, title, goal]) => <Card key={week}><div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{week}</div><div className="mt-4 text-2xl font-bold">{title}</div><div className="mt-3 text-sm font-bold text-emerald-800">{goal}</div><p className="mt-3 text-sm leading-6 text-slate-600">Klarer Fokus statt Feature-Friedhof.</p></Card>)}</div>;
}

function Tools({ rounds, setRounds }) {
  const json = JSON.stringify(rounds, null, 2);
  return <div className="grid gap-6 md:grid-cols-3"><Card><div className="text-2xl font-bold">JSON Export</div><p className="mt-3 text-sm leading-6 text-slate-600">Kopiert deine Rundendaten.</p><button onClick={() => navigator.clipboard?.writeText(json)} className="mt-6 rounded-2xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white">Export kopieren</button></Card><Card><div className="text-2xl font-bold">Demo Reset</div><p className="mt-3 text-sm leading-6 text-slate-600">Setzt die App zurück.</p><button onClick={() => { setRounds(demoRounds); persist(demoRounds); }} className="mt-6 rounded-2xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700">Zurücksetzen</button></Card><Card><div className="text-2xl font-bold">Vision Ready</div><p className="mt-3 text-sm leading-6 text-slate-600">OCR kann später über Backend angebunden werden.</p></Card></div>;
}

export default function GolfTrackUnicorn() {
  const [tab, setTab] = useState("home");
  const [rounds, setRounds] = useState(loadRounds);
  const screen = { home: <Home rounds={rounds} />, round: <RoundEntry rounds={rounds} setRounds={setRounds} />, stats: <Stats rounds={rounds} />, live: <LiveRound rounds={rounds} />, coach: <CoachScreen rounds={rounds} />, plan: <Plan rounds={rounds} />, tools: <Tools rounds={rounds} setRounds={setRounds} /> }[tab];
  return <Shell tab={tab} setTab={setTab}>{screen}</Shell>;
}
