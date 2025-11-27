"use client";
import { money } from "@/modules/shared/lib/format";

export function Balance({ value, className = "" }: { value: number | string; className?: string }) {
  const n = typeof value === "number" ? value : Number(value ?? 0);
  const meta =
    n > 0  ? { color: "text-red-600",     title: "Customer owes money" } :
    n < 0  ? { color: "text-emerald-700", title: "Balance in favor of customer" } :
             { color: "text-slate-700",   title: "No debt" };


  return (
    <span className={`font-semibold tabular-nums ${meta.color}`} title={meta.title} aria-label={meta.title}>
      {money(n)}
    </span>
  );
}
