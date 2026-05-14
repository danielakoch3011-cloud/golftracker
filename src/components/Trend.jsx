import React from "react";
import {
  Area,
  AreaChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function Trend({
  data,
  area = false,
  domain,
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      {area ? (
        <AreaChart
          data={data}
          margin={{ left: 4, right: 16, top: 8, bottom: 4 }}
        >
          <defs>
            <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#166534" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#166534" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <XAxis dataKey="round" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
          <YAxis domain={domain} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
          <Tooltip contentStyle={{ borderRadius: 14, border: "1px solid #e2e8f0", fontSize: 12 }} />

          <Area
            type="monotone"
            dataKey="score"
            stroke="#166534"
            strokeWidth={2.5}
            fill="url(#fill)"
          />
        </AreaChart>
      ) : (
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="score"
            stroke="#166534"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      )}
    </ResponsiveContainer>
  );
}
