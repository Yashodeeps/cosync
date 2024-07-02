import { dbconnect } from "@/lib/prisma";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const prisma = await dbconnect();
  const session = await getServerSession(authOptions);
  const user = session?.user as User;
  const { searchParams } = new URL(request.url);
  const searchQuery = searchParams.get("search");

  if (!user || !session) {
    return NextResponse.json(
      {
        success: false,
        message: "UnAuthorized user",
      },
      { status: 401 }
    );
  }

  if (!searchQuery) {
    return NextResponse.json(
      {
        success: false,
        message: "Search Query is required",
      },
      { status: 400 }
    );
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: searchQuery,
            },
          },
          {
            username: {
              contains: searchQuery,
            },
          },
        ],
        NOT: {
          id: Number(user.id),
        },
      },
      select: {
        id: true,
        name: true,
        username: true,
      },
    });

    if (!users) {
      return NextResponse.json(
        {
          success: false,
          message: "No users found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Users found",
        users,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to search users",
      },
      { status: 500 }
    );
  }
}
