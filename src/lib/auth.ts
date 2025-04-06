import NextAuth, { DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      emailVerified: Date | null;
      isEmailVerified: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    emailVerified: Date | null;
    isEmailVerified: boolean;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user, trigger, session }) {
      if (trigger === "update" && session?.name && token.sub) {
        token.name = session.name;
        await prisma.user.update({
          where: { id: token.sub },
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
});
