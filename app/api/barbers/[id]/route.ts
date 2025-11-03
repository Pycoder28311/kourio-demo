import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params; // <-- unwrap the Promise
  const id = Number(params.id);

  if (isNaN(id)) return new Response("Invalid ID", { status: 400 });

  const { name, experience, bio } = await req.json();

  try {
    const barber = await prisma.barber.update({
      where: { id },
      data: { name, experience, bio },
    });
    return NextResponse.json(barber);
  } catch (err) {
    console.error("Error updating barber:", err);
    return new Response("Barber not found or update failed", { status: 404 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> } // params is now a Promise
) {
  const params = await context.params; // unwrap the Promise
  const id = Number(params.id);

  if (isNaN(id)) {
    return new Response("Invalid ID", { status: 400 });
  }

  try {
    await prisma.barber.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting barber:", err);
    return new Response("Barber not found or delete failed", { status: 404 });
  }
}