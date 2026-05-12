export const courses = {
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

export const financeSettings = {
  membershipMonthly: 143,
  rangeBucketPrice: 3.3,
  trainerHour: 48,
};

export const modules = [
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
