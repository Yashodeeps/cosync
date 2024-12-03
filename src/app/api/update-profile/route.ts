import { dbconnect } from "@/lib/prisma";
import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { z } from "zod";

// Validation schema for profile updates
const ProfileUpdateSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, underscores, and hyphens",
    )
    .optional(),
  image: z.string().url().optional(),
  email: z.string().email().optional(),
});

export async function POST(req: NextRequest, res: NextResponse) {
  const prisma = await dbconnect();
  const session = await getServerSession(authOptions);
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

  try {
    const updatedProfile = await req.json();

    const validationResult = ProfileUpdateSchema.safeParse(updatedProfile);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid data provided",
          errors: validationResult.error.errors,
        },
        {
          status: 400,
        },
      );
    }

    if (updatedProfile.username) {
      const existingUser = await prisma.user.findUnique({
        where: {
          username: updatedProfile.username,
          NOT: {
            id: Number(user.id),
          },
        },
      });

      if (existingUser) {
        return NextResponse.json(
          {
            success: false,
            message: "Username is already taken",
          },
          {
            status: 409,
          },
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: Number(user.id),
      },
      data: {
        name: updatedProfile?.name,
        username: updatedProfile?.username,
        profile: updatedProfile?.image,
        email: updatedProfile?.email,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        profile: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully",
        user: updatedUser,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Profile update error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update profile",
      },
      {
        status: 500,
      },
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(req: NextRequest, res: NextResponse) {
  const prisma = await dbconnect();
  const session = await getServerSession(authOptions);
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

  try {
    await prisma.user.delete({
      where: {
        id: Number(user.id),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Profile deleted successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Profile delete error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete profile",
      },
      {
        status: 500,
      },
    );
  } finally {
    await prisma.$disconnect();
  }
}
