"use server";
import { prisma } from "@/modules/shared/lib/prisma";
import { OrderStatus, type Prisma } from "@prisma/client";

type ListOpts = { includeAll?: boolean; showCanceled?: boolean };

export async function listOrders(opts: ListOpts = {}) {
  if (opts.includeAll) {
    return prisma.order.findMany({
      include: { customer: true, items: { include: { product: true } } },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    });
  }

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const andClauses: Prisma.OrderWhereInput[] = [
    {
      OR: [
        { status: OrderStatus.TO_DELIVER },
        { status: OrderStatus.DELIVERED, deliveredAt: { gte: since } },
      ],
    },
  ];
  if (!opts.showCanceled) {
    andClauses.push({ status: { not: OrderStatus.CANCELLED } });
  }

  const where: Prisma.OrderWhereInput = { AND: andClauses };

  return prisma.order.findMany({
    where,
    include: { customer: true, items: { include: { product: true } } },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });
}

export async function getOrderById(id: number) {
  return prisma.order.findUnique({
    where: { id },
    include: { customer: true, items: { include: { product: true } } },
  });
}
