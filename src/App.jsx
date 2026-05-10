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
  { id: "r1", date: "2026-04-06", courseKey: "maxx", total: 66, holes: [8, 7, 7, 8, 6, 9, 7, 8, 6], fir: 30, gir: 18, putts: 3.4, note: "Erste dokumentierte Runde", costs: { greenfee: 29, range: 8, food: 12, tournament: 0, other: 0 }, mental: { focus: 4, energy: 5, frustration: 7, confidence: 3, management: 4 }, courseRating: { overall: 7, greens: 6, fairways: 7, atmosphere: 7, playAgain: true } },
  { id: "r2", date: "2026-04-11", courseKey: "maxx", total: 56, holes: [6, 5, 6, 7, 5, 8, 6, 7, 6], fir: 55, gir: 28, putts: 3.0, note: "Beste frühe Runde", costs: { greenfee: 29, range: 6, food: 10, tournament: 0, other: 0 }, mental: { focus: 7, energy: 7, frustration: 3, confidence: 6, management: 7 }, courseRating: { overall: 7, greens: 7, fairways: 7, atmosphere: 8, playAgain: true } },
  { id: "r3", date: "2026-04-12", courseKey: "maxx", total: 67, holes: [8, 7, 8, 8, 7, 9, 6, 8, 6], fir: 35, gir: 20, putts: 3.6, note: "Putting schwach", costs: { greenfee: 29, range: 10, food: 8, tournament: 0, other: 6 }, mental: { focus: 3, energy: 5, frustration: 8, confidence: 3, management: 3 }, courseRating: { overall: 6, greens: 5, fairways: 7, atmosphere: 6, playAgain: true } },
  { id: "r4", date: "2026-04-17", courseKey: "maxx", total: 58, holes: [6, 6, 6, 7, 6, 8, 6, 7, 6], fir: 50, gir: 31, putts: 3.1, note: "Ruhiger gespielt", costs: { greenfee: 29, range: 7, food: 12, tournament: 0, other: 0 }, mental: { focus: 6, energy: 6, frustration: 4, confidence: 5, management: 6 }, courseRating: { overall: 7, greens: 7, fairways: 7, atmosphere: 7, playAgain: true } },
  { id: "r5", date: "2026-04-18", courseKey: "maxx", total: 61, holes: [7, 6, 7, 7, 6, 9, 6, 7, 6], fir: 46, gir: 24, putts: 3.3, note: "Loch 6 teuer", costs: { greenfee: 29, range: 8, food: 9, tournament: 0, other: 4 }, mental: { focus: 5, energy: 5, frustration: 7, confidence: 4, management: 4 }, courseRating: { overall: 6, greens: 6, fairways: 7, atmosphere: 6, playAgain: true } },
  { id: "r6", date: "2026-04-25", courseKey: "maxx", total: 54, holes: [6, 5, 6, 6, 5, 8, 6, 6, 6], fir: 62, gir: 35, putts: 2.9, note: "Kontrollierter", costs: { greenfee: 29, range: 8, food: 11, tournament: 0, other: 0 }, mental: { focus: 7, energy: 7, frustration: 3, confidence: 6, management: 7 }, courseRating: { overall: 8, greens: 7, fairways: 8, atmosphere: 8, playAgain: true } },
  { id: "r7", date: "2026-04-26", courseKey: "maxx", total: 52, holes: [5, 5, 6, 6, 5, 8, 5, 6, 6], fir: 64, gir: 38, putts: 2.8, note: "Stabiler Abschlag", costs: { greenfee: 29, range: 5, food: 13, tournament: 0, other: 0 }, mental: { focus: 8, energy: 8, frustration: 2, confidence: 7, management: 8 }, courseRating: { overall: 8, greens: 8, fairways: 8, atmosphere: 8, playAgain: true } },
  { id: "r8", date: "2026-05-01", courseKey: "doerfl", total: 49, holes: [5, 4, 6, 6, 4, 6, 6, 5, 7], fir: 67, gir: 42, putts: 2.7, note: "Guter Fokus", costs: { greenfee: 45, range: 8, food: 14, tournament: 0, other: 0 }, mental: { focus: 8, energy: 8, frustration: 2, confidence: 8, management: 8 }, courseRating: { overall: 9, greens: 8, fairways: 8, atmosphere: 9, playAgain: true } },
  { id: "r9", date: "2026-05-03", courseKey: "doerfl", total: 51, holes: [6, 4, 6, 6, 5, 6, 6, 5, 7], fir: 59, gir: 40, putts: 2.9, note: "Kurzspiel besser", costs: { greenfee: 45, range: 10, food: 16, tournament: 0, other: 0 }, mental: { focus: 7, energy: 7, frustration: 3, confidence: 7, management: 7 }, courseRating: { overall: 8, greens: 8, fairways: 7, atmosphere: 8, playAgain: true } },
  { id: "r10", date: "2026-05-04", courseKey: "doerfl", total: 47, holes: [5, 4, 5, 5, 4, 6, 5, 5, 8], fir: 72, gir: 48, putts: 2.6, note: "Bestwert", costs: { greenfee: 45, range: 8, food: 18, tournament: 0, other: 0 }, mental: { focus: 9, energy: 8, frustration: 1, confidence: 9, management: 9 }, courseRating: { overall: 9, greens: 9, fairways: 8, atmosphere: 9, playAgain: true } },
];

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

function uid() { return `r-${Date.now()}-${Math.random().toString(16).slice(2)}`; }
function cn(...classes) { return classes.filter(Boolean).join(" "); }
function avg(values) {
  const nums = values.map(Number).filter(Number.isFinite);
  return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
}
function sortRounds(rounds) { return [...rounds].sort((a, b) => new Date(b.date) - new Date(a.date)); }
function loadRounds() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : demoRounds;
  } catch { return demoRounds; }
}
function persist(rounds) { localStorage.setItem(STORAGE_KEY, JSON.stringify(rounds)); }
function parOf(courseKey) { return courses[courseKey].holes.reduce((s, h) => s + h.par, 0); }

function metrics(rounds) {
  const totals = rounds.map((r) => Number(r.total)).filter(Number.isFinite);
  return {
    rounds: rounds.length,
    avg: totals.length ? Math.round(avg(totals)) : "—",
    best: totals.length ? Math.min(...totals) : "—",
    fir: `${Math.round(avg(rounds.map((r) => r.fir)))}%`,
    gir: `${Math.round(avg(rounds.map((r) => r.gir)))}%`,
    putts: avg(rounds.map((r) => r.putts)).toFixed(1),
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

function financeMetrics(rounds) {
  const costOf = (r) => {
    const c = r.costs || {};
    return ["greenfee", "range", "food", "tournament", "other"].reduce((sum, key) => sum + (Number(c[key]) || 0), 0);
  };
  const totals = rounds.map(costOf);
  const total = totals.reduce((a, b) => a + b, 0);
  const byCategory = {
    greenfee: rounds.reduce((s, r) => s + (Number(r.costs?.greenfee) || 0), 0),
    range: rounds.reduce((s, r) => s + (Number(r.costs?.range) || 0), 0),
    food: rounds.reduce((s, r) => s + (Number(r.costs?.food) || 0), 0),
    tournament: rounds.reduce((s, r) => s + (Number(r.costs?.tournament) || 0), 0),
    other: rounds.reduce((s, r) => s + (Number(r.costs?.other) || 0), 0),
  };
  const mostExpensive = [...rounds].sort((a, b) => costOf(b) - costOf(a))[0];
  return { total, avgCost: totals.length ? total / totals.length : 0, byCategory, mostExpensive, costOf };
}

function mentalMetrics(rounds) {
  const mAvg = (key) => avg(rounds.map((r) => Number(r.mental?.[key])));
  const cAvg = (key) => avg(rounds.map((r) => Number(r.courseRating?.[key])));
  return {
    focus: mAvg("focus"),
    energy: mAvg("energy"),
    frustration: mAvg("frustration"),
    confidence: mAvg("confidence"),
    management: mAvg("management"),
    mentalScore: avg([mAvg("focus"), mAvg("energy"), mAvg("confidence"), mAvg("management"), 10 - mAvg("frustration")]),
    courseScore: avg([cAvg("overall"), cAvg("greens"), cAvg("fairways"), cAvg("atmosphere")]),
    greens: cAvg("greens"),
    fairways: cAvg("fairways"),
    atmosphere: cAvg("atmosphere"),
    playAgainRate: rounds.length ? Math.round((rounds.filter((r) => r.courseRating?.playAgain).length / rounds.length) * 100) : 0,
  };
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
        <div className="mt-auto rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">System Status</div>
          <div className="mt-2 flex items-center gap-2"><div className="h-2.5 w-2.5 rounded-full bg-emerald-500" /><div className="text-sm font-bold text-slate-800">UNICORN AI ONLINE</div></div>
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
  return <div className="mt-5 h-12"><ResponsiveContainer width="100%" height="100%"><LineChart data={data}><Line type="monotone" dataKey="score" stroke="#166534" strokeWidth={2} dot={{ r: 2, strokeWidth: 0, fill: "#166534" }} /></LineChart></ResponsiveContainer></div>;
}

function DashboardKpi({ icon, label, value, delta, trend, sub }) {
  return (
    <Card className="min-h-[190px] p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-lg text-emerald-800">{icon}</div><div className="text-sm font-bold text-slate-700">{label}</div></div>
        <span className="text-sm text-slate-400">ⓘ</span>
      </div>
      <div className="mt-7 flex items-end gap-3"><div className="text-4xl font-bold tracking-tight">{value}</div>{delta && <div className="mb-1 text-sm font-bold text-emerald-700">{delta}</div>}</div>
      <TinyTrend data={trend || []} />
      {sub && <div className="mt-3 text-sm font-medium text-slate-500">{sub}</div>}
    </Card>
  );
}

function SmallStat({ label, value }) {
  return <div><div className="text-sm text-slate-500">{label}</div><div className="mt-1 text-lg font-bold">{value}</div></div>;
}

function InsightRow({ label, value, delta, good = false }) {
  return <div className="mb-4 flex items-center gap-4"><div className={cn("flex h-10 w-10 items-center justify-center rounded-full", good ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-700")}>⌁</div><div><div className="text-sm font-medium text-slate-600">{label}</div><div className="text-xl font-bold">{value} <span className={cn("text-sm font-bold", good ? "text-emerald-700" : "text-rose-600")}>{delta}</span></div></div></div>;
}

function BarRow({ label, value }) {
  return <div><div className="mb-2 flex justify-between text-sm font-semibold text-slate-600"><span>{label}</span><span>{value}%</span></div><div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-emerald-800" style={{ width: `${Math.max(12, Math.min(100, value))}%` }} /></div></div>;
}

function Home({ rounds }) {
  const m = metrics(rounds);
  const a = analysis(rounds);
  const trendData = a.sorted.slice().reverse().map((r, i) => ({ round: i + 1, score: r.total, date: r.date }));
  const latest = a.latest;
  const recentRounds = a.sorted.slice(0, 5);
  const latestPar = latest ? parOf(latest.courseKey) : 0;
  const distanceRows = [["Driver", 238], ["3-Wood", 215], ["5-Iron", 175], ["7-Iron", 150], ["9-Iron", 125], ["PW", 105]];
  const skillRows = [["Abschlag", Math.round(avg(rounds.map((r) => r.fir)))], ["Eisen", Math.round(avg(rounds.map((r) => r.gir)))], ["Kurzspiel", 68], ["Putten", Math.max(35, Math.round(100 - avg(rounds.map((r) => r.putts)) * 16))], ["Course Management", a.confidence]];

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <DashboardKpi icon="⚑" label="Handicap Index" value="54" delta="↓ 0,3" trend={trendData} sub="vs. letzte Phase" />
          <DashboardKpi icon="●" label="Durchschnitt Score" value={m.avg} delta={a.trend > 0 ? `↓ ${a.trend}` : "↓ 1,6"} trend={trendData} sub="vs. letzte Phase" />
          <DashboardKpi icon="◒" label="Fairways in Regulation" value={m.fir} delta="↑ 4%" trend={trendData.map((d, i) => ({ ...d, score: 45 + ((i * 7) % 22) }))} sub="vs. letzte Phase" />
          <DashboardKpi icon="◉" label="GIR" value={m.gir} delta="↑ 6%" trend={trendData.map((d, i) => ({ ...d, score: 34 + ((i * 9) % 24) }))} sub="vs. letzte Phase" />
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
  mental: { focus: "", energy: "", frustration: "", confidence: "", management: "" },
  courseRating: { overall: "", greens: "", fairways: "", atmosphere: "", playAgain: true },
});

function MiniInput({ label, value, onChange }) {
  return <label className="rounded-[1.2rem] bg-white p-4 ring-1 ring-slate-200"><div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-600">{label}</div><input value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full bg-transparent text-2xl font-bold outline-none" /></label>;
}

function RatingPanel({ title, subtitle, values, fields, onChange, children }) {
  return (
    <div className="rounded-[1.5rem] bg-slate-50 p-5 ring-1 ring-slate-200">
      <div className="mb-4"><div className="text-lg font-bold">{title}</div><div className="mt-1 text-sm font-semibold text-slate-500">{subtitle}</div></div>
      <div className="space-y-4">
        {fields.map(([key, label]) => (
          <div key={key}>
            <div className="mb-2 flex justify-between text-sm font-bold text-slate-700"><span>{label}</span><span>{values?.[key] || "—"}/10</span></div>
            <input type="range" min="1" max="10" value={values?.[key] || 5} onChange={(e) => onChange(key, e.target.value)} className="w-full accent-emerald-800" />
          </div>
        ))}
      </div>
      {children}
    </div>
  );
}

function RoundEntry({ rounds, setRounds }) {
  const [form, setForm] = useState(blankForm());
  const course = courses[form.courseKey];
  const total = form.holes.reduce((s, v) => s + (Number(v) || 0), 0);
  const complete = form.holes.every((v) => Number(v) > 0);
  const par = course.holes.reduce((s, h) => s + h.par, 0);

  const updateHole = (index, value) => {
    const next = [...form.holes];
    next[index] = value === "" ? "" : Math.max(1, Math.min(20, Number(value)));
    setForm({ ...form, holes: next });
  };

  const save = () => {
    if (!complete) return;
    const payload = {
      id: form.id || uid(),
      date: form.date,
      courseKey: form.courseKey,
      total,
      holes: form.holes.map(Number),
      fir: form.fir === "" ? null : Number(form.fir),
      gir: form.gir === "" ? null : Number(form.gir),
      putts: form.putts === "" ? null : Number(form.putts),
      note: form.note,
      costs: Object.fromEntries(Object.entries(form.costs || {}).map(([key, value]) => [key, value === "" ? 0 : Number(value)])),
      mental: Object.fromEntries(Object.entries(form.mental || {}).map(([key, value]) => [key, value === "" ? 0 : Number(value)])),
      courseRating: {
        ...Object.fromEntries(Object.entries(form.courseRating || {}).filter(([key]) => key !== "playAgain").map(([key, value]) => [key, value === "" ? 0 : Number(value)])),
        playAgain: Boolean(form.courseRating?.playAgain),
      },
    };
    const updated = form.id ? rounds.map((r) => r.id === form.id ? payload : r) : [payload, ...rounds];
    const sorted = sortRounds(updated);
    setRounds(sorted);
    persist(sorted);
    setForm(blankForm(form.courseKey));
  };

  const removeRound = (id) => {
    const updated = rounds.filter((r) => r.id !== id);
    setRounds(updated);
    persist(updated);
    if (form.id === id) setForm(blankForm(form.courseKey));
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <Card className="p-8">
        <div className="mb-7 flex flex-wrap gap-3">
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold outline-none" />
          <select value={form.courseKey} onChange={(e) => setForm(blankForm(e.target.value))} className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold outline-none"><option value="maxx">GolfMaxX Tuttenhof</option><option value="doerfl">GC Tuttendörfl</option></select>
        </div>

        <div className="grid gap-8 md:grid-cols-[1fr_180px]">
          <div><div className="text-sm font-semibold text-slate-600">Manuelle Scorecard</div><div className="mt-2 text-6xl font-bold tracking-tighter">{complete ? total : "—"}</div><div className="mt-2 text-sm text-slate-700">{course.name} · Par {par}{complete ? ` · ${total - par >= 0 ? "+" : ""}${total - par}` : " · 9 Löcher ausfüllen"}</div></div>
          <div className="rounded-[1.8rem] bg-emerald-50 p-5 ring-1 ring-emerald-100"><div className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Status</div><div className="mt-3 text-4xl font-bold text-emerald-800">{form.holes.filter(Boolean).length}/9</div></div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3 md:grid-cols-9">
          {course.holes.map((h, i) => (
            <div key={h.n} className="rounded-[1.2rem] bg-white p-3 text-center ring-1 ring-slate-200">
              <div className="text-xs font-bold text-slate-500">L{h.n}</div>
              <div className="text-sm text-slate-500">P{h.par}</div>
              <input value={form.holes[i]} onChange={(e) => updateHole(i, e.target.value)} type="number" className="mt-3 w-full rounded-xl bg-slate-50 px-2 py-3 text-center text-xl font-bold outline-none ring-1 ring-slate-200" />
              <div className="mt-2 flex justify-center gap-1">
                <button onClick={() => updateHole(i, (Number(form.holes[i]) || h.par) - 1)} className="h-7 w-7 rounded-full bg-slate-100 font-bold">−</button>
                <button onClick={() => updateHole(i, (Number(form.holes[i]) || h.par) + 1)} className="h-7 w-7 rounded-full bg-slate-100 font-bold">+</button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3"><MiniInput label="FIR %" value={form.fir} onChange={(v) => setForm({ ...form, fir: v })} /><MiniInput label="GIR %" value={form.gir} onChange={(v) => setForm({ ...form, gir: v })} /><MiniInput label="Ø Putts" value={form.putts} onChange={(v) => setForm({ ...form, putts: v })} /></div>

        <div className="mt-6 rounded-[1.5rem] bg-slate-50 p-5 ring-1 ring-slate-200">
          <div className="mb-4 flex items-center justify-between"><div><div className="text-lg font-bold">Kosten dieser Runde</div><div className="mt-1 text-sm font-semibold text-slate-500">Greenfee, Range, Essen und Extras erfassen.</div></div><div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800">{Object.values(form.costs || {}).reduce((s, v) => s + (Number(v) || 0), 0)}€</div></div>
          <div className="grid gap-3 md:grid-cols-5">
            <MiniInput label="Greenfee €" value={form.costs?.greenfee || ""} onChange={(v) => setForm({ ...form, costs: { ...form.costs, greenfee: v } })} />
            <MiniInput label="Range €" value={form.costs?.range || ""} onChange={(v) => setForm({ ...form, costs: { ...form.costs, range: v } })} />
            <MiniInput label="Essen €" value={form.costs?.food || ""} onChange={(v) => setForm({ ...form, costs: { ...form.costs, food: v } })} />
            <MiniInput label="Turnier €" value={form.costs?.tournament || ""} onChange={(v) => setForm({ ...form, costs: { ...form.costs, tournament: v } })} />
            <MiniInput label="Sonstiges €" value={form.costs?.other || ""} onChange={(v) => setForm({ ...form, costs: { ...form.costs, other: v } })} />
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <RatingPanel title="Mental Check" subtitle="Wie war dein Kopf heute?" values={form.mental} fields={[["focus", "Fokus"], ["energy", "Energie"], ["frustration", "Frust"], ["confidence", "Selbstvertrauen"], ["management", "Course Mgmt"]]} onChange={(key, value) => setForm({ ...form, mental: { ...form.mental, [key]: value } })} />
          <RatingPanel title="Platz-Ranking" subtitle="Wie gut war der Golfplatz?" values={form.courseRating} fields={[["overall", "Gesamt"], ["greens", "Greens"], ["fairways", "Fairways"], ["atmosphere", "Atmosphäre"]]} onChange={(key, value) => setForm({ ...form, courseRating: { ...form.courseRating, [key]: value } })}>
            <button type="button" onClick={() => setForm({ ...form, courseRating: { ...form.courseRating, playAgain: !form.courseRating?.playAgain } })} className={cn("mt-4 rounded-2xl px-5 py-3 text-sm font-bold", form.courseRating?.playAgain ? "bg-emerald-800 text-white" : "bg-slate-100 text-slate-600")}>{form.courseRating?.playAgain ? "Würde ich wieder spielen" : "Eher nicht wieder"}</button>
          </RatingPanel>
        </div>

        <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Notiz zur Runde" className="mt-6 min-h-24 w-full rounded-[1.5rem] bg-slate-100 p-4 text-sm outline-none" />
        <div className="mt-6 flex flex-wrap gap-3"><button onClick={save} disabled={!complete} className={cn("rounded-2xl px-5 py-3 text-sm font-bold", complete ? "bg-emerald-800 text-white" : "bg-slate-100 text-slate-500")}>{form.id ? "Änderungen speichern" : "Runde speichern"}</button><button onClick={() => setForm(blankForm(form.courseKey))} className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-600">Zurücksetzen</button>{form.id && <button onClick={() => removeRound(form.id)} className="rounded-2xl bg-rose-50 px-5 py-3 text-sm font-bold text-rose-700">Löschen</button>}</div>
      </Card>

      <Card>
        <div className="mb-5 text-lg font-bold">Letzte Runden</div>
        <div className="space-y-3">
          {sortRounds(rounds).slice(0, 8).map((r) => (
            <div key={r.id} className="rounded-[1.2rem] bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="flex justify-between gap-4"><div><div className="font-bold">{r.total} · {r.date}</div><div className="mt-1 text-xs font-semibold text-slate-500">{courses[r.courseKey]?.name}</div></div><button onClick={() => setForm({ ...blankForm(r.courseKey), ...r, holes: r.holes.map(String), fir: r.fir ?? "", gir: r.gir ?? "", putts: r.putts ?? "", costs: { ...blankForm(r.courseKey).costs, ...(r.costs || {}) }, mental: { ...blankForm(r.courseKey).mental, ...(r.mental || {}) }, courseRating: { ...blankForm(r.courseKey).courseRating, ...(r.courseRating || {}) } })} className="text-sm font-bold text-emerald-800">Edit</button></div>
              {r.note && <div className="mt-2 text-xs text-slate-600">{r.note}</div>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Stats({ rounds }) {
  const [courseKey, setCourseKey] = useState("maxx");
  const [selectedHole, setSelectedHole] = useState(1);
  const courseRounds = sortRounds(rounds).filter((r) => r.courseKey === courseKey);
  const course = courses[courseKey];
  const selectedHoleData = course.holes[selectedHole - 1];

  const holeTrend = courseRounds.slice().reverse().map((r, i) => ({
    round: i + 1,
    score: Number(r.holes?.[selectedHole - 1]) || null,
    date: r.date,
  }));
  const holeAvg = avg(courseRounds.map((r) => Number(r.holes?.[selectedHole - 1]))).toFixed(1);
  const replay = courseRounds[0]?.holes?.map((score, i) => ({ hole: `L${i + 1}`, score, par: course.holes[i].par })) || [];

  return (
    <div className="space-y-6">
      <Card>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div><div className="text-lg font-bold">Performance Heatmap</div><div className="mt-1 text-sm font-medium text-slate-500">Klicke auf ein Loch, um den historischen Verlauf zu sehen.</div></div>
          <div className="flex rounded-2xl bg-slate-100 p-1">
            {Object.entries(courses).map(([key, c]) => (
              <button key={key} onClick={() => { setCourseKey(key); setSelectedHole(1); }} className={cn("rounded-xl px-4 py-2 text-xs font-bold", courseKey === key ? "bg-white text-slate-950 shadow-sm" : "text-slate-500")}>{c.name}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-9">
          {course.holes.map((h, i) => {
            const scores = courseRounds.map((r) => Number(r.holes?.[i])).filter(Number.isFinite);
            const v = avg(scores);
            const miniTrend = courseRounds.slice().reverse().map((r, index) => ({ round: index + 1, score: Number(r.holes?.[i]) || null }));
            return (
              <button key={h.n} onClick={() => setSelectedHole(h.n)} className={cn("rounded-[1.2rem] bg-white p-4 text-left ring-1 transition hover:-translate-y-[2px] hover:shadow-md", selectedHole === h.n ? "ring-2 ring-emerald-600" : "ring-slate-200")}>
                <div className="text-sm font-bold text-slate-500">Loch</div>
                <div className="mt-1 text-4xl font-bold">{h.n}</div>
                <div className="mt-3 text-sm font-semibold text-slate-600">Ø {v.toFixed(1)}</div>
                <div className="mt-1 text-xs text-slate-500">{h.focus}</div>
                <div className="mt-4 h-14"><ResponsiveContainer width="100%" height="100%"><LineChart data={miniTrend}><Line type="monotone" dataKey="score" stroke="#166534" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div>
              </button>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div><div className="text-lg font-bold">Loch {selectedHole} Verlauf</div><div className="mt-1 text-sm font-semibold text-slate-500">{course.name} · Par {selectedHoleData.par} · HCP {selectedHoleData.hcp} · Ø {holeAvg}</div></div>
            <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800">{selectedHoleData.focus}</div>
          </div>
          <div className="h-80 rounded-[1.5rem] bg-gradient-to-b from-emerald-50/70 to-white p-4 ring-1 ring-emerald-100">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={holeTrend} margin={{ left: 4, right: 16, top: 8, bottom: 4 }}>
                <defs><linearGradient id={`statsHoleFill-${selectedHole}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#166534" stopOpacity={0.2} /><stop offset="100%" stopColor="#166534" stopOpacity={0.02} /></linearGradient></defs>
                <XAxis dataKey="round" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip contentStyle={{ borderRadius: 14, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Area type="monotone" dataKey="score" stroke="#166534" strokeWidth={2.5} fill={`url(#statsHoleFill-${selectedHole})`} dot={{ r: 3, strokeWidth: 1, fill: "#fff" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="text-lg font-bold">Loch-Analyse</div>
          <div className="mt-5 space-y-3">
            <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200"><div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Durchschnitt</div><div className="mt-2 text-4xl font-bold">{holeAvg}</div></div>
            <div className="rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-100"><div className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">Fokus</div><div className="mt-2 text-xl font-bold text-emerald-900">{selectedHoleData.focus}</div></div>
            <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200"><div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">AI Hinweis</div><p className="mt-2 text-sm font-semibold leading-6 text-slate-700">Ziel auf Loch {selectedHole}: Score stabilisieren, Risiko reduzieren und den historischen Durchschnitt Schritt für Schritt drücken.</p></div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-5 text-lg font-bold">Round Replay</div>
        <div className="h-80"><ResponsiveContainer width="100%" height="100%"><LineChart data={replay}><XAxis dataKey="hole" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><Tooltip /><Line type="monotone" dataKey="score" stroke="#166534" strokeWidth={3} /></LineChart></ResponsiveContainer></div>
      </Card>
    </div>
  );
}

function LiveRound({ rounds }) {
  const a = analysis(rounds);
  const [hole, setHole] = useState(1);
  const [score, setScore] = useState(courses.maxx.holes[0].par);
  const [liveScores, setLiveScores] = useState({});
  const [sunMode, setSunMode] = useState(false);
  const currentCourse = courses.maxx;
  const current = currentCourse.holes[hole - 1];
  const courseRounds = sortRounds(rounds).filter((r) => r.courseKey === "maxx");
  const holeTrend = courseRounds.slice().reverse().map((r, i) => ({ round: i + 1, score: Number(r.holes?.[hole - 1]) || null, date: r.date }));
  const holeAvg = avg(courseRounds.map((r) => Number(r.holes?.[hole - 1]))).toFixed(1);
  const totalLive = Object.values(liveScores).reduce((s, v) => s + (Number(v) || 0), 0);
  const playedLive = Object.keys(liveScores).length;

  const speak = (text) => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "de-DE";
      utterance.rate = 0.92;
      window.speechSynthesis.speak(utterance);
    }
  };

  const saveLiveScore = (value) => {
    setScore(value);
    setLiveScores((prev) => ({ ...prev, [hole]: value }));
    speak(`Loch ${hole}, Score ${value}`);
  };

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

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
      <Card className={cn("relative overflow-hidden bg-gradient-to-br from-slate-950 via-black to-slate-900 p-8 text-white ring-1 ring-emerald-500/20", sunMode && "bg-white text-slate-950")}>
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className={cn("text-xs font-bold uppercase tracking-[0.3em]", sunMode ? "text-emerald-900" : "text-emerald-300")}>Live Round Intelligence</div>
              <div className="mt-5 text-8xl font-bold tracking-tighter">{hole}</div>
              <div className={cn("mt-2 text-lg font-semibold", sunMode ? "text-slate-700" : "text-emerald-100")}>Loch {current.n} • Par {current.par} • HCP {current.hcp}</div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setSunMode(!sunMode)} className={cn("rounded-full px-5 py-3 text-sm font-bold transition", sunMode ? "bg-yellow-300 text-black" : "border border-emerald-400/20 bg-emerald-500/10 text-emerald-200")}>{sunMode ? "☀ Sonnenlicht" : "☾ Dark Mode"}</button>
              <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-5 py-3 text-sm font-bold text-emerald-200">AI ACTIVE</div>
            </div>
          </div>

          <div className={cn("mt-10 rounded-[2rem] p-6 ring-1", sunMode ? "bg-emerald-50 text-slate-950 ring-emerald-100" : "border border-white/10 bg-white/5 text-white")}>
            <div className={cn("text-xs font-bold uppercase tracking-[0.18em]", sunMode ? "text-emerald-800" : "text-emerald-300")}>AI Caddie Briefing</div>
            <p className="mt-5 text-2xl font-semibold leading-10">{current.focus}. Kein Risiko. Kontrolle vor Länge. Ziel: ruhiges Bogey Management.</p>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-5">
            {[current.par - 1, current.par, current.par + 1].map((v, i) => (
              <button key={v} onClick={() => saveLiveScore(v)} className={cn("rounded-[2rem] border px-4 py-12 text-center transition-all duration-300 active:scale-95", score === v ? "border-emerald-400 bg-emerald-500 text-black shadow-[0_0_40px_rgba(16,185,129,0.35)]" : sunMode ? "border-slate-200 bg-white text-slate-950" : "border-white/10 bg-white/5 text-white hover:bg-white/10")}>
                <div className="text-sm font-bold uppercase tracking-[0.16em] opacity-70">{i === 0 ? "Birdie/Besser" : i === 1 ? "Par" : "Bogey"}</div>
                <div className="mt-3 text-6xl font-bold tracking-tighter">{v}</div>
              </button>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <button onClick={prevHole} className={cn("rounded-2xl px-5 py-4 text-sm font-bold transition", sunMode ? "bg-slate-100 text-slate-700" : "border border-white/10 bg-white/5 text-white hover:bg-white/10")}>← Vorheriges Loch</button>
            <button onClick={nextHole} className="rounded-2xl bg-emerald-500 px-5 py-4 text-sm font-bold text-black shadow-[0_10px_40px_rgba(16,185,129,0.25)] transition hover:scale-[1.02]">Nächstes Loch →</button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className={cn("rounded-[1.7rem] p-5 text-center", sunMode ? "bg-slate-50 ring-1 ring-slate-200" : "border border-white/10 bg-white/5")}>
              <div className={cn("text-xs font-bold uppercase tracking-[0.18em]", sunMode ? "text-slate-500" : "text-emerald-300")}>Live Score</div>
              <div className="mt-3 text-5xl font-bold">{playedLive ? totalLive : "—"}</div>
            </div>
            <div className={cn("rounded-[1.7rem] p-5 text-center", sunMode ? "bg-slate-50 ring-1 ring-slate-200" : "border border-white/10 bg-white/5")}>
              <div className={cn("text-xs font-bold uppercase tracking-[0.18em]", sunMode ? "text-slate-500" : "text-emerald-300")}>Gespielt</div>
              <div className="mt-3 text-5xl font-bold">{playedLive}/9</div>
            </div>
            <div className={cn("rounded-[1.7rem] p-5 text-center", sunMode ? "bg-slate-50 ring-1 ring-slate-200" : "border border-white/10 bg-white/5")}>
              <div className={cn("text-xs font-bold uppercase tracking-[0.18em]", sunMode ? "text-slate-500" : "text-emerald-300")}>Status</div>
              <div className={cn("mt-3 text-2xl font-bold", sunMode ? "text-emerald-800" : "text-emerald-200")}>{playedLive === 9 ? "Runde fertig" : "Live aktiv"}</div>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-4">
          <div><div className="text-lg font-bold">Loch {hole} Verlauf</div><div className="mt-1 text-sm font-semibold text-slate-500">Ø {holeAvg} · historische Scores</div></div>
          <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800">Par {current.par}</div>
        </div>
        <div className="mt-5 h-56 rounded-[1.5rem] bg-gradient-to-b from-emerald-50/70 to-white p-4 ring-1 ring-emerald-100">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={holeTrend}>
              <defs><linearGradient id={`liveHoleFill-${hole}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#166534" stopOpacity={0.2} /><stop offset="100%" stopColor="#166534" stopOpacity={0.02} /></linearGradient></defs>
              <XAxis dataKey="round" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip contentStyle={{ borderRadius: 14, border: "1px solid #e2e8f0", fontSize: 12 }} />
              <Area type="monotone" dataKey="score" stroke="#166534" strokeWidth={2.5} fill={`url(#liveHoleFill-${hole})`} dot={{ r: 3, strokeWidth: 1, fill: "#fff" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-8 text-lg font-bold">Live Empfehlungen</div>
        <div className="mt-6 space-y-4">
          {["Driver nur 80% schwingen", "Mitte Grün statt Fahne attackieren", "Kein Hero Shot nach Fehlern", "Putting Tempo kontrollieren", `Schwerstes Loch aktuell: ${a.weakness?.n || 6}`].map((tip) => (
            <div key={tip} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5"><div className="flex items-center gap-3"><div className="h-3 w-3 rounded-full bg-emerald-500" /><div className="text-sm font-bold text-slate-700">{tip}</div></div></div>
          ))}
        </div>
      </Card>
    </div>
  );
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
    window.speechSynthesis.speak(utterance);
  };

  const answer = (q) => q.toLowerCase().includes("hebel")
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
      const msg = "Dein Browser unterstützt Mikrofon-Spracherkennung nicht. Bitte Chrome oder Edge verwenden.";
      setVoiceStatus(msg);
      speak(msg);
      return;
    }
    const rec = new Rec();
    rec.lang = "de-DE";
    rec.interimResults = false;
    rec.continuous = false;
    rec.onstart = () => setVoiceStatus("Ich höre zu… jetzt sprechen.");
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
    rec.start();
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
        <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm font-bold text-emerald-100">Voice Status: {voiceStatus}</div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <button onClick={listen} className="rounded-2xl bg-emerald-600 px-5 py-4 text-sm font-bold text-white">Voice Command</button>
          <button onClick={() => speak("JARVIS online. GolfTrack Unicorn ist bereit.")} className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-sm font-bold text-white">Stimme testen</button>
        </div>
      </Card>
      <Card>
        <div className="mb-5 text-lg font-bold">GolfTrack Command Deck</div>
        <div className="mb-4 grid gap-2 md:grid-cols-3">{["Was ist mein größter Hebel?", "Wie spiele ich Loch 6?", "Was ist mein Fokus?"].map((cmd) => <button key={cmd} onClick={() => ask(cmd)} className="rounded-xl bg-emerald-50 px-3 py-3 text-xs font-bold text-emerald-800 ring-1 ring-emerald-100">{cmd}</button>)}</div>
        <div className="space-y-3 rounded-[1.5rem] bg-slate-50 p-4 ring-1 ring-slate-200">{messages.map((m, i) => <div key={i} className={cn("max-w-[88%] rounded-[1.2rem] px-4 py-3 text-sm leading-6", m.role === "you" ? "ml-auto bg-emerald-800 text-white" : "bg-white text-slate-700 shadow-sm")}>{m.text}</div>)}</div>
        <div className="mt-4 flex gap-2"><input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ask(input)} className="min-w-0 flex-1 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold outline-none" placeholder="Command eingeben…" /><button onClick={() => ask(input)} className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">Senden</button></div>
      </Card>
    </div>
  );
}

function FinanceScreen({ rounds }) {
  const finance = financeMetrics(rounds);
  const sorted = sortRounds(rounds);
  const financeTrend = sorted.slice().reverse().map((r, i) => ({ round: i + 1, score: finance.costOf(r), date: r.date }));
  const categoryRows = [["Greenfees", finance.byCategory.greenfee], ["Range", finance.byCategory.range], ["Essen & Getränke", finance.byCategory.food], ["Turniere", finance.byCategory.tournament], ["Sonstiges", finance.byCategory.other]];
  const maxCategory = Math.max(...categoryRows.map(([, value]) => value), 1);
  const scoreCostRows = sorted.slice(0, 8).map((r) => ({ date: r.date, course: courses[r.courseKey]?.name, score: r.total, cost: finance.costOf(r) }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardKpi icon="€" label="Gesamtkosten" value={`${Math.round(finance.total)}€`} delta={`${Math.round(finance.avgCost)}€/R`} trend={financeTrend} sub="alle Runden" />
        <DashboardKpi icon="⚑" label="Ø Kosten/Runde" value={`${Math.round(finance.avgCost)}€`} delta="Budget" trend={financeTrend} sub="laufender Schnitt" />
        <DashboardKpi icon="◉" label="Teuerste Runde" value={finance.mostExpensive ? `${finance.costOf(finance.mostExpensive)}€` : "—"} delta="Peak" trend={financeTrend} sub={finance.mostExpensive?.date || "—"} />
        <DashboardKpi icon="▥" label="Greenfees" value={`${Math.round(finance.byCategory.greenfee)}€`} delta="größter Block" trend={financeTrend} sub="Kategorie" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <Card>
          <div className="mb-5 flex items-center justify-between gap-4"><div><div className="text-lg font-bold">Kostenverlauf</div><div className="mt-1 text-sm font-semibold text-slate-500">Was jede Runde wirklich gekostet hat.</div></div><div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800">Ø {Math.round(finance.avgCost)}€</div></div>
          <div className="h-80 rounded-[1.5rem] bg-gradient-to-b from-emerald-50/70 to-white p-4 ring-1 ring-emerald-100">
            <ResponsiveContainer width="100%" height="100%"><AreaChart data={financeTrend} margin={{ left: 4, right: 16, top: 8, bottom: 4 }}><defs><linearGradient id="financeFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#166534" stopOpacity={0.2} /><stop offset="100%" stopColor="#166534" stopOpacity={0.02} /></linearGradient></defs><XAxis dataKey="round" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} /><YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} /><Tooltip contentStyle={{ borderRadius: 14, border: "1px solid #e2e8f0", fontSize: 12 }} /><Area type="monotone" dataKey="score" stroke="#166534" strokeWidth={2.5} fill="url(#financeFill)" dot={{ r: 3, strokeWidth: 1, fill: "#fff" }} /></AreaChart></ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <div className="text-lg font-bold">Kosten nach Kategorien</div>
          <div className="mt-5 space-y-4">{categoryRows.map(([label, value]) => <div key={label}><div className="mb-2 flex justify-between text-sm font-semibold text-slate-600"><span>{label}</span><span>{Math.round(value)}€</span></div><div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-emerald-800" style={{ width: `${Math.max(4, (value / maxCategory) * 100)}%` }} /></div></div>)}</div>
          <div className="mt-6 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200"><div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">AI Hinweis</div><p className="mt-2 text-sm font-semibold leading-6 text-slate-700">Ab jetzt kannst du Score, Leistung und Investment vergleichen. Teuer heißt nicht automatisch besser.</p></div>
        </Card>
      </div>
      <Card>
        <div className="mb-5 text-lg font-bold">Rundenwert</div>
        <div className="overflow-hidden rounded-[1.2rem] ring-1 ring-slate-200">
          <div className="grid grid-cols-[1.1fr_1.2fr_.6fr_.6fr] bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-500"><div>Datum</div><div>Platz</div><div className="text-right">Score</div><div className="text-right">Kosten</div></div>
          {scoreCostRows.map((row) => <div key={`${row.date}-${row.course}`} className="grid grid-cols-[1.1fr_1.2fr_.6fr_.6fr] border-t border-slate-200 px-4 py-4 text-sm font-semibold text-slate-700"><div>{row.date}</div><div>{row.course}</div><div className="text-right font-bold">{row.score}</div><div className="text-right font-bold text-emerald-800">{row.cost}€</div></div>)}
        </div>
      </Card>
    </div>
  );
}

function MentalScreen({ rounds }) {
  const mental = mentalMetrics(rounds);
  const sorted = sortRounds(rounds);
  const mentalTrend = sorted.slice().reverse().map((r, i) => ({ round: i + 1, score: avg([r.mental?.focus, r.mental?.energy, r.mental?.confidence, r.mental?.management, 10 - (Number(r.mental?.frustration) || 0)]), date: r.date }));
  const courseRows = Object.entries(courses).map(([key, course]) => {
    const courseRounds = sorted.filter((r) => r.courseKey === key);
    return { course: course.name, rounds: courseRounds.length, rating: avg(courseRounds.map((r) => Number(r.courseRating?.overall))), greens: avg(courseRounds.map((r) => Number(r.courseRating?.greens))), playAgain: courseRounds.length ? Math.round((courseRounds.filter((r) => r.courseRating?.playAgain).length / courseRounds.length) * 100) : 0 };
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardKpi icon="◌" label="Mental Score" value={mental.mentalScore.toFixed(1)} delta="Mind" trend={mentalTrend} sub="Fokus + Ruhe" />
        <DashboardKpi icon="●" label="Fokus" value={mental.focus.toFixed(1)} delta="/10" trend={mentalTrend} sub="Durchschnitt" />
        <DashboardKpi icon="↓" label="Frustlevel" value={mental.frustration.toFixed(1)} delta="senken" trend={mentalTrend} sub="je niedriger desto besser" />
        <DashboardKpi icon="★" label="Platz Rating" value={mental.courseScore.toFixed(1)} delta="/10" trend={mentalTrend} sub="Greens + Fairways" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <Card>
          <div className="mb-5 flex items-center justify-between gap-4"><div><div className="text-lg font-bold">Mental Verlauf</div><div className="mt-1 text-sm font-semibold text-slate-500">Wie stabil dein Kopf über die Runden war.</div></div><div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800">Ø {mental.mentalScore.toFixed(1)}</div></div>
          <div className="h-80 rounded-[1.5rem] bg-gradient-to-b from-emerald-50/70 to-white p-4 ring-1 ring-emerald-100"><ResponsiveContainer width="100%" height="100%"><AreaChart data={mentalTrend} margin={{ left: 4, right: 16, top: 8, bottom: 4 }}><defs><linearGradient id="mentalFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#166534" stopOpacity={0.2} /><stop offset="100%" stopColor="#166534" stopOpacity={0.02} /></linearGradient></defs><XAxis dataKey="round" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} /><YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} /><Tooltip contentStyle={{ borderRadius: 14, border: "1px solid #e2e8f0", fontSize: 12 }} /><Area type="monotone" dataKey="score" stroke="#166534" strokeWidth={2.5} fill="url(#mentalFill)" dot={{ r: 3, strokeWidth: 1, fill: "#fff" }} /></AreaChart></ResponsiveContainer></div>
        </Card>
        <Card>
          <div className="text-lg font-bold">Mental Analyse</div>
          <div className="mt-5 space-y-4">{[["Energie", mental.energy], ["Selbstvertrauen", mental.confidence], ["Course Management", mental.management], ["Wieder spielen", mental.playAgainRate]].map(([label, value]) => <div key={label}><div className="mb-2 flex justify-between text-sm font-semibold text-slate-600"><span>{label}</span><span>{label === "Wieder spielen" ? `${Math.round(value)}%` : `${value.toFixed(1)}/10`}</span></div><div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-emerald-800" style={{ width: `${label === "Wieder spielen" ? value : value * 10}%` }} /></div></div>)}</div>
          <div className="mt-6 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200"><div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">AI Hinweis</div><p className="mt-2 text-sm font-semibold leading-6 text-slate-700">Deine besten Runden entstehen nicht nur aus Technik. Fokus hoch, Frust niedrig und klare Entscheidungen sind dein echter Score-Hebel.</p></div>
        </Card>
      </div>
      <Card>
        <div className="mb-5 text-lg font-bold">Golfplatz Ranking</div>
        <div className="overflow-hidden rounded-[1.2rem] ring-1 ring-slate-200">
          <div className="grid grid-cols-[1.5fr_.5fr_.6fr_.6fr_.6fr] bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-500"><div>Platz</div><div>Runden</div><div className="text-right">Rating</div><div className="text-right">Greens</div><div className="text-right">Wieder</div></div>
          {courseRows.map((row) => <div key={row.course} className="grid grid-cols-[1.5fr_.5fr_.6fr_.6fr_.6fr] border-t border-slate-200 px-4 py-4 text-sm font-semibold text-slate-700"><div>{row.course}</div><div>{row.rounds}</div><div className="text-right font-bold">{row.rating.toFixed(1)}</div><div className="text-right font-bold">{row.greens.toFixed(1)}</div><div className="text-right font-bold text-emerald-800">{row.playAgain}%</div></div>)}
        </div>
      </Card>
    </div>
  );
}

function Plan() {
  const items = [["Woche 1", "Putting stabilisieren", "max. 2 Drei-Putts"], ["Woche 2", "Abschläge sicherer", "Ball im Spiel halten"], ["Woche 3", "Short Game", "Chip + 2 Putts"], ["Woche 4", "Turniermodus", "Routine halten"]];
  return <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">{items.map(([week, title, goal]) => <Card key={week}><div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{week}</div><div className="mt-4 text-2xl font-bold">{title}</div><div className="mt-3 text-sm leading-6 text-slate-500">{goal}</div></Card>)}</div>;
}

function Tools({ rounds, setRounds }) {
  const json = JSON.stringify(rounds, null, 2);
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card><div className="text-2xl font-bold">JSON Export</div><p className="mt-3 text-sm leading-6 text-slate-500">Kopiert deine Rundendaten.</p><button onClick={() => navigator.clipboard?.writeText(json)} className="mt-6 rounded-2xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white">Export kopieren</button></Card>
      <Card><div className="text-2xl font-bold">Demo Reset</div><p className="mt-3 text-sm leading-6 text-slate-500">Setzt Demo-Daten zurück.</p><button onClick={() => { setRounds(demoRounds); persist(demoRounds); }} className="mt-6 rounded-2xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700">Zurücksetzen</button></Card>
      <Card><div className="text-2xl font-bold">Vision Ready</div><p className="mt-3 text-sm leading-6 text-slate-500">Scorecard Scan und AI Backend können später angebunden werden.</p></Card>
    </div>
  );
}

export default function GolfTrackUnicorn() {
  const [tab, setTab] = useState("home");
  const [rounds, setRounds] = useState(loadRounds);

  const screen = {
    home: <Home rounds={rounds} />,
    round: <RoundEntry rounds={rounds} setRounds={setRounds} />,
    stats: <Stats rounds={rounds} />,
    live: <LiveRound rounds={rounds} />,
    coach: <CoachScreen rounds={rounds} />,
    finance: <FinanceScreen rounds={rounds} />,
    mental: <MentalScreen rounds={rounds} />,
    plan: <Plan />,
    tools: <Tools rounds={rounds} setRounds={setRounds} />,
  }[tab];

  return <Shell tab={tab} setTab={setTab}>{screen}</Shell>;
}
