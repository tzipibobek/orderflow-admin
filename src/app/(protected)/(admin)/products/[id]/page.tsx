import { notFound } from "next/navigation";

import { prisma } from "@/modules/shared/lib/prisma";
import { money } from "@/modules/shared/lib/format";
import { cls } from "@/modules/shared/lib/api";
import { t, fmtDate } from "@/modules/shared/i18n";

import BackButton from "@/modules/shared/ui/atoms/BackButton";

import { OrderTable, type OrderRow } from "@/modules/orders/components";
import { mapOrderToRow } from "@/modules/orders/mappers";

export default async function ProductDetailPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idNum = Number(id);
  if (!Number.isFinite(idNum)) notFound();

  const product = await prisma.product.findUnique({
    where: { id: idNum },
    include: {
      orderItems: {
        include: { order: { include: { items: true } } },
        orderBy: { id: "desc" },
        take: 20,
      },
    },
  });
  if (!product) notFound();

  const totalUnits = product.orderItems.reduce((s, it) => s + it.quantity, 0);
  const totalRevenue = product.orderItems.reduce(
    (s, it) => s + it.quantity * Number(it.unitPrice),
    0
  );

  const uniqueOrders = Array.from(
    new Map(product.orderItems.map(oi => [oi.order.id, oi.order])).values()
  );

  const rows: OrderRow[] = uniqueOrders.map(mapOrderToRow);

  return (
    <section className="mx-auto max-w-5xl px-3 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className={cls.h1}>{t("product")} · {product.name}</h1>
        <BackButton />
      </div>

      {/* Summary card */}
      <div className="rounded-lg bg-white shadow-sm border p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <div className="text-xs text-slate-500">{t("status")}</div>
          <div className="mt-1">
            <span className={`px-2 py-0.5 rounded text-xs ${product.isActive ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-700"
              }`}>
              {product.isActive ? t("active") : t("inactive")}
            </span>
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500">{t("price")}</div>
          <div className="mt-1 font-semibold">{money(product.price)}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">{t("created")}</div>
          <div className="mt-1">{fmtDate(product.createdAt)}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">{t("updated")}</div>
          <div className="mt-1">{fmtDate(product.updatedAt)}</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-white shadow-sm border p-4">
          <div className="text-xs text-slate-500">{t("unitsLast20")}</div>
          <div className="mt-1 text-lg font-semibold tabular-nums">{totalUnits}</div>
        </div>
        <div className="rounded-lg bg-white shadow-sm border p-4">
          <div className="text-xs text-slate-500">{t("revenueLast20")}</div>
          <div className="mt-1 text-lg font-semibold tabular-nums">{money(totalRevenue)}</div>
        </div>
      </div>

      {/* Product's Orders */}
      <div className="flex items-center justify-between mt-2">
        <h2 className="text-sm font-semibold text-slate-700">{t("orders")}</h2>
        <span className="text-xs text-slate-500">{rows.length} {t("total")}</span>
      </div>

      <OrderTable rows={rows} />
    </section>
  );
}
