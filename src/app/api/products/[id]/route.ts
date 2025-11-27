import { prisma } from "@/modules/shared/lib/prisma";
import { NextResponse } from "next/server";

function toId(v: string) {
  const id = Number(v);
  if (!Number.isFinite(id)) throw new Error("Invalid id");
  return id;
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const id = toId(idStr);
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const id = toId(idStr);
    const body = await req.json();

    const data: any = {};
    if (typeof body.name === "string") data.name = body.name;
    if (body.price !== undefined) data.price = Math.round(Number(body.price));
    if (typeof body.isActive === "boolean") data.isActive = body.isActive;

    const updated = await prisma.product.update({
      where: { id },
      data,
    });
    return NextResponse.json(updated);
  } catch (e: any) {
    if (e?.code === "P2025") return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ error: "Failed to update product" }, { status: 400 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const id = toId(idStr);
    const body = (await req.json().catch(() => ({}))) as { isActive?: boolean };
    if (typeof body.isActive !== "boolean") {
      return NextResponse.json({ error: "isActive boolean required" }, { status: 400 });
    }
    const updated = await prisma.product.update({
      where: { id },
      data: { isActive: body.isActive },
      select: { id: true, name: true, price: true, isActive: true, createdAt: true },
    });
    return NextResponse.json(updated);
  } catch (e: any) {
    if (e?.code === "P2025") return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ error: "Failed to update product" }, { status: 400 });
  }
}
