import { dbconnect } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const prisma = await dbconnect();
  try {
    const { username, code } = await request.json();

    const decodedUsername = decodeURIComponent(username);

    const user = await prisma.user.findFirst({
      where: {
        username: decodedUsername,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          isVerified: true,
        },
      });
      return NextResponse.json(
        {
          success: true,
          message: "User verified successfully!!",
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return NextResponse.json(
        {
          success: false,
          message: "Verification Code expired :(",
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Verification Code",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error in verify-code route", error);
    return NextResponse.json(
      {
        success: false,
        message: "error verifying user",
      },
      { status: 500 }
    );
  }
}
