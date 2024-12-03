import { dbconnect } from "@/lib/prisma";
import { Liveblocks } from "@liveblocks/node";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import Members from "@/components/room/Members";

const liveblocks = new Liveblocks({
  secret: `${process.env.LIVEBLOCKS_SECRET_KEY}`,
});

export async function POST(request: Request) {
  const prisma = await dbconnect();
  const session = await getServerSession(authOptions);
  const user = session?.user as User;

  if (!user || !session) {
    return NextResponse.json(
      {
        success: false,
        message: "UnAuthorized user",
      },
      { status: 401 },
    );
  }

  const { room } = await request.json();

  const roomcanvas = await prisma.rooms.findFirst({
    where: {
      id: room,
      members: {
        some: {
          id: Number(user.id),
        },
      },
    },
  });

  if (!roomcanvas) {
    return new Response(
      "Unauthorized",

      { status: 404 },
    );
  }

  const userInfo = {
    name: user.username,
  };

  if (!user.id) {
    return NextResponse.json(
      {
        success: false,
        message: "User ID is missing",
      },
      { status: 400 },
    );
  }

  const liveBlocksSession = liveblocks.prepareSession(user.id, { userInfo });

  if (room) {
    liveBlocksSession.allow(room, liveBlocksSession.FULL_ACCESS);
    liveBlocksSession.allow(room, liveBlocksSession.READ_ACCESS);
  }

  const { status, body } = await liveBlocksSession.authorize();
  return new Response(body, { status });
}
