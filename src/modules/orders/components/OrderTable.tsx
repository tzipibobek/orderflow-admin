"use client";

import Link from "next/link";

import ResponsiveTable, { Column } from "@/modules/shared/ui/tables/ResponsiveTable";

import { money } from "@/modules/shared/lib/format";
import { fmtDate, t } from "@/modules/shared/i18n";

export type OrderRow = {
  id: number;
  status: "DELIVERED" | "TO_DELIVER" | "CANCELLED";
  createdAt: string | Date;
  deliveredAt: string | Date | null;
  items: { quantity: number }[];
  total: number | string;
};

const columns: Column<OrderRow>[] = [
  {
    header: t("order"),
    render: (o) => (
      <Link href={`/orders/${o.id}`} className="text-blue-600 hover:underline">
        #{o.id}
      </Link>
    ),
  },
  {
    header: t("status"),
    render: (o) => {
      const label =
        o.status === "DELIVERED" ? t("delivered") :
          o.status === "TO_DELIVER" ? t("toDeliver") :
            t("cancelled");
      const cls =
        o.status === "DELIVERED" ? "bg-green-100 text-green-700" :
          o.status === "TO_DELIVER" ? "bg-yellow-100 text-yellow-700" :
            "bg-slate-200 text-slate-700";
      return <span className={`px-2 py-0.5 rounded text-xs ${cls}`}>{label}</span>;
    },
  },
  { header: t("date"), render: (o) => fmtDate(o.deliveredAt ?? o.createdAt) },
  {
    header: t("items"),
    align: "right",
    render: (o) => <span className="tabular-nums">{o.items.reduce((s, it) => s + it.quantity, 0)}</span>,
  },
  {
    header: t("total"),
    align: "right",
    render: (o) => <span className="tabular-nums">{money(o.total)}</span>,
  },
];

export default function OrderTable({ rows }: { rows: OrderRow[] }) {
  return (
    <ResponsiveTable<OrderRow>
      rows={rows}
      getKey={(o) => o.id}
      columns={columns}
      empty={t("noOrdersYet")}
      renderCard={(o) => {
        const label =
          o.status === "DELIVERED" ? t("delivered") :
            o.status === "TO_DELIVER" ? t("toDeliver") :
              t("cancelled");
        const cls =
          o.status === "DELIVERED" ? "bg-green-100 text-green-700" :
            o.status === "TO_DELIVER" ? "bg-yellow-100 text-yellow-700" :
              "bg-slate-200 text-slate-700";

        return (
          <div className="p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link href={`/orders/${o.id}`} className="text-blue-700 hover:underline">
                  #{o.id}
                </Link>
                <div className="text-xs text-slate-500">
                  {fmtDate(o.deliveredAt ?? o.createdAt)} · {o.items.reduce((s, it) => s + it.quantity, 0)} {t("items").toLowerCase()}
                </div>
              </div>
              <div className="text-right">
                <span className={`px-2 py-0.5 rounded text-xs ${cls}`}>{label}</span>
                <div className="mt-1 font-semibold tabular-nums">{money(o.total)}</div>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
