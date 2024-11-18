import { dbconnect } from "@/lib/prisma";
import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function POST(req: NextRequest, res: NextResponse) {
  const prisma = await dbconnect();
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get("roomId");
  const { title, description, dueDate, priority, taskColumn } =
    await req.json();

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

  if (!title || !taskColumn) {
    return NextResponse.json(
      {
        success: false,
        message: "Missing fields: tite/ taskColumn",
      },
      {
        status: 400,
      }
    );
  }

  const userId = Number(user.id);

  try {
    const room = await prisma.rooms.findFirst({
      where: {
        id: roomId.toString(),
        OR: [{ ownerId: userId }, { members: { some: { id: userId } } }],
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

    console.log("incoming data", {
      title,
      description,
      dueDate,
      priority,
      taskColumn,
      taskBy: userId.toString(),
    });

    const newTask = await prisma.kanbanTask.create({
      data: {
        title,
        description,
        priority,
        taskColumn,
        taskBy: userId.toString(),
        room: {
          connect: {
            id: room.id,
          },
        },
      },
    });

    console.log("newTask", newTask);

    if (!newTask) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create task",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Task created successfully",
        data: newTask,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(req: NextRequest, res: NextResponse) {
  const prisma = await dbconnect();
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get("roomId");

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
        OR: [{ ownerId: userId }, { members: { some: { id: userId } } }],
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

    const tasks = await prisma.kanbanTask.findMany({
      where: {
        room: {
          id: room.id,
        },
      },
    });

    if (!tasks) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch tasks",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Task fetched successfully",
        data: tasks,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching tasks",
      },
      {
        status: 500,
      }
    );
  }
}
