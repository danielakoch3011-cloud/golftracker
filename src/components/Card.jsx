import React from "react";

const cn = (...x) => x.filter(Boolean).join(" ");

export default function Card({
  children,
  className = "",
}) {
  return (
    <section
      className={cn(
        "rounded-[1.35rem] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.04)]",
        className
      )}
    >
      {children}
    </section>
  );
}
