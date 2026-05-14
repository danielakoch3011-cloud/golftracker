import React, { useState } from "react";
import Card from "../components/Card";
import Kpi from "../components/Kpi";

export default function LiveRound({
  rounds,
  setRounds,
  courses,
  cn,
  uid,
  sortRounds,
  persist,
}) {
  const [hole, setHole] = useState(1);
  const [scores, setScores] = useState({});
  const [sun, setSun] = useState(false);
  const [saved, setSaved] = useState(false);

  const course = courses.maxx;
  const h = course.holes[hole - 1];

  const total = Object.values(scores).reduce((s, v) => s + v, 0);
  const played = Object.keys(scores).length;

  const saveScore = (v) => {
    setScores({ ...scores, [hole]: v });
  };

  const finishRound = () => {
    if (played !== 9) return;

    const holes = Array.from(
      { length: 9 },
      (_, i) => Number(scores[i + 1]) || 0
    );

    const payload = {
      id: uid(),
      date: new Date().toISOString().slice(0, 10),
      courseKey: "maxx",
      total,
      holes,
      fir: 0,
      gir: 0,
      putts: 0,
      note: "Automatisch aus Live Caddie gespeichert",
      costs: { greenfee: 0, range: 0, food: 0, tournament: 0, other: 0 },
      mental: { focus: 7, energy: 7, frustration: 3, confidence: 7, management: 7 },
      courseRating: { overall: 8, greens: 7, fairways: 7, atmosphere: 8, playAgain: true },
    };

    const updated = sortRounds([payload, ...rounds]);
    setRounds(updated);
    persist(updated);
    setSaved(true);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
      <Card className={cn("bg-slate-950 p-8 text-white", sun && "bg-white text-black")}>
        <div className="flex justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">
              Live Round
            </div>
            <div className="mt-5 text-8xl font-bold">{hole}</div>
            <div>
              Par {h.par} · HCP {h.hcp}
            </div>
          </div>

          <button
            onClick={() => setSun(!sun)}
            className="h-12 rounded-full bg-emerald-500 px-5 font-bold text-black"
          >
            ☀
          </button>
        </div>

        <div className="mt-8 rounded-3xl bg-white/10 p-6">
          <b>AI Caddie Briefing</b>
          <p className="mt-3 text-2xl font-bold">
            {h.focus}. Kontrolle vor Risiko.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4">
          {[h.par - 1, h.par, h.par + 1].map((v, i) => (
            <button
              key={v}
              onClick={() => saveScore(v)}
              className="rounded-3xl bg-emerald-500 px-4 py-10 text-4xl font-black text-black"
            >
              {v}
              <div className="text-xs">{["Birdie", "Par", "Bogey"][i]}</div>
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => setHole(Math.max(1, hole - 1))}
            className="rounded-2xl bg-white/10 p-4 font-bold"
          >
            ← Zurück
          </button>

          <button
            onClick={() => setHole(Math.min(9, hole + 1))}
            className="rounded-2xl bg-emerald-500 p-4 font-bold text-black"
          >
            Weiter →
          </button>
        </div>

        <div className="mt-4">
          <button
            onClick={finishRound}
            disabled={played !== 9 || saved}
            className={cn(
              "w-full rounded-2xl p-4 text-sm font-bold transition",
              played === 9 && !saved
                ? "bg-white text-black"
                : "bg-white/10 text-white/40"
            )}
          >
            {saved ? "Runde gespeichert ✓" : "Live Runde speichern"}
          </button>
        </div>
      </Card>

      <Card>
        <div className="text-lg font-bold">Live Status</div>

        <div className="mt-6 grid gap-4">
          <Kpi
            icon="Σ"
            label="Live Score"
            value={played ? total : "—"}
            sub={`${played}/9 gespielt`}
          />

          <Kpi
            icon="◉"
            label="Aktuelles Loch"
            value={hole}
            sub={h.focus}
          />
        </div>
      </Card>
    </div>
  );
}
