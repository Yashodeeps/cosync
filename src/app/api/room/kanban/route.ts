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

  if (!title || !taskColumn) {
    return NextResponse.json(
      {
        success: false,
        message: "Missing fields: tite/ taskColumn",
      },
      {
        status: 400,
      },
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
        },
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
        },
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
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      },
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
        },
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
        },
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
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching tasks",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PUT(req: NextRequest, res: NextResponse) {
  const prisma = await dbconnect();
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get("roomId");
  const taskId = searchParams.get("taskId");
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

  if (!(title || taskColumn || description || dueDate || priority)) {
    return NextResponse.json(
      {
        success: false,
        message: "Nothing to update",
      },
      {
        status: 400,
      },
    );
  }

  const userId = Number(user.id);

  try {
    const room = await prisma.rooms.findFirst({
      where: {
        id: roomId.toString(),
        OR: [{ ownerId: userId }, { members: { some: { id: userId } } }],
      },
      include: {
        kanbanTasks: true,
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
        },
      );
    }

    const taskToUpdate = room.kanbanTasks.find(
      (task) => task.id === Number(taskId),
    );
    if (!taskToUpdate) {
      return NextResponse.json(
        {
          success: false,
          message: "Task not found",
        },
        {
          status: 404,
        },
      );
    }

    const updatedTask = await prisma.kanbanTask.update({
      where: {
        id: taskToUpdate.id,
      },
      data: {
        title: title || taskToUpdate.title,
        description: description || taskToUpdate.description,
        priority: priority || taskToUpdate.priority,
        taskColumn: taskColumn || taskToUpdate.taskColumn,
      },
    });

    if (!updatedTask) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update task",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Task updated successfully",
        data: updatedTask,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong while updating task. Try again after sometime",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(req: NextRequest, res: NextResponse) {
  const prisma = await dbconnect();
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get("roomId");
  const taskId = searchParams.get("taskId");

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
    const room = await prisma.rooms.findFirst({
      where: {
        id: roomId.toString(),
        OR: [{ ownerId: userId }, { members: { some: { id: userId } } }],
      },
      include: {
        kanbanTasks: true,
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
        },
      );
    }

    const taskToDelete = room.kanbanTasks.find(
      (task) => task.id === Number(taskId),
    );
    if (!taskToDelete) {
      return NextResponse.json(
        {
          success: false,
          message: "Task not found",
        },
        {
          status: 404,
        },
      );
    }

    const deletedTask = await prisma.kanbanTask.delete({
      where: {
        id: taskToDelete.id,
      },
    });

    if (!deletedTask) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to delete task",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Task deleted successfully",
        data: deletedTask,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong while deleting task. Try again after sometime",
      },
      {
        status: 500,
      },
    );
  }
}
