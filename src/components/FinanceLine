import React from "react";

const cn = (...x) => x.filter(Boolean).join(" ");
const eur = (v) => `${Math.round(Number(v) || 0)}€`;

export default function FinanceLine({ label, value, strong = false }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div
        className={cn(
          "text-sm font-semibold",
          strong ? "text-slate-950" : "text-slate-600"
        )}
      >
        {label}
      </div>

      <div
        className={cn(
          "font-bold",
          strong ? "text-2xl text-emerald-900" : "text-slate-800"
        )}
      >
        {eur(value)}
      </div>
    </div>
  );
}
