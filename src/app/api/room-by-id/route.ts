import { dbconnect } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const prisma = await dbconnect();
  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get("roomId");

  //TODO: check the security and loop holes in this end point

  if (!roomId) {
    return NextResponse.json(
      { success: false, message: "Room ID is required" },
      { status: 400 },
    );
  }

  try {
    const room = await prisma.rooms.findUnique({
      where: {
        id: roomId,
      },
      include: {
        members: true,
      },
    });

    if (!room) {
      return NextResponse.json(
        { success: false, message: "Room not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, room }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error getting room" },
      { status: 500 },
    );
  }
}
