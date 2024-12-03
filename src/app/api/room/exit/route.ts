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
      },
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
      },
    );
  }

  const userId = Number(user.id);

  try {
    // Create a variable to store the transaction result
    let transactionResult: {
      success: boolean;
      message: string;
      status: number;
    } | null = null as {
      success: boolean;
      message: string;
      status: number;
    } | null;

    await prisma.$transaction(async (tx) => {
      const room = await tx.rooms.findFirst({
        where: {
          id: roomId.toString(),
        },
        include: {
          members: true,
        },
      });

      if (!room) {
        transactionResult = {
          success: false,
          message: "Room not found",
          status: 404,
        };
        return;
      }

      console.log("owner: ", room.ownerId, "userId: ", userId);

      if (room.ownerId === userId) {
        if (room.members.length > 1) {
          transactionResult = {
            success: false,
            message:
              "Room owners cannot leave rooms with other members. Transfer ownership first or remove other members.",
            status: 400,
          };
          return;
        }

        await tx.rooms.delete({
          where: {
            id: roomId.toString(),
          },
        });

        transactionResult = {
          success: true,
          message: "Room deleted",
          status: 200,
        };
        return;
      }

      await tx.rooms.update({
        where: {
          id: roomId.toString(),
        },
        data: {
          members: {
            disconnect: {
              id: userId,
            },
          },
        },
      });

      transactionResult = {
        success: true,
        message: "Left room",
        status: 200,
      };
    });

    if (transactionResult) {
      return NextResponse.json(
        {
          success: transactionResult.success,
          message: transactionResult.message,
        },
        {
          status: transactionResult.status,
        },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      },
    );
  } catch (error) {
    console.error("error leaving room: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to exit room",
      },
      {
        status: 500,
      },
    );
  }
}
