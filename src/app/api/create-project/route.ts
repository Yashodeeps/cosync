import { dbconnect } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { User } from "next-auth";

export async function POST(request: NextRequest) {
  const prisma = await dbconnect();
  const session = await getServerSession(authOptions);
  const { title, description, teamMembers, WorkspaceId } = await request.json();
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
    const newProject = await prisma.project.create({
      data: {
        title,
        description,
        userId,
        teamMembers: {
          connect: teamMembers.map((id: number) => ({ id })),
        },
        workspaces: {
          connect: { id: WorkspaceId },
        },
      },
    });

    if (!newProject) {
      return NextResponse.json(
        {
          success: false,
          message: "Could not create project",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Project created successfully",
        project: newProject,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Could not create project",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request: NextRequest) {
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

  const userId = Number(user.id);

  try {
    const projects = await prisma.project.findMany({
      where: {
        userId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        projects,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Could not fetch projects",
      },
      {
        status: 500,
      }
    );
  }
}
