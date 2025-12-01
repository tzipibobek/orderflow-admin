"use client";

import { t } from "@/modules/shared/i18n";

export default function OrderStatusBadge({ status }: { status: "DELIVERED" | "TO_DELIVER" | "CANCELLED" }) {
  const cls =
    status === "DELIVERED"
      ? "bg-green-100 text-green-700"
      : status === "TO_DELIVER"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-slate-200 text-slate-700";

  const label =
    status === "DELIVERED" ? t("delivered") :
      status === "TO_DELIVER" ? t("toDeliver") :
        t("cancelled");

  return <span className={`px-2 py-0.5 rounded text-xs ${cls}`}>{label}</span>;
}
