import { notFound } from "next/navigation";

import { prisma } from "@/modules/shared/lib/prisma";
import { money } from "@/modules/shared/lib/format";
import { cls } from "@/modules/shared/lib/api";
import { t, fmtDate } from "@/modules/shared/i18n";

import BackButton from "@/modules/shared/ui/atoms/BackButton";

import { OrderTable, type OrderRow } from "@/modules/orders/components";
import { mapOrderToRow } from "@/modules/orders/mappers";

export default async function CustomerDetailPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const idNum = Number(id);
  if (!Number.isFinite(idNum)) notFound();

  const customer = await prisma.customer.findUnique({
    where: { id: idNum },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { items: true },
      },
    },
  });
  if (!customer) notFound();

  const rows: OrderRow[] = customer.orders.map(mapOrderToRow);

  return (
    <section className="mx-auto max-w-5xl px-3 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className={cls.h1}>{t("customer")} · {customer.name}</h1>
        <BackButton />
      </div>

      {/* Summary */}
      <div className="rounded-lg bg-white shadow-sm border p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <div className="text-xs text-slate-500">{t("address")}</div>
          <div className="mt-1">{customer.address}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">{t("balanceDebt")}</div>
          <div
            className={`mt-1 font-semibold tabular-nums ${Number(customer.accountBalance) > 0 ? "text-red-700" : "text-green-700"
              }`}
          >
            {money(customer.accountBalance)}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500">{t("created")}</div>
          <div className="mt-1">{fmtDate(customer.createdAt)}</div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="flex items-center justify-between mt-2">
        <h2 className="text-sm font-semibold text-slate-700">{t("orders")}</h2>
        <span className="text-xs text-slate-500">{rows.length} {t("total")}</span>
      </div>

      <OrderTable rows={rows} />
    </section>
  );
}
