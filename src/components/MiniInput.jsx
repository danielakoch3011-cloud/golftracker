import React from "react";

export default function MiniInput({
  label,
  value,
  onChange,
  type = "text",
}) {
  return (
    <label className="rounded-[1.2rem] bg-white p-4 ring-1 ring-slate-200">
      <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
        {label}
      </div>

      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-2xl font-bold outline-none transition focus:border-emerald-500 focus:bg-white"
      />
    </label>
  );
}
