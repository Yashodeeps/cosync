import { dbconnect } from "@/lib/prisma";
import { User, getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function POST(request: NextRequest) {
  const prisma = await dbconnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  const { searchParams } = new URL(request.url);
  const workspaceId = searchParams.get("workspaceid");

  if (!user || !session) {
    return NextResponse.json(
      {
        success: false,
        message: "User not found",
      },
      { status: 404 }
    );
  }

  try {
    const workspace = await prisma.workspace.update({
      where: { id: Number(workspaceId) },
      data: {
        members: {
          connect: { id: Number(user.id) },
        },
      },
    });

    if (!workspace) {
      return NextResponse.json(
        {
          success: false,
          message: "no workspace found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Workspace Joined successfully",
      updatedWorkspace: workspace,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to Join workspace",
      },
      { status: 500 }
    );
  }
}
