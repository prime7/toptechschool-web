import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import type { DefaultSession } from "next-auth";
import { prisma } from "./prisma";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  adapter: PrismaAdapter(prisma) as Adapter,
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, user, trigger, session }) {
      if (trigger === "update" && session?.name && token.id) {
        token.name = session.name;
        await prisma.user.update({
          where: { id: token.id.toString() },
          data: { name: session.name },
        });
      }

      if (account) {
        token.accessToken = account.access_token;
        if (user) {
          token.id = user.id;
        }
      }
      return token;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};
