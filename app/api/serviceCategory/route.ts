import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";

export async function GET() {
  const servicesCategory = await prisma.serviceCategory.findMany({
    include: {
      services: true, // include the child services
    },
    orderBy: { position: "asc" },
  });
  return NextResponse.json(servicesCategory);
}

export async function POST(req: Request) {
  const { name, position } = await req.json();
  console.log(position)
  const serviceCategory = await prisma.serviceCategory.create({ data: { name, position } });
  return NextResponse.json(serviceCategory);
}
