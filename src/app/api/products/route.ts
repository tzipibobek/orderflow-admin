import { prisma } from "@/modules/shared/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const includeInactive = url.searchParams.get("includeInactive") === "1";

  type Args = NonNullable<Parameters<typeof prisma.product.findMany>[0]>;
  type Where = Args["where"];
  type OrderBy = NonNullable<Args["orderBy"]>;

  const where: Where = includeInactive ? undefined : { isActive: true };
  const orderBy: OrderBy = includeInactive
    ? [{ isActive: "desc" as const }, { createdAt: "asc" as const }]
    : [{ createdAt: "asc" as const }];

  const products = await prisma.product.findMany({
    where,
    orderBy,
    select: { id: true, name: true, price: true, isActive: true, createdAt: true },
  });

  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const body = (await req.json()) as { name: string; price: number; isActive?: boolean };

  if (!body?.name) return NextResponse.json({ error: "Name required" }, { status: 400 });
  if (typeof body.price !== "number") {
    return NextResponse.json({ error: "Price must be a number" }, { status: 400 });
  }

  const created = await prisma.product.create({
    data: {
      name: body.name,
      price: Math.round(body.price),
      isActive: body.isActive ?? true,
    },
    select: { id: true, name: true, price: true, isActive: true, createdAt: true },
  });

  return NextResponse.json(created, { status: 201 });
}
