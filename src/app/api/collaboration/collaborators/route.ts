import { dbconnect } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";

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
      },
    );
  }

  const collaborators = await prisma.collaboration.findMany({
    where: {
      projectId: Number(projectId),
      status: "ACCEPTED",
    },
    include: {
      user: true,
    },
  });

  if (!collaborators) {
    return NextResponse.json({
      success: false,
      message: "No collaborators found",
    });
  }

  return NextResponse.json({
    success: true,
    collaborators,
  });
}
