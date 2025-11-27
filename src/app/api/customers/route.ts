import { prisma } from "@/modules/shared/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const customers = await prisma.customer.findMany();
  return NextResponse.json(customers);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({})) as { name?: string; address?: string };
  if (!body.name || !body.address) {
    return NextResponse.json({ error: "Name and address are required" }, { status: 400 });
  }

  const created = await prisma.customer.create({
    data: {
      name: body.name,
      address: body.address,
      accountBalance: 0,
    },
  });

  return NextResponse.json(created, { status: 201 });
}