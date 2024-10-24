import { dbconnect } from "@/lib/prisma";
import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function POST(request: NextRequest) {
  const prisma = await dbconnect();
  const { searchParams } = new URL(request.url);
  const roomId = searchParams.get("roomId");
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!roomId) {
    return NextResponse.json(
      {
        success: false,
        message: "roomId is required",
      },
      {
        status: 400,
      }
    );
  }

  if (!session || !user) {
    return NextResponse.json(
      {
        success: false,
        message: "You are not authenticated",
      },
      {
        status: 401,
      }
    );
  }

  const userId = Number(user.id);

  try {
    const room = await prisma.rooms.findFirst({
      where: {
        id: roomId.toString(),
      },
    });

    if (!room) {
      return NextResponse.json(
        {
          success: false,
          message: "Room not found",
        },
        {
          status: 404,
        }
      );
    }

    if (room.ownerId !== userId) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not the owner of this room",
        },
        {
          status: 403,
        }
      );
    }

    const deleteRoom = await prisma.rooms.delete({
      where: {
        id: roomId.toString(),
        ownerId: userId,
      },
    });

    if (!deleteRoom) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to delete room",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Room deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("error deleting room: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed delete room",
      },
      {
        status: 500,
      }
    );
  }
}
