import { dbconnect } from "@/lib/prisma";
import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function POST(req: NextRequest, res: NextResponse) {
  const { roomId } = await req.json();
  const prisma = await dbconnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!roomId) {
    return NextResponse.json(
      { success: false, message: "Room ID is required" },
      { status: 400 }
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
        { status: 404 }
      );
    }

    if (room.ownerId === Number(user.id)) {
      return NextResponse.json(
        { success: false, message: "You are the owner of this room" },
        { status: 403 }
      );
    }

    if (room.members.find((member) => member.id === Number(user.id))) {
      return NextResponse.json(
        { success: false, message: "You are already a member of this room" },
        { status: 403 }
      );
    }

    const updatedRoom = await prisma.rooms.update({
      where: {
        id: roomId,
      },
      data: {
        members: {
          connect: {
            id: Number(user.id),
          },
        },
      },
    });

    if (!updatedRoom) {
      return NextResponse.json(
        { success: false, message: "Failed to join room" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, room: updatedRoom });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to join room" },
      { status: 500 }
    );
  }
}
