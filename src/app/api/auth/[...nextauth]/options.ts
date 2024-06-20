import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbconnect } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "Crediantials",
      name: "Crediantials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "batman@projetlabs.com",
        },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials: any): Promise<any> {
        const prisma = await dbconnect();
        try {
          const user = await prisma.user.findFirst({
            where: {
              OR: [
                {
                  email: credentials.identifier,
                },
                {
                  username: credentials.identifier,
                },
              ],
            },
          });

          if (!user) {
            throw new Error("No user found");
          }
          if (!user.isVerified) {
            throw new Error("User is not verified | please varify your email");
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Password is incorrect");
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id?.toString();
        token.isVerified = user.isVerified;
        token.username = user.username;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.isVerified = token.isVerified;
        session.user.username = token.username;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
