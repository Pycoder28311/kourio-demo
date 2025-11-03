import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // params is a Promise
) {
  try {
    const { id } = await params; 

    if (isNaN(Number(id))) {
      return new Response("Invalid ID", { status: 400 });
    }

    const { name, experience, bio } = await req.json();

    const barber = await prisma.barber.update({
      where: { id: Number(id) },
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
  { params }: { params: Promise<{ id: string }> } // params is a Promise
) {
  try {
    const { id } = await params; 

    if (isNaN(Number(id))) {
      return new Response("Invalid ID", { status: 400 });
    }
    
    await prisma.barber.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting barber:", err);
    return new Response("Barber not found or delete failed", { status: 404 });
  }
}