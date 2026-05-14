import React, { useState } from "react";
import Card from "../components/Card";
import Trend from "../components/Trend";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function Stats({ rounds, courses, sortRounds, avg, cn }) {
  const [courseKey, setCourseKey] = useState("maxx");
  const [hole, setHole] = useState(1);

  const course = courses[courseKey];
  const rs = sortRounds(rounds).filter((r) => r.courseKey === courseKey);
  const h = course.holes[hole - 1];

  const trend = rs.slice().reverse().map((r, i) => ({
    round: i + 1,
    score: Number(r.holes?.[hole - 1]) || null,
  }));

  const replay =
    rs[0]?.holes?.map((score, i) => ({
      hole: `L${i + 1}`,
      score,
    })) || [];

  return (
    <div className="space-y-6">
      <Card>
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <div className="text-2xl font-bold">Performance Heatmap</div>
            <div className="mt-1 text-sm text-slate-500">
              Wähle ein Loch für Details.
            </div>
          </div>

          <div className="flex rounded-2xl bg-slate-100 p-1">
            {Object.entries(courses).map(([k, c]) => (
              <button
                key={k}
                onClick={() => {
                  setCourseKey(k);
                  setHole(1);
                }}
                className={cn(
                  "rounded-xl px-4 py-2 text-sm font-bold transition",
                  courseKey === k ? "bg-white shadow-sm" : "text-slate-500"
                )}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-9">
          {course.holes.map((x, i) => {
            const holeAvg = avg(rs.map((r) => r.holes?.[i]));
            const diff = holeAvg - x.par;

            let levelColor = "bg-emerald-500/10 text-emerald-700";
            let cardStyle = "from-white to-emerald-50/40 border-emerald-100";

            if (diff > 1 && diff <= 2.5) {
              levelColor = "bg-amber-500/10 text-amber-700";
              cardStyle = "from-white to-amber-50/40 border-amber-100";
            }

            if (diff > 2.5) {
              levelColor = "bg-rose-500/10 text-rose-700";
              cardStyle = "from-white to-rose-50/40 border-rose-100";
            }

            return (
              <button
                key={x.n}
                onClick={() => setHole(x.n)}
                className={cn(
                  "min-h-[210px] rounded-3xl border bg-gradient-to-br p-4 text-left transition-all duration-200",
                  cardStyle,
                  hole === x.n &&
                    "scale-[1.02] ring-2 ring-emerald-500 shadow-xl"
                )}
              >
                <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Loch
                </div>

                <div className="mt-3 text-6xl font-black">{x.n}</div>

                <div className="mt-2 text-sm font-bold text-slate-500">
                  Par {x.par} • HCP {x.hcp}
                </div>

                <div className="mt-7 text-3xl font-black">
                  Ø {holeAvg.toFixed(1)}
                </div>

                <div
                  className={cn(
                    "mt-4 inline-flex rounded-full px-3 py-1 text-xs font-bold",
                    levelColor
                  )}
                >
                  {diff > 0 ? "+" : ""}
                  {diff.toFixed(1)}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">Loch {hole} Verlauf</div>
              <div className="mt-1 text-sm text-slate-500">
                Entwicklung deiner letzten Runden.
              </div>
            </div>

            <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800">
              Ø {avg(rs.map((r) => r.holes?.[hole - 1])).toFixed(1)}
            </div>
          </div>

          <div className="h-[340px]">
            <Trend data={trend} area />
          </div>
        </Card>

        <Card>
          <div className="text-2xl font-bold">Loch-Analyse</div>

          <div className="mt-6 rounded-3xl bg-emerald-50 p-6">
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
              Fokus
            </div>

            <div className="mt-3 text-2xl font-bold text-emerald-950">
              {h.focus}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white p-4">
                <div className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                  Par
                </div>
                <div className="mt-1 text-3xl font-black">{h.par}</div>
              </div>

              <div className="rounded-2xl bg-white p-4">
                <div className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                  HCP
                </div>
                <div className="mt-1 text-3xl font-black">{h.hcp}</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-6">
          <div className="text-2xl font-bold">Round Replay</div>
          <div className="mt-1 text-sm text-slate-500">
            Verlauf deiner letzten Runde.
          </div>
        </div>

        <div className="h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={replay}>
              <XAxis dataKey="hole" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#166534"
                strokeWidth={4}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
