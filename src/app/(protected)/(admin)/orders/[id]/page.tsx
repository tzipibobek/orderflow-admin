import { notFound } from "next/navigation";

import { prisma } from "@/modules/shared/lib/prisma";
import { money } from "@/modules/shared/lib/format";
import { cls } from "@/modules/shared/lib/api";
import { fmtDate, t } from "@/modules/shared/i18n";

import BackButton from "@/modules/shared/ui/atoms/BackButton";

export default async function OrderDetailPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isFinite(orderId)) notFound();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      customer: true,
      items: { include: { product: true } },
    },
  });
  if (!order) notFound();

  const unitsCount = order.items.reduce((s, it) => s + it.quantity, 0);
  const varietiesCount = order.items.length;

  const whenLabel =
    order.status === "DELIVERED" ? t("delivered") :
      order.status === "CANCELLED" ? t("cancelled") : t("createdAt");

  const whenDate: Date | string =
    order.status === "DELIVERED"
      ? (order.deliveredAt ?? order.createdAt)
      : order.status === "CANCELLED"
        ? ((order as any).cancelledAt ?? (order as any).updatedAt ?? order.createdAt)
        : order.createdAt;

  return (
    <section className="mx-auto max-w-5xl px-3 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className={`${cls.h1} truncate`}>{t("order")} · #{order.id}</h1>
        <BackButton />
      </div>

      {/* Summary */}
      <div className="rounded-lg bg-white shadow-sm border p-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {/* Customer */}
          <div className="col-span-1 sm:col-span-2 min-w-0">
            <div className="text-xs text-slate-500">{t("customer")}</div>
            <div className="mt-1 font-medium truncate">
              {order.customer?.name ?? `#${order.customerId}`}
            </div>
            <div className="text-xs text-slate-500 truncate">
              {order.customer?.address ?? "—"}
            </div>
          </div>

          {/* Total */}
          <div className="col-span-1 sm:col-span-1 text-right">
            <div className="text-xs text-slate-500">{t("total")}</div>
            <div className="mt-1 text-lg font-semibold tabular-nums">
              {money(order.total)}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {unitsCount} {unitsCount === 1 ? t("itemSingular") : t("items")}
            </div>
          </div>

          {/* Status */}
          <div className="col-span-2 sm:col-span-1">
            <div className="text-xs text-slate-500">{t("status")}</div>
            <span
              className={`mt-1 inline-block px-2 py-0.5 rounded text-xs ${order.status === "DELIVERED"
                ? "bg-green-100 text-green-700"
                : order.status === "TO_DELIVER"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-slate-200 text-slate-700"
                }`}
            >
              {order.status === "DELIVERED" ? t("delivered") :
                order.status === "TO_DELIVER" ? t("toDeliver") :
                  t("cancelled")}
            </span>
            <div className="text-xs text-slate-500 mt-1">
              {whenLabel}: {fmtDate(whenDate)}
            </div>
          </div>
        </div>
      </div>

      {/* Items title */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">{t("items")}</h2>
        <span className="text-xs text-slate-500">{varietiesCount} {t("total")}</span>
      </div>

      {/* Items — MOBILE */}
      <ul className="md:hidden space-y-2">
        {order.items.map((it) => (
          <li key={it.id} className="rounded-lg bg-white shadow-sm border p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-medium truncate">
                  {it.product?.name ?? `#${it.productId}`}
                </div>
                <div className="text-xs text-slate-500">
                  {t("unit")}: {money(it.unitPrice)}
                </div>
              </div>
              <div className="text-right">
                <div className="tabular-nums">{t("qty")}: {it.quantity}</div>
                <div className="font-semibold tabular-nums">
                  {money(Number(it.unitPrice) * it.quantity)}
                </div>
              </div>
            </div>
          </li>
        ))}
        {order.items.length === 0 && (
          <li className="rounded-lg bg-white shadow-sm border p-4 text-center text-slate-500">
            {t("noItems")}
          </li>
        )}
      </ul>

      {/* Items — DESKTOP */}
      <div className="hidden md:block">
        <div className="rounded-lg bg-white shadow-sm border overflow-hidden">
          <table className="w-full table-fixed text-sm">
            <colgroup>
              {[
                {},
                { className: "w-[80px]" },
                { className: "w-[120px]" },
                { className: "w-[140px]" },
              ].map((p, i) => <col key={i} {...p} />)}
            </colgroup>
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="py-2.5 px-4 text-left font-semibold">{t("product")}</th>
                <th className="py-2.5 px-4 text-left font-semibold">{t("qty")}</th>
                <th className="py-2.5 px-4 text-right font-semibold">{t("unit")}</th>
                <th className="py-2.5 px-4 text-right font-semibold">{t("lineTotal")}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {order.items.map((it) => (
                <tr key={it.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 whitespace-normal break-words">
                    {it.product?.name ?? `#${it.productId}`}
                  </td>
                  <td className="py-2.5 px-4 tabular-nums">{it.quantity}</td>
                  <td className="py-2.5 px-4 text-right tabular-nums">
                    {money(it.unitPrice)}
                  </td>
                  <td className="py-2.5 px-4 text-right font-medium tabular-nums">
                    {money(Number(it.unitPrice) * it.quantity)}
                  </td>
                </tr>
              ))}
              {order.items.length === 0 && (
                <tr>
                  <td className="py-6 px-4 text-center text-slate-500" colSpan={4}>
                    {t("noItems")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
