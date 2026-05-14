import React, { useState } from "react";
import Card from "../components/Card";
import Trend from "../components/Trend";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

export default function Stats({
  rounds,
  courses,
  sortRounds,
  avg,
  cn,
}) {
  const [courseKey, setCourseKey] = useState("maxx");
  const [hole, setHole] = useState(1);

  const course = courses[courseKey];

  const rs = sortRounds(rounds).filter(
    (r) => r.courseKey === courseKey
  );

  const h = course.holes[hole - 1];

  const trend = rs
    .slice()
    .reverse()
    .map((r, i) => ({
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
        <div className="mb-5 flex justify-between gap-4">
          <div>
            <div className="text-lg font-bold">
              Performance Heatmap
            </div>

            <div className="text-sm text-slate-500">
              Klick auf ein Loch für Details.
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
                  "rounded-xl px-4 py-2 text-xs font-bold",
                  courseKey === k
                    ? "bg-white"
                    : "text-slate-500"
                )}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-9">
          {course.holes.map((x, i) => {
            const mini = rs
              .slice()
              .reverse()
              .map((r, j) => ({
                round: j + 1,
                score: r.holes?.[i],
              }));

            return (
              <button
                key={x.n}
                onClick={() => setHole(x.n)}
                className={cn(
                  "rounded-xl bg-white p-4 text-left ring-1 ring-slate-200",
                  hole === x.n &&
                    "ring-2 ring-emerald-600"
                )}
              >
                <div className="text-sm font-bold text-slate-500">
                  Loch
                </div>

                <div className="text-4xl font-bold">
                  {x.n}
                </div>

                <div className="mt-2 text-sm font-semibold">
                  Ø{" "}
                  {avg(
                    rs.map((r) => r.holes?.[i])
                  ).toFixed(1)}
                </div>

                <div className="mt-3 h-12">
                  <Trend data={mini} />
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card>
          <div className="mb-5 text-lg font-bold">
            Loch {hole} Verlauf
          </div>

          <div className="h-80">
            <Trend data={trend} area />
          </div>
        </Card>

        <Card>
          <div className="text-lg font-bold">
            Loch-Analyse
          </div>

          <div className="mt-5 rounded-2xl bg-emerald-50 p-4">
            <b>{h.focus}</b>

            <p className="mt-2 text-sm text-slate-600">
              Par {h.par} · HCP {h.hcp}
            </p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-5 text-lg font-bold">
          Round Replay
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={replay}>
              <XAxis dataKey="hole" />
              <YAxis />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="score"
                stroke="#166534"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
