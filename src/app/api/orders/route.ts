import { NextResponse } from "next/server";
import * as Q from "@/modules/orders/server/queries";
import * as A from "@/modules/orders/server/actions";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const includeAll = url.searchParams.get("includeAll") === "1";
    const showCanceled = url.searchParams.get("showCanceled") === "1";
    const orders = await Q.listOrders({ includeAll, showCanceled });
    return NextResponse.json(orders);
}

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));
        const created = await A.createOrder({
            customerId: Number(body.customerId),
            status: body.status,
            items: Array.isArray(body.items) ? body.items.map((it: any) => ({
                productId: Number(it.productId),
                quantity: Number(it.quantity),
            })) : [],
        });
        return NextResponse.json(created, { status: 201 });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message ?? "Failed to create order" }, { status: 400 });
    }
}
