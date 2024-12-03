import { dbconnect } from "@/lib/prisma";
import { User, getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function POST(request: NextRequest) {
  const prisma = await dbconnect();
  const { searchParams } = new URL(request.url);
  const roomId = searchParams.get("roomId");
  const invitedUser = await request.json();
  const session = await getServerSession(authOptions);

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
      },
      include: {
        invitations: true,
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

    if (room.ownerId !== userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Only the owner can invite new members",
        },
        {
          status: 403,
        },
      );
    }

    const createInvite = await prisma.roomInvitation.create({
      data: {
        room: { connect: { id: roomId.toString() } },
        sender: { connect: { id: userId } },
        invitedUser: { connect: { id: invitedUser[0] } },
      },
    });

    if (!createInvite) {
      return NextResponse.json(
        {
          success: false,
          message: "Error creating invite",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Invite sent",
        requests: createInvite,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("error sending Invite: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error sending Invite",
      },
      {
        status: 500,
      },
    );
  }
}

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
    const invitations = await prisma.roomInvitation.findMany({
      where: {
        invitedUserId: userId,
        status: "PENDING",
      },
      include: {
        room: true,
        sender: true,
      },
    });

    if (!invitations) {
      return NextResponse.json(
        {
          success: true,
          invitations: [],
        },
        {
          status: 200,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        invitations,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error fetching Invitations", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching Invitations",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(request: NextRequest) {
  const prisma = await dbconnect();
  const session = await getServerSession(authOptions);
  const { invitationId, status } = await request.json();
  const user: User = session?.user as User;

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

  if (!invitationId || !["ACCEPTED", "DECLINED"].includes(status)) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid request",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const invitation = await prisma.roomInvitation.findUnique({
      where: {
        id: invitationId,
      },
      include: {
        invitedUser: true,
      },
    });

    if (!invitation) {
      return NextResponse.json(
        {
          success: false,
          message: "Invitation not found",
        },
        {
          status: 404,
        },
      );
    }

    const invitedUserId = invitation.invitedUser.id;

    if (invitedUserId !== Number(user.id)) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to perform this action",
        },
        {
          status: 403,
        },
      );
    }

    const updatedInvitation = await prisma.$transaction(async (tx) => {
      const updatedInvitation = await tx.roomInvitation.update({
        where: {
          id: invitationId,
        },
        data: {
          status: status,
        },
      });

      if (status === "ACCEPTED") {
        await tx.rooms.update({
          where: { id: updatedInvitation.roomId },
          data: {
            members: {
              connect: { id: updatedInvitation.invitedUserId },
            },
          },
        });
      }

      if (status === "DECLINED") {
        await tx.roomInvitation.delete({
          where: {
            id: invitationId,
          },
        });
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: `Invitation ${status.toLowerCase()} successfully`,
        collaboration: updatedInvitation,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update invitation",
      },
      {
        status: 500,
      },
    );
  }
}
