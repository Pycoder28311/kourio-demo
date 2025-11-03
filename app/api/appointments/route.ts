import { NextResponse } from "next/server";
import prisma from "../../lib/prisma"; // your Prisma client instance

export async function GET() {
  // Return options for the form
  const services = await prisma.service.findMany();
  const barbers = await prisma.barber.findMany();
  return NextResponse.json({ services, barbers });
}

export async function POST(req: Request) {
  try {
    const { serviceId, barberId, date } = await req.json();

    if (!serviceId || !barberId || !date) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        serviceId,
        barberId,
        date: new Date(date),
      },
    });

    return NextResponse.json(appointment);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
