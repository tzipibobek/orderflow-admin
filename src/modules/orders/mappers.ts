import type { OrderRow } from "./components/OrderTable";
import type { Order, OrderItem } from "@prisma/client";

export function mapOrderToRow(o: Order & { items: Pick<OrderItem, "quantity">[] }): OrderRow {
    return {
        id: o.id,
        status: o.status as OrderRow["status"],
        createdAt: o.createdAt,
        deliveredAt: o.deliveredAt,
        items: o.items.map(it => ({ quantity: it.quantity })),
        total: o.total,
    };
}
