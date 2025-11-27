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

    const customer = await prisma.customer.findUnique({ where: { id } });
    if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(customer);
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const id = toId(idStr);
    const body = await req.json();

    const updated = await prisma.customer.update({
      where: { id },
      data: {
        ...(typeof body.name === "string" ? { name: body.name } : {}),
        ...(typeof body.address === "string" ? { address: body.address } : {}),
        ...(body.accountBalance !== undefined
          ? { accountBalance: typeof body.accountBalance === "string" ? parseInt(body.accountBalance) : body.accountBalance }
          : {}),
      },
    });
    return NextResponse.json(updated);
  } catch (e: any) {
    if (e?.code === "P2025") return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ error: "Failed to update customer" }, { status: 400 });
  }
}
