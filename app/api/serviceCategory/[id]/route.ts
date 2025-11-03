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

    const { name } = await req.json();

    const serviceCategory = await prisma.serviceCategory.update({
      where: { id: Number(id) },
      data: { name },
    });
    return NextResponse.json(serviceCategory);
  } catch (err) {
    console.error("Error updating service:", err);
    return new Response("Service not found or update failed", { status: 404 });
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

    const deleted = await prisma.serviceCategory.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true, deleted });
  } catch (err) {
    console.error("Error deleting service:", err);
    return new Response("Service not found or delete failed", { status: 404 });
  }
}
