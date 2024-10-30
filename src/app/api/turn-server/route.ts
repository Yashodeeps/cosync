import { getServerSession, User } from "next-auth";
import { NextResponse } from "next/server";
import twilio from "twilio";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET(res: NextResponse) {
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  try {
    if (!session || !user) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authenticated",
        },
        {
          status: 401,
        }
      );
    }
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);

    const token = await client.tokens.create();
    return NextResponse.json({ token });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
