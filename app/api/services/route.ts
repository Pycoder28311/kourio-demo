import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";

export async function GET() {
  const services = await prisma.service.findMany();
  return NextResponse.json(services);
}

export async function POST(req: Request) {
  const { name, price, durationMinutes } = await req.json();
  const service = await prisma.service.create({ data: { name, price, durationMinutes, categoryId: 1 } });
  return NextResponse.json(service);
}
