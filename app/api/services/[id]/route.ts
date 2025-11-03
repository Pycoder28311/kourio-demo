import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> } // params is a Promise
) {
  const params = await context.params; // unwrap the Promise
  const id = Number(params.id);

  if (isNaN(id)) return new Response("Invalid ID", { status: 400 });

  const { name, price, durationMinutes } = await req.json();

  try {
    const service = await prisma.service.update({
      where: { id },
      data: { name, price, durationMinutes },
    });
    return NextResponse.json(service);
  } catch (err) {
    console.error("Error updating service:", err);
    return new Response("Service not found or update failed", { status: 404 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> } // params is a Promise
) {
  const params = await context.params;
  const id = Number(params.id);

  if (isNaN(id)) return new Response("Invalid ID", { status: 400 });

  try {
    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting service:", err);
    return new Response("Service not found or delete failed", { status: 404 });
  }
}
