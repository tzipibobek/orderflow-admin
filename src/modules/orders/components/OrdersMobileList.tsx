"use client";

import { cls } from "@/modules/shared/lib/api";
import { money } from "@/modules/shared/lib/format";
import { t } from "@/modules/shared/i18n";

import type { Order } from "@/types";

import { ExpandableItems, OrderStatusBadge, OrderActions } from "./";

import { useRouter } from "next/navigation";

type Props = {
  orders: Order[];
  onToggleDelivered: (o: Order) => void;
  onCancel: (o: Order) => void;
};

export default function OrdersMobileList({ orders, onToggleDelivered, onCancel }: Props) {
  const router = useRouter();

  return (
    <ul className="space-y-3 xl:hidden">
      {orders.length === 0 && (
        <li className={`${cls.card} p-4 text-center text-slate-500`}>{t("noOrdersYet")}</li>
      )}

      {orders.map((o) => (
        <li key={o.id} className={`${cls.card} p-4`}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="font-medium truncate">{o.customer?.name ?? `#${o.customerId}`}</div>
              <div className="text-xs text-slate-500 truncate">{o.customer?.address ?? "—"}</div>
            </div>
            <OrderStatusBadge status={o.status} />
          </div>

          <div className="mt-2 text-sm text-slate-700 select-none">
            <ExpandableItems items={o.items} />
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="font-semibold tabular-nums">{money(o.total)}</div>
            <OrderActions
              status={o.status}
              onToggleDelivered={() => onToggleDelivered(o)}
              onEdit={() => router.push(`/orders/${o.id}/edit`)}
              onCancel={() => onCancel(o)}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
