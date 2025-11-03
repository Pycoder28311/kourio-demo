import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";

export async function GET() {
  const servicesCategory = await prisma.serviceCategory.findMany({
    include: {
      services: true, // include the child services
    },
  });
  return NextResponse.json(servicesCategory);
}

export async function POST(req: Request) {
  const { name } = await req.json();
  const serviceCategory = await prisma.serviceCategory.create({ data: { name } });
  return NextResponse.json(serviceCategory);
}
