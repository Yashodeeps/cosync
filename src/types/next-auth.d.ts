import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    isVerified?: boolean;
    username?: string;
  }
  interface Session {
    user: {
      id?: string;
      isVerified?: boolean;
      username?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    isVerified?: boolean;
    username?: string;
  }
}
