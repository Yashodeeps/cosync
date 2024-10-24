import { dbconnect } from "@/lib/prisma";
import { User, getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function POST(request: NextRequest) {
  const prisma = await dbconnect();
  const { searchParams } = new URL(request.url);
  const projectId = Number(searchParams.get("projectid"));
  const collaboratorUserIds = await request.json();
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
  const userId = Number(user.id);

  try {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
      },
      include: {
        collaborations: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          message: "Project not found",
        },
        {
          status: 404,
        }
      );
    }

    if (project.userId !== userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Only the owner can send colloboration requests",
        },
        {
          status: 403,
        }
      );
    }

    const collaborationRequests = collaboratorUserIds.map(
      (collaboratorUserId: number) => ({
        projectId: projectId,
        userId: collaboratorUserId,
        status: "PENDING",
      })
    );

    const createCollaborations = await prisma.collaboration.createMany({
      data: collaborationRequests,
    });

    if (!createCollaborations) {
      return NextResponse.json(
        {
          success: false,
          message: "Error creating collaboration",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Collaboration request sent",
        requests: createCollaborations,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("error sending colloboration req: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error sending collaboration request",
      },
      {
        status: 500,
      }
    );
  }
}
