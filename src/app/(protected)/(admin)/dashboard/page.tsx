import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { createServerClient } from "@supabase/ssr";
import { addDays, startOfDay } from "date-fns";

import { prisma } from "@/modules/shared/lib/prisma";
import { money } from "@/modules/shared/lib/format";
import PageHeader from "@/modules/shared/ui/PageHeader";
import NameLink from "@/modules/shared/ui/atoms/NameLink";
import { isDemo } from "@/modules/shared/config";
import { t } from "@/modules/shared/i18n";


export const runtime = "nodejs";
export const revalidate = 0;

function toNum(x: any) { return Number(x ?? 0); }

export default async function DashboardPage() {
  noStore();

  if (!isDemo) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll() { },
        },
      }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/sign-in");
  }

  const now = new Date();
  const d7 = addDays(now, -7);
  const d30 = addDays(now, -30);
  const today = startOfDay(now);

  const [pendingCount, pendingSum, deliveredTodayCount, revenue7] = await Promise.all([
    prisma.order.count({ where: { status: "TO_DELIVER" } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: "TO_DELIVER" } }),
    prisma.order.count({ where: { status: "DELIVERED", deliveredAt: { gte: today } } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: "DELIVERED", deliveredAt: { gte: d7 } } }),
  ]);

  const topGrouped = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true },
    where: { order: { is: { status: "DELIVERED", deliveredAt: { gte: d30 } } } },
    orderBy: { _sum: { quantity: "desc" } },
    take: 5,
  });

  const productIds = topGrouped.map(g => g.productId);
  const products = productIds.length
    ? await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, price: true },
    })
    : [];

  const nameById = new Map(products.map(p => [p.id, p.name]));
  const topProducts = topGrouped.map(g => ({
    id: g.productId,
    name: nameById.get(g.productId) ?? `#${g.productId}`,
    qty: toNum(g._sum.quantity),
  }));

  const debtors = await prisma.customer.findMany({
    orderBy: { accountBalance: "desc" },
    take: 5,
    select: { id: true, name: true, accountBalance: true, address: true },
  });

  const pendingTotal = toNum(pendingSum._sum.total);
  const revenue7d = toNum(revenue7._sum.total);

  return (
    <section className="space-y-6">
      <PageHeader title={t("dashboard")} add={{ as: "link", href: "/orders/add", label: t("newOrder") }} />
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label={t("pendingOrders")} value={pendingCount} />
        <KpiCard label={t("pendingAmount")} value={money(pendingTotal)} />
        <KpiCard label={t("deliveredToday")} value={deliveredTodayCount} />
        <KpiCard label={t("revenue7d")} value={money(revenue7d)} />
      </div>
      {/* Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel title={t("topProducts")}>
          <ul className="divide-y">
            {topProducts.length === 0 && <li className="py-4 text-sm text-slate-500">{t("noData")}</li>}
            {topProducts.map(p => (
              <li key={p.id} className="py-3 flex items-center justify-between">
                <NameLink href={`/products/${p.id}`} label={p.name} />
                <div className="tabular-nums text-sm text-slate-600">
                  {p.qty} {t(p.qty === 1 ? "itemSingular" : "items")}
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title={t("debtTitle")}>
          <ul className="divide-y">
            {debtors.length === 0 && <li className="py-4 text-sm text-slate-500">{t("noData")}</li>}
            {debtors.map(c => (
              <li key={c.id} className="py-3">
                <div className="flex items-center justify-between">
                  <NameLink href={`/customers/${c.id}`} label={c.name} />
                  <span className={`px-2 py-0.5 rounded text-xs ${toNum(c.accountBalance) > 0 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                    }`}>
                    {money(c.accountBalance)}
                  </span>
                </div>
                <div className="text-xs text-slate-500 truncate">{c.address}</div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </section>
  );
}

function KpiCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg bg-white shadow-sm border p-4">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-lg font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-white shadow-sm border">
      <div className="px-4 py-3 border-b font-medium">{title}</div>
      <div className="p-4">{children}</div>
    </div>
  );
}
