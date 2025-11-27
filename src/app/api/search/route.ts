import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/modules/shared/lib/prisma";
import { Prisma, OrderStatus } from "@prisma/client";
import { t } from "@/modules/shared/i18n";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  const limit = Math.min(Number(searchParams.get("limit") || 8), 12);
  if (!q) return NextResponse.json({ hits: [] });

  const customers = await prisma.customer.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: Prisma.QueryMode.insensitive } },
        { address: { contains: q, mode: Prisma.QueryMode.insensitive } },
      ],
    },
    take: limit,
    orderBy: { id: "desc" },
  });

  const maybeId = Number(q.replace(/^#/, ""));
  const isNumericId = Number.isInteger(maybeId) && maybeId > 0;

  const enumValues = Object.values(OrderStatus) as string[];
  const upper = q.toUpperCase();
  const statusIsValid = enumValues.includes(upper);

  const orders = await prisma.order.findMany({
    where: {
      OR: [
        isNumericId ? { id: maybeId } : undefined,
        {
          customer: {
            is: { name: { contains: q, mode: Prisma.QueryMode.insensitive } },
          },
        },
        statusIsValid ? ({ status: upper as OrderStatus } as Prisma.OrderWhereInput) : undefined,
      ].filter(Boolean) as Prisma.OrderWhereInput[],
    },
    include: { customer: true },
    take: limit,
    orderBy: { id: "desc" },
  });

  const products = await prisma.product.findMany({
    where: {
      OR: [{ name: { contains: q, mode: Prisma.QueryMode.insensitive } }],
    },
    take: limit,
    orderBy: { id: "desc" },
  });

  const statusLabel = (s?: OrderStatus) => {
    if (!s) return "";
    if (s === "DELIVERED") return t("delivered");
    if (s === "CANCELLED") return t("cancelled");
    if (s === "TO_DELIVER") return t("toDeliver");
    return s;
  };

  const hits = [
    ...customers.map((c) => ({
      id: String(c.id),
      kind: "customer" as const,
      title: c.name,
      subtitle: [c.address].filter(Boolean).join(" • "),
      href: `/customers/${c.id}`,
    })),
    ...orders.map((o) => ({
      id: String(o.id),
      kind: "order" as const,
      title: `${t("order")} #${o.id}`,
      subtitle: statusLabel(o.status),
      href: `/orders/${o.id}`,
    })),
    ...products.map((p) => ({
      id: String(p.id),
      kind: "product" as const,
      title: p.name,
      subtitle: (p as any).sku ?? undefined,
      href: `/products/${p.id}`,
    })),
  ].slice(0, limit * 3);

  return NextResponse.json({ hits });
}