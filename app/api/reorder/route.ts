import { NextRequest, NextResponse } from "next/server";
import prisma from "../../lib/prisma";

// Type for request payload
interface UpdatePosition {
  id: number;
  position: number;
}

/**
 * Generic function to update positions for any table
 * @param tableName - the Prisma model name as a key of prisma
 * @param items - array of objects with { id, position }
 */
async function updatePositions(
  tableName: keyof typeof prisma,
  items: UpdatePosition[]
) {
  await Promise.all(
    items.map((item) =>
      (prisma[tableName] as any).update({
        where: { id: item.id },
        data: { position: item.position },
      })
    )
  );
}

// Next.js API route
export async function PUT(req: NextRequest) {
  try {
    const { table, positions }: { table: string; positions: UpdatePosition[] } =
      await req.json();

    if (!table || !Array.isArray(positions)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Call generic update function
    await updatePositions(table as keyof typeof prisma, positions);

    return NextResponse.json(
      { message: `${table} positions updated successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update positions" }, { status: 500 });
  }
}
