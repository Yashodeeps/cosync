import { dbconnect } from "@/lib/prisma";
import { User, getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function POST(request: NextRequest) {
  const prisma = await dbconnect();
  const { searchParams } = new URL(request.url);
  const roomId = searchParams.get("roomId");
  const invitedUser = await request.json();
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
    console.log("roomId: ", roomId);
    const room = await prisma.rooms.findFirst({
      where: {
        id: roomId.toString(),
      },
      include: {
        invitations: true,
      },
    });

    if (!room) {
      return NextResponse.json(
        {
          success: false,
          message: "room not found",
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
          message: "Only the owner can invite new members",
        },
        {
          status: 403,
        }
      );
    }

    const createInvite = await prisma.roomInvitation.create({
      data: {
        room: { connect: { id: roomId.toString() } },
        sender: { connect: { id: userId } },
        invitedUser: { connect: { id: invitedUser[0] } },
      },
    });

    if (!createInvite) {
      return NextResponse.json(
        {
          success: false,
          message: "Error creating invite",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Invite sent",
        requests: createInvite,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("error sending Invite: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error sending Invite",
      },
      {
        status: 500,
      }
    );
  }
}
