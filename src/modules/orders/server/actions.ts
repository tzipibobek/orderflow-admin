"use server";
import { prisma } from "@/modules/shared/lib/prisma";
import type { Prisma, OrderStatus } from "@prisma/client";

function calcTotal(items: { quantity: number; unitPrice: number }[]) {
  return items.reduce((s, it) => s + it.quantity * it.unitPrice, 0);
}
function toInt(n: unknown) {
  const x = Number(n);
  if (!Number.isFinite(x)) throw new Error("Invalid number");
  return Math.floor(x);
}

export async function createOrder(data: {
  customerId: number;
  status?: Exclude<OrderStatus, "CANCELLED">;
  items: { productId: number; quantity: number }[];
}) {
  if (!data.items?.length) throw new Error("Items required");

  const ids = data.items.map((i) => i.productId);
  const prods = await prisma.product.findMany({
    where: { id: { in: ids }, isActive: true },
    select: { id: true, price: true },
  });
  if (prods.length !== ids.length) {
    throw new Error("Some products are inactive or missing");
  }

  const items = data.items.map((it) => {
    const p = prods.find((x) => x.id === it.productId)!;
    return { productId: it.productId, quantity: toInt(it.quantity), unitPrice: p.price };
  });

  const status: OrderStatus = (data.status ?? "TO_DELIVER") as OrderStatus;
  const total = calcTotal(items);

  return prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        customerId: data.customerId,
        status,
        total,
        deliveredAt: status === "DELIVERED" ? new Date() : null,
        items: { create: items },
      },
      include: { customer: true, items: { include: { product: true } } },
    });

    if (status === "DELIVERED") {
      await tx.customer.update({
        where: { id: data.customerId },
        data: { accountBalance: { increment: total } },
      });
    }
    return created;
  });
}

export async function patchOrderStatus(id: number, next: OrderStatus) {
  return prisma.$transaction(async (tx) => {
    const prev = await tx.order.findUnique({
      where: { id },
      select: { id: true, status: true, total: true, customerId: true },
    });
    if (!prev) throw Object.assign(new Error("Not found"), { code: "P2025" });

    if (prev.status !== next) {
      if (prev.status === "TO_DELIVER" && next === "DELIVERED") {
        await tx.customer.update({ where: { id: prev.customerId }, data: { accountBalance: { increment: prev.total } } });
      }
      if (prev.status === "DELIVERED" && next === "TO_DELIVER") {
        await tx.customer.update({ where: { id: prev.customerId }, data: { accountBalance: { decrement: prev.total } } });
      }
      if (prev.status === "DELIVERED" && next === "CANCELLED") {
        await tx.customer.update({ where: { id: prev.customerId }, data: { accountBalance: { decrement: prev.total } } });
      }
      if (prev.status === "CANCELLED" && next === "DELIVERED") {
        await tx.customer.update({ where: { id: prev.customerId }, data: { accountBalance: { increment: prev.total } } });
      }
    }

    return tx.order.update({
      where: { id },
      data: {
        status: next,
        deliveredAt: next === "DELIVERED" ? new Date() : null,
        cancelledAt: next === "CANCELLED" ? new Date() : null,
      },
      include: { customer: true, items: { include: { product: true } } },
    });
  });
}

export async function putOrder(id: number, body: {
  customerId: number;
  status: Exclude<OrderStatus, "CANCELLED">;
  items: { productId: number; quantity: number; unitPrice: number }[];
}) {
  const newTotal = calcTotal(body.items.map(it => ({
    quantity: toInt(it.quantity),
    unitPrice: toInt(it.unitPrice),
  })));

  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const prev = await tx.order.findUnique({
      where: { id },
      select: { id: true, status: true, total: true, customerId: true },
    });
    if (!prev) throw Object.assign(new Error("Not found"), { code: "P2025" });

    if (prev.status === "DELIVERED") {
      if (body.status === "DELIVERED") {
        if (prev.customerId === body.customerId) {
          const diff = newTotal - prev.total;
          if (diff !== 0) {
            await tx.customer.update({
              where: { id: prev.customerId },
              data: { accountBalance: { increment: diff } },
            });
          }
        } else {
          await tx.customer.update({
            where: { id: prev.customerId },
            data: { accountBalance: { decrement: prev.total } },
          });
          await tx.customer.update({
            where: { id: body.customerId },
            data: { accountBalance: { increment: newTotal } },
          });
        }
      } else {
        await tx.customer.update({
          where: { id: prev.customerId },
          data: { accountBalance: { decrement: prev.total } },
        });
      }
    } else {
      if (body.status === "DELIVERED") {
        await tx.customer.update({
          where: { id: body.customerId },
          data: { accountBalance: { increment: newTotal } },
        });
      }
    }

    await tx.orderItem.deleteMany({ where: { orderId: id } });
    await tx.orderItem.createMany({
      data: body.items.map((it) => ({
        orderId: id,
        productId: toInt(it.productId),
        quantity: toInt(it.quantity),
        unitPrice: toInt(it.unitPrice),
      })),
    });

    return tx.order.update({
      where: { id },
      data: {
        customerId: toInt(body.customerId),
        status: body.status,
        total: newTotal,
        deliveredAt: body.status === "DELIVERED" ? new Date() : null,
        cancelledAt: null,
      },
      include: { customer: true, items: { include: { product: true } } },
    });
  });
}

export async function deleteOrder(id: number) {
  await prisma.orderItem.deleteMany({ where: { orderId: id } });
  return prisma.order.delete({ where: { id } });
}
