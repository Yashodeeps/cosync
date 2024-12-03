import { dbconnect } from "@/lib/prisma";
import { z } from "zod";
import { usernameSchema } from "@/Schema/SignupSchema";
import { NextRequest, NextResponse } from "next/server";

const UsernameQuerySchema = z.object({
  username: usernameSchema,
});

export async function GET(request: NextRequest) {
  const prisma = await dbconnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    //validate with zod
    const result = UsernameQuerySchema.safeParse(queryParam);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return NextResponse.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid username",
        },
        { status: 400 },
      );
    }

    const { username } = result.data;

    const existingVerifiedUser = await prisma.user.findFirst({
      where: {
        username: username,
        isVerified: true,
      },
    });

    if (existingVerifiedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Username already taken",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Username is unique",
      },
      { status: 400 },
    );
  } catch (error) {
    console.error("Error checking username", error);
    return NextResponse.json(
      { success: false, message: "Error checking username" },
      { status: 500 },
    );
  }
}
