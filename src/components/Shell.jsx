import React from "react";

const cn = (...x) => x.filter(Boolean).join(" ");

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

export default function Shell({
  tab,
  setTab,
  children,
}) {
  const active =
    modules.find(([id]) => id === tab)?.[1] ||
    "Übersicht";

  return (
    <div className="min-h-screen bg-[#f7f8f5] text-[#101418] antialiased">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[268px] border-r border-slate-200 bg-white px-5 py-7 lg:flex lg:flex-col">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-2xl text-emerald-800">
            ⚑
          </div>

          <div className="text-2xl font-bold">
            GolfTrack
          </div>
        </div>

        <nav className="mt-10 space-y-2">
          {modules.map(([id, label, icon]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                "flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left text-[15px] font-semibold transition",
                tab === id
                  ? "bg-emerald-50 text-emerald-900 ring-1 ring-emerald-100"
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <span className="w-5 text-xl">
                {icon}
              </span>

              {label}
            </button>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            System Status
          </div>

          <div className="mt-2 flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

            <div className="text-sm font-bold">
              UNICORN AI ONLINE
            </div>
          </div>
        </div>
      </aside>

      <main className="pb-24 lg:ml-[268px] lg:pb-0">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-2xl">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 md:px-8">
            <div>
              <h1 className="text-2xl font-bold">
                Hallo Dani! 👋
              </h1>

              <p className="mt-1 text-sm font-medium text-slate-500">
                Hier ist deine {active} Performance Übersicht.
              </p>
            </div>

            <button
              onClick={() => setTab("round")}
              className="hidden rounded-xl bg-emerald-800 px-6 py-3 text-sm font-bold text-white md:block"
            >
              + Runde hinzufügen
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-[1440px] px-5 py-6 md:px-8 md:py-8">
          {children}
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white p-2 lg:hidden">
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${modules.length},1fr)`,
          }}
        >
          {modules.map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                "rounded-xl px-1 py-3 text-[10px] font-bold",
                tab === id
                  ? "bg-emerald-800 text-white"
                  : "text-slate-500"
              )}
            >
              {label.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
