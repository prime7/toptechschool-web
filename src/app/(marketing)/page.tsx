"use client";

import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-light-background dark:bg-dark-background">
      <div className="p-8 bg-white dark:bg-dark-background rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-6 text-light-text dark:text-dark-text">
          Welcome to Our App
        </h1>
        <Link
          href="/upload"
          className="text-light-primary dark:text-dark-primary hover:underline"
        >
          Resume
        </Link>

        {status === "loading" ? (
          <p className="text-light-muted dark:text-dark-muted mb-4">
            Loading...
          </p>
        ) : session && session.user ? (
          <>
            <p className="text-xl mb-4 text-light-text dark:text-dark-text">
              Hello, {session.user.name}!
            </p>
            <p className="text-light-secondary dark:text-dark-secondary mb-6">
              You are signed in with {session.user.email}
            </p>
            <Button
              onClick={() => signOut()}
              className="bg-light-error hover:bg-light-error/90 dark:bg-dark-error dark:hover:bg-dark-error/90 text-white"
            >
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <p className="text-light-secondary dark:text-dark-secondary mb-6">
              Please sign in to access your account
            </p>
            <Button
              onClick={() => signIn("google")}
              className="bg-light-primary hover:bg-light-primary/90 dark:bg-dark-primary dark:hover:bg-dark-primary/90 text-white"
            >
              Sign in with Google
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
