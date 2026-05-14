import React from "react";

export default function BarRow({ label, value }) {
  const safeValue = Math.max(
    6,
    Math.min(100, Number(value) || 0)
  );

  return (
    <div>
      <div className="mb-2 flex justify-between text-sm font-semibold text-slate-600">
        <span>{label}</span>
        <span>{Math.round(Number(value) || 0)}%</span>
      </div>

      <div className="h-2 rounded-full bg-slate-100">
        <div
          className="h-2 rounded-full bg-emerald-800"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}
