import { dbconnect } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req: NextRequest) {
  const prisma = await dbconnect();
  const { title } = await req.json();
  const session = await getServerSession(authOptions);

  const ownerId = session?.user.id;

  if (!title) {
    return NextResponse.json(
      { success: false, message: "Title is required" },
      { status: 400 }
    );
  }

  try {
    const newRoom = await prisma.rooms.create({
      data: {
        name: title.toString(),
        ownerId: Number(ownerId),
        members: {
          connect: { id: Number(ownerId) },
        },
      },
    });

    if (!newRoom) {
      return NextResponse.json(
        { success: false, message: "Failed to create room" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, room: newRoom }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error creating room" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const prisma = await dbconnect();
  const session = await getServerSession(authOptions);

  const ownerId = session?.user.id;

  if (!ownerId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const rooms = await prisma.rooms.findMany({
      where: {
        OR: [
          {
            ownerId: Number(ownerId),
          },
          {
            members: {
              some: {
                id: Number(ownerId),
              },
            },
          },
        ],
      },
    });

    if (!rooms) {
      return NextResponse.json(
        { success: false, message: "Failed to fetch rooms" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, rooms }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error fetching rooms" },
      { status: 500 }
    );
  }
}
