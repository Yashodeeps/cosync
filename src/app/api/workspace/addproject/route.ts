import { dbconnect } from "@/lib/prisma";
import { User, getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function POST(request: NextRequest) {
  const prisma = await dbconnect();
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectid");
  const workspaceId = searchParams.get("workspaceid");

  const session = await getServerSession(authOptions);
  const user = session?.user as User;

  if (!user || !session) {
    return NextResponse.json(
      {
        success: false,
        message: "User not found",
      },
      {
        status: 404,
      }
    );
  }

  //todo: create a join schema for workspace and project for many to many relationships

  try {
    const project = await prisma.project.findFirst({
      where: {
        id: Number(projectId),
        userId: Number(user.id),
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

    const workspace = await prisma.workspace.findFirst({
      where: {
        id: Number(workspaceId),
      },
    });

    if (!workspace) {
      return NextResponse.json(
        {
          success: false,
          message: "Workspace not found",
        },
        {
          status: 404,
        }
      );
    }

    const updateWorkspace = await prisma.workspace.update({
      where: {
        id: Number(workspaceId),
      },
      data: {
        projects: {
          connect: {
            id: Number(projectId),
          },
        },
      },
    });

    if (!updateWorkspace) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to add project to workspace",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Project added to workspace successfully",
        workspace: updateWorkspace,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to add project to workspace",
      },
      {
        status: 500,
      }
    );
  }
}
