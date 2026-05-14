import React from "react";

import Card from "../components/Card";
import Kpi from "../components/Kpi";
import Trend from "../components/Trend";
import BarRow from "../components/BarRow";

export default function Home({
  rounds,
  metrics,
  analysis,
  financeMetrics,
  mentalMetrics,
  eur,
  mentalScore,
}) {
  const m = metrics(rounds);
  const a = analysis(rounds);
  const f = financeMetrics(rounds);
  const mt = mentalMetrics(rounds);

  const trend = a.sorted
    .slice()
    .reverse()
    .map((r, i) => ({
      round: i + 1,
      score: r.total,
    }));

  const latest = a.latest;

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Kpi
            icon="⚑"
            label="Runden"
            value={m.rounds}
            sub="gespeichert"
          />

          <Kpi
            icon="●"
            label="Ø Score"
            value={m.avg}
            sub="9 Loch"
          />

          <Kpi
            icon="€"
            label="Golf Kosten"
            value={eur(f.total)}
            sub={`Ø ${eur(f.avgCost)} / Runde`}
          />

          <Kpi
            icon="◌"
            label="Mental"
            value={mt.score.toFixed(1)}
            sub="Score / 10"
          />
        </div>

        <Card>
          <div className="mb-5 text-lg font-bold">
            Score Verlauf
          </div>

          <div className="h-[330px]">
            <Trend
              data={trend}
              area
              domain={[36, 72]}
            />
          </div>
        </Card>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card>
            <div className="text-lg font-bold">
              Stärken & Schwächen
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <div className="mb-3 text-sm font-bold text-emerald-700">
                  Stärken
                </div>

                <BarRow
                  label="Putten"
                  value={Math.max(
                    35,
                    100 - Number(m.putts) * 16
                  )}
                />

                <BarRow
                  label="Fokus"
                  value={mt.focus * 10}
                />
              </div>

              <div>
                <div className="mb-3 text-sm font-bold text-rose-600">
                  Hebel
                </div>

                <BarRow
                  label={`Loch ${a.weakness?.n || 6}`}
                  value={70}
                />

                <BarRow
                  label="Frust senken"
                  value={Math.max(
                    10,
                    100 - mt.frustration * 10
                  )}
                />
              </div>
            </div>
          </Card>

          <Card>
            <div className="text-lg font-bold">
              AI Kurzbriefing
            </div>

            <p className="mt-4 text-sm font-semibold leading-7 text-slate-600">
              Dein größter Hebel ist Loch{" "}
              {a.weakness?.n || 6}.
              Stabilisiere dort das Risiko und halte
              den Mental Score über 7.
            </p>
          </Card>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <div className="text-lg font-bold">
            Letzte Runde
          </div>

          <div className="mt-4 text-sm font-semibold text-slate-700">
            {latest
              ? latest.courseKey
              : "—"}
          </div>

          <div className="mt-1 text-sm text-slate-500">
            {latest?.date}
          </div>

          <div className="mt-6 text-5xl font-bold">
            {latest?.total || "—"}
          </div>
        </Card>

        <Card>
          <div className="mb-4 text-lg font-bold">
            Letzte Runden
          </div>

          {a.sorted.slice(0, 5).map((r) => (
            <div
              key={r.id}
              className="flex justify-between border-t border-slate-100 py-3"
            >
              <span className="text-sm font-semibold">
                {r.date}
              </span>

              <b>{r.total}</b>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
