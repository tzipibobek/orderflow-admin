"use client";

import { cls } from "@/modules/shared/lib/api";
import { money } from "@/modules/shared/lib/format";
import { t } from "@/modules/shared/i18n";

import type { Order } from "@/types";

import { ExpandableItems, OrderStatusBadge, OrderActions } from "./";

import { useRouter } from "next/navigation";

type Props = {
  orders: Order[];
  className?: string;
  cardClassName?: string;
  onToggleDelivered: (o: Order) => void;
  onCancel: (o: Order) => void;
};

export default function OrdersDesktopTable({
  orders,
  className = "hidden xl:block",
  cardClassName = "",
  onToggleDelivered,
  onCancel,
}: Props) {
  const router = useRouter();

  return (
    <div className={className}>
      <div className={`${cls.card} p-0 ${cardClassName}`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[992px] table-auto text-sm bg-white [&_th]:py-2.5 [&_th]:px-4 [&_td]:py-3 [&_td]:px-4">
            <colgroup>
              {[{}, { className: "w-[22%]" }, {}, { style: { width: 120 } }, { style: { width: 110 } }, { style: { width: 160 } }].map((p, i) => (
                <col key={i} {...(p as any)} />
              ))}
            </colgroup>

            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="text-left font-semibold">{t("customer")}</th>
                <th className="text-left font-semibold">{t("address")}</th>
                <th className="text-left font-semibold">{t("items")}</th>
                <th className="text-right font-semibold">{t("total")}</th>
                <th className="text-left font-semibold">{t("status")}</th>
                <th className="text-right font-semibold">{t("actions")}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {orders.length === 0 && (
                <tr>
                  <td className="py-10 text-center text-slate-500" colSpan={6}>
                    {t("noOrdersYet")}
                  </td>
                </tr>
              )}

              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50">
                  <td className="truncate">{o.customer?.name ?? `#${o.customerId}`}</td>
                  <td className="truncate" title={o.customer?.address ?? "—"}>
                    {o.customer?.address ?? "—"}
                  </td>

                  <td className="py-3 align-top">
                    <ExpandableItems items={o.items} />
                  </td>

                  <td className="text-right tabular-nums">{money(o.total)}</td>

                  <td><OrderStatusBadge status={o.status} /></td>

                  <td className="text-right">
                    <OrderActions
                      status={o.status}
                      onToggleDelivered={() => onToggleDelivered(o)}
                      onEdit={() => router.push(`/orders/${o.id}/edit`)}
                      onCancel={() => onCancel(o)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
