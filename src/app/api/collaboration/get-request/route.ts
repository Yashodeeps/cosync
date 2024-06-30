import { dbconnect } from "@/lib/prisma";
import { User, getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET(request: NextRequest, response: NextResponse) {
  const prisma = await dbconnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !user) {
    return NextResponse.json({
      status: 401,
      json: {
        success: false,
        message: "You are not authenticated",
      },
    });
  }
  const userId = Number(user.id);

  try {
    const collaborationRequests = await prisma.collaboration.findMany({
      where: {
        userId,
        status: "PENDING",
      },
      include: {
        project: true,
      },
    });

    if (!collaborationRequests) {
      return NextResponse.json(
        {
          success: true,
          collaborationRequests: [],
        },
        {
          status: 200,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        collaborationRequests,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching collaboration requests", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching collaboration requests",
      },
      {
        status: 500,
      }
    );
  }
}
