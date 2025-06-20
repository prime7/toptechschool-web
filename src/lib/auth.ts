import NextAuth, { DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
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

export const { handlers, auth, signIn, signOut, unstable_update: updateSession } = NextAuth({
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
      allowDangerousEmailAccountLinking: true,
    }),
    LinkedInProvider({
      clientId: process.env.AUTH_LINKEDIN_ID as string,
      clientSecret: process.env.AUTH_LINKEDIN_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async jwt({ token, account, user, trigger, session }) {
      if (trigger === "update" && session.user.isEmailVerified) {
        const date = new Date();
        await prisma.user.update({
          where: { id: token.sub },
          data: { isEmailVerified: true, emailVerified: date }
        });
        token.isEmailVerified = true;
        token.emailVerified = date;
      }

      if (account) {
        token.accessToken = account.access_token;
        if (user) {
          token.id = user.id;
          token.isEmailVerified = user.isEmailVerified;
          token.emailVerified = user.emailVerified;
        }
      }

      return token;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.isEmailVerified = Boolean(token.isEmailVerified);
        session.user.emailVerified = token.emailVerified as Date | null;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
});
