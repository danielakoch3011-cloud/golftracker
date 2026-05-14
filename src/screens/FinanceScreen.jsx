import React, { useState } from "react";

import Card from "../components/Card";
import Kpi from "../components/Kpi";
import Trend from "../components/Trend";
import MiniInput from "../components/MiniInput";
import FinanceLine from "../components/FinanceLine";

export default function FinanceScreen({
  rounds,
  financeMetrics,
  sortRounds,
  roundCost,
  trainingCost,
  financeSettings,
  eur,
  uid,
  loadTrainings,
  persistTrainings,
}) {
  const f = financeMetrics(rounds);
  const sorted = sortRounds(rounds);

  const [trainings, setTrainings] = useState(loadTrainings);

  const [settings, setSettings] = useState({
    membershipMonthly: 143,
    referenceGreenfeeWeekday: 25,
    referenceGreenfeeWeekend: 29,
    rangeBuckets: 4,
    trainerHours: 1,
  });

  const [trainingForm, setTrainingForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    type: "Range",
    note: "",
    buckets: 1,
    trainerHours: 0,
  });

  const trend = sorted
    .slice()
    .reverse()
    .map((r, i) => ({
      round: i + 1,
      score: roundCost(r),
    }));

  const cats = [
    ["Greenfees", f.byCategory.greenfee],
    ["Range", f.byCategory.range],
    ["Essen", f.byCategory.food],
    ["Turniere", f.byCategory.tournament],
    ["Sonstiges", f.byCategory.other],
  ];

  const max = Math.max(...cats.map(([, v]) => v), 1);

  const trainingTotal = trainings.reduce(
    (sum, t) => sum + trainingCost(t),
    0
  );

  const rangeMonthly =
    Number(settings.rangeBuckets || 0) *
    financeSettings.rangeBucketPrice;

  const trainerMonthly =
    Number(settings.trainerHours || 0) *
    financeSettings.trainerHour;

  const monthlyTotal =
    Number(settings.membershipMonthly || 0) +
    rangeMonthly +
    trainerMonthly;

  const realTotalWithTrainings =
    f.variableTotal +
    Number(settings.membershipMonthly || 0) +
    trainingTotal;

  const breakEvenWeekday = Math.ceil(
    Number(settings.membershipMonthly || 0) /
      Number(settings.referenceGreenfeeWeekday || 1)
  );

  const breakEvenWeekend = Math.ceil(
    Number(settings.membershipMonthly || 0) /
      Number(settings.referenceGreenfeeWeekend || 1)
  );

  const updateSetting = (key, value) =>
    setSettings({ ...settings, [key]: value });

  const saveTraining = () => {
    const next = [
      {
        ...trainingForm,
        id: uid(),
        buckets: Number(trainingForm.buckets) || 0,
        trainerHours: Number(trainingForm.trainerHours) || 0,
      },
      ...trainings,
    ];

    setTrainings(next);
    persistTrainings(next);

    setTrainingForm({
      date: new Date().toISOString().slice(0, 10),
      type: "Range",
      note: "",
      buckets: 1,
      trainerHours: 0,
    });
  };

  const deleteTraining = (id) => {
    const next = trainings.filter((t) => t.id !== id);
    setTrainings(next);
    persistTrainings(next);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Kpi
          icon="€"
          label="Gesamt real"
          value={eur(realTotalWithTrainings)}
          sub="Runden + Training"
        />

        <Kpi
          icon="⚑"
          label="Ø Runde"
          value={eur(f.avgCost)}
          sub="variable Kosten"
        />

        <Kpi
          icon="◉"
          label="Mitgliedschaft"
          value={eur(settings.membershipMonthly)}
          sub="pro Monat"
        />

        <Kpi
          icon="⛳"
          label="Training"
          value={eur(trainingTotal)}
          sub={`${trainings.length} Einheiten`}
        />

        <Kpi
          icon="↔"
          label="Break-even"
          value={`${breakEvenWeekday}/${breakEvenWeekend}`}
          sub="Woche / WE"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <Card>
          <div className="mb-5 text-lg font-bold">
            Kostenverlauf
          </div>

          <div className="h-80">
            <Trend data={trend} area />
          </div>
        </Card>

        <Card>
          <div className="text-lg font-bold">
            Finance Cockpit
          </div>

          <div className="mt-5 space-y-3">
            <MiniInput
              label="Mitgliedschaft €/Monat"
              value={settings.membershipMonthly}
              onChange={(v) =>
                updateSetting("membershipMonthly", v)
              }
            />

            <MiniInput
              label="Greenfee Woche €"
              value={settings.referenceGreenfeeWeekday}
              onChange={(v) =>
                updateSetting("referenceGreenfeeWeekday", v)
              }
            />

            <MiniInput
              label="Greenfee Wochenende €"
              value={settings.referenceGreenfeeWeekend}
              onChange={(v) =>
                updateSetting("referenceGreenfeeWeekend", v)
              }
            />

            <MiniInput
              label="Range Körbe / Monat"
              value={settings.rangeBuckets}
              onChange={(v) =>
                updateSetting("rangeBuckets", v)
              }
            />

            <MiniInput
              label="Trainerstunden / Monat"
              value={settings.trainerHours}
              onChange={(v) =>
                updateSetting("trainerHours", v)
              }
            />
          </div>

          <div className="mt-6 rounded-2xl bg-emerald-50 p-5 ring-1 ring-emerald-100">
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
              Break-even
            </div>

            <div className="mt-2 text-4xl font-bold text-emerald-900">
              {breakEvenWeekday} / {breakEvenWeekend}
            </div>

            <p className="mt-2 text-sm font-semibold leading-6 text-emerald-800">
              Woche bei 25€, Wochenende bei 29€ Greenfee.
            </p>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <Card>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <div className="text-lg font-bold">
                Training Kalender
              </div>

              <div className="mt-1 text-sm font-semibold text-slate-500">
                Datum, Inhalt und Kosten.
              </div>
            </div>

            <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800">
              {eur(trainingTotal)}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-5">
            <label className="rounded-[1.2rem] bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
                Datum
              </div>

              <input
                type="date"
                value={trainingForm.date}
                onChange={(e) =>
                  setTrainingForm({
                    ...trainingForm,
                    date: e.target.value,
                  })
                }
                className="mt-2 w-full bg-transparent text-sm font-bold outline-none"
              />
            </label>

            <label className="rounded-[1.2rem] bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
                Typ
              </div>

              <select
                value={trainingForm.type}
                onChange={(e) =>
                  setTrainingForm({
                    ...trainingForm,
                    type: e.target.value,
                  })
                }
                className="mt-2 w-full bg-transparent text-sm font-bold outline-none"
              >
                <option>Range</option>
                <option>Trainer</option>
                <option>Putting</option>
                <option>Short Game</option>
                <option>Fitness</option>
              </select>
            </label>

            <MiniInput
              label="Körbe"
              value={trainingForm.buckets}
              onChange={(v) =>
                setTrainingForm({
                  ...trainingForm,
                  buckets: v,
                })
              }
            />

            <MiniInput
              label="Trainer h"
              value={trainingForm.trainerHours}
              onChange={(v) =>
                setTrainingForm({
                  ...trainingForm,
                  trainerHours: v,
                })
              }
            />

            <div className="rounded-[1.2rem] bg-emerald-50 p-4 ring-1 ring-emerald-100">
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
                Kosten
              </div>

              <div className="mt-2 text-2xl font-bold text-emerald-900">
                {eur(trainingCost(trainingForm))}
              </div>
            </div>
          </div>

          <textarea
            value={trainingForm.note}
            onChange={(e) =>
              setTrainingForm({
                ...trainingForm,
                note: e.target.value,
              })
            }
            placeholder="Was hast du trainiert?"
            className="mt-4 min-h-20 w-full rounded-[1.2rem] bg-slate-50 p-4 text-sm font-semibold outline-none ring-1 ring-slate-200"
          />

          <button
            onClick={saveTraining}
            className="mt-4 rounded-2xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white"
          >
            Training speichern
          </button>

          <div className="mt-6 space-y-3">
            {trainings.slice(0, 8).map((t) => (
              <div
                key={t.id}
                className="grid gap-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 md:grid-cols-[110px_100px_1fr_80px_40px] md:items-center"
              >
                <div className="text-sm font-bold text-slate-700">
                  {t.date}
                </div>

                <div className="text-sm font-bold text-emerald-800">
                  {t.type}
                </div>

                <div className="text-sm font-semibold text-slate-600">
                  {t.note || "—"}
                </div>

                <div className="text-right text-sm font-bold text-slate-900">
                  {eur(trainingCost(t))}
                </div>

                <button
                  onClick={() => deleteTraining(t.id)}
                  className="text-sm font-bold text-rose-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="text-lg font-bold">
            Training Finance
          </div>

          <div className="mt-5 space-y-4">
            <FinanceLine
              label="Training gesamt"
              value={trainingTotal}
            />

            <FinanceLine
              label="Range gesamt"
              value={trainings.reduce(
                (s, t) =>
                  s +
                  (Number(t.buckets) || 0) *
                    financeSettings.rangeBucketPrice,
                0
              )}
            />

            <FinanceLine
              label="Trainer gesamt"
              value={trainings.reduce(
                (s, t) =>
                  s +
                  (Number(t.trainerHours) || 0) *
                    financeSettings.trainerHour,
                0
              )}
            />

            <div className="border-t border-slate-200 pt-4">
              <FinanceLine
                label="Real Total inkl. Training"
                value={realTotalWithTrainings}
                strong
              />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <Card>
          <div className="text-lg font-bold">
            Monatskosten Simulation
          </div>

          <div className="mt-5 space-y-4">
            <FinanceLine
              label="Mitgliedschaft"
              value={settings.membershipMonthly}
            />

            <FinanceLine
              label={`Range (${settings.rangeBuckets} × 3,30€)`}
              value={rangeMonthly}
            />

            <FinanceLine
              label={`Trainer (${settings.trainerHours} × 48€)`}
              value={trainerMonthly}
            />

            <div className="border-t border-slate-200 pt-4">
              <FinanceLine
                label="Gesamt pro Monat"
                value={monthlyTotal}
                strong
              />
            </div>
          </div>
        </Card>

        <Card>
          <div className="text-lg font-bold">
            Kategorien
          </div>

          <div className="mt-5 space-y-4">
            {cats.map(([l, v]) => (
              <div key={l}>
                <div className="mb-2 flex justify-between text-sm font-semibold">
                  <span>{l}</span>
                  <span>{eur(v)}</span>
                </div>

                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-emerald-800"
                    style={{
                      width: `${Math.max(
                        4,
                        (v / max) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-4 text-lg font-bold">
          Rundenwert
        </div>

        {sorted.slice(0, 8).map((r) => (
          <div
            key={r.id}
            className="grid grid-cols-4 border-t py-3 text-sm font-semibold"
          >
            <span>{r.date}</span>
            <span>{r.courseKey}</span>
            <span className="text-right">{r.total}</span>
            <span className="text-right text-emerald-800">
              {eur(roundCost(r))}
            </span>
          </div>
        ))}
      </Card>
    </div>
  );
}
