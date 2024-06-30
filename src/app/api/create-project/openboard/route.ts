import { dbconnect } from "@/lib/prisma";
import { User, getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function POST(request: NextRequest) {
  const prisma = await dbconnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectid");
  const { task } = await request.json();

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

  if (!task) {
    return NextResponse.json(
      {
        success: false,
        message: "Task is required",
      },
      {
        status: 404,
      }
    );
  }
  //todo: any user with project id should not be able to see the openboard, only the collaborators should be able to see the openboard

  try {
    const response = await prisma.task.create({
      data: {
        task: task,
        projectId: Number(projectId),
        userId: Number(user.id),
      },
    });

    if (!response) {
      return NextResponse.json(
        {
          success: false,
          message: "Could not add task",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Task added successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "error adding task",
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
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectid");

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

  try {
    const tasks = await prisma.task.findMany({
      where: {
        projectId: Number(projectId),
      },
    });

    if (!tasks) {
      return NextResponse.json({
        success: false,
        message: "No tasks found",
      });
    }

    return NextResponse.json({
      success: true,
      tasks,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Could not fetch tasks",
      },
      {
        status: 500,
      }
    );
  }
}
