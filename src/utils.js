import { courses, financeSettings } from "./data";

export const cn = (...x) => x.filter(Boolean).join(" ");

export const avg = (v) => {
  const n = v.map(Number).filter(Number.isFinite);
  return n.length
    ? n.reduce((a, b) => a + b, 0) / n.length
    : 0;
};

export const sortRounds = (r) =>
  [...r].sort((a, b) => new Date(b.date) - new Date(a.date));

export const uid = () =>
  `r-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const eur = (v) =>
  `${Math.round(Number(v) || 0)}€`;

export function trainingCost(t) {
  return (
    (Number(t.buckets) || 0) * financeSettings.rangeBucketPrice +
    (Number(t.trainerHours) || 0) * financeSettings.trainerHour
  );
}

export function roundCost(r) {
  const c = r.costs || {};

  return ["greenfee", "range", "food", "tournament", "other"]
    .reduce((s, k) => s + (Number(c[k]) || 0), 0);
}

export function mentalScore(r) {
  const m = r.mental || {};

  return avg([
    m.focus,
    m.energy,
    m.confidence,
    m.management,
    10 - (Number(m.frustration) || 0),
  ]);
}

export function metrics(rounds) {
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

export function financeMetrics(rounds) {
  const byCategory = ["greenfee", "range", "food", "tournament", "other"]
    .reduce((o, k) => {
      o[k] = rounds.reduce(
        (s, r) => s + (Number(r.costs?.[k]) || 0),
        0
      );

      return o;
    }, {});

  const variableTotal = rounds.reduce(
    (s, r) => s + roundCost(r),
    0
  );

  const estimatedTraining =
    rounds.length * financeSettings.trainerHour * 0.15;

  return {
    variableTotal,
    fixedMonthly: financeSettings.membershipMonthly,
    estimatedTraining,
    total:
      variableTotal +
      financeSettings.membershipMonthly +
      estimatedTraining,
    avgCost: rounds.length
      ? variableTotal / rounds.length
      : 0,
    byCategory,
    mostExpensive: sortRounds(rounds)
      .sort((a, b) => roundCost(b) - roundCost(a))[0],
  };
}

export function mentalMetrics(rounds) {
  return {
    score: avg(rounds.map(mentalScore)),
    focus: avg(rounds.map((r) => r.mental?.focus)),
    frustration: avg(rounds.map((r) => r.mental?.frustration)),
    course: avg(rounds.map((r) => r.courseRating?.overall)),
    playAgain: Math.round(
      rounds.filter((r) => r.courseRating?.playAgain).length /
        Math.max(1, rounds.length) *
        100
    ),
  };
}

export function analysis(rounds) {
  const sorted = sortRounds(rounds);

  const holes = Object.keys(courses)
    .flatMap((courseKey) => {
      const rs = sorted.filter(
        (r) => r.courseKey === courseKey
      );

      return courses[courseKey].holes.map((h, i) => {
        const a = avg(rs.map((r) => r.holes?.[i]));

        return {
          ...h,
          courseKey,
          avg: a,
          overPar: a - h.par,
          rounds: rs.length,
        };
      });
    })
    .filter((h) => h.rounds);

  return {
    sorted,
    latest: sorted[0],
    weakness: [...holes]
      .sort((a, b) => b.overPar - a.overPar)[0],

    trend:
      sorted.length > 3
        ? avg(sorted.slice(3, 6).map((r) => r.total)) -
          avg(sorted.slice(0, 3).map((r) => r.total))
        : 0,
  };
}
