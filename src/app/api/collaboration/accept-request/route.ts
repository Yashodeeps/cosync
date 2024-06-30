import { dbconnect } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { User } from "next-auth";

// Handler for accepting a collaboration request
export async function PATCH(request: NextRequest) {
  const prisma = await dbconnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

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

  const { collaborationId, action } = await request.json();
  console.log(collaborationId, action);

  if (!collaborationId || !["ACCEPTED", "DECLINED"].includes(action)) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid request",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const collaboration = await prisma.collaboration.findUnique({
      where: {
        id: Number(collaborationId),
      },
      include: {
        user: true,
      },
    });

    if (!collaboration) {
      return NextResponse.json(
        {
          success: false,
          message: "Collaboration request not found",
        },
        {
          status: 404,
        }
      );
    }
    const collaborationUserId = collaboration.userId.toString();

    if (collaborationUserId !== user.id) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to perform this action",
        },
        {
          status: 403,
        }
      );
    }

    const updatedCollaboration = await prisma.collaboration.update({
      where: {
        id: collaborationId,
      },
      data: {
        status: action,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: `Collaboration request ${action.toLowerCase()} successfully`,
        collaboration: updatedCollaboration,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update collaboration request",
      },
      {
        status: 500,
      }
    );
  }
}
