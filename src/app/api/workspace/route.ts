import { dbconnect } from "@/lib/prisma";
import { User, getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: NextRequest) {
  const prisma = await dbconnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  const { name, description, isPublic } = await request.json();

  if (!user || !session) {
    return NextResponse.json(
      {
        success: false,
        message: "User not found",
      },
      { status: 404 },
    );
  }

  if (!name) {
    return NextResponse.json(
      {
        success: false,
        message: "Name is required",
      },
      { status: 404 },
    );
  }

  try {
    const newWorkspace = await prisma.workspace.create({
      data: {
        name,
        description,
        isPublic,
        user: {
          connect: { id: Number(user.id) },
        },
        members: {
          connect: { id: Number(user.id) },
        },
      },
    });

    if (!newWorkspace) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create workspace",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Workspace created successfully",
      workspace: newWorkspace,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create workspace",
      },
      { status: 500 },
    );
  }
}
