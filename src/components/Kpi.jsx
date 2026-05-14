import React from "react";
import Card from "./Card";

export default function Kpi({
  icon,
  label,
  value,
  sub,
}) {
  return (
    <Card className="min-h-[160px]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-800">
          {icon}
        </div>

        <div className="text-sm font-bold text-slate-700">
          {label}
        </div>
      </div>

      <div className="mt-5 text-4xl font-bold">
        {value}
      </div>

      {sub && (
        <div className="mt-3 text-sm font-medium text-slate-500">
          {sub}
        </div>
      )}
    </Card>
  );
}
