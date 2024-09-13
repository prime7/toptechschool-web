"use client";

import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-6">Welcome to Our App</h1>

        {status === "loading" ? (
          <p className="text-gray-600 mb-4">Loading...</p>
        ) : session ? (
          <>
            <p className="text-xl mb-4">Hello, {session.user.name}!</p>
            <p className="text-gray-600 mb-6">
              You are signed in with {session.user.email}
            </p>
            <Button
              onClick={() => signOut()}
              className="bg-red-500 hover:bg-red-600"
            >
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <p className="text-gray-600 mb-6">
              Please sign in to access your account
            </p>
            <Button
              onClick={() => signIn("google")}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Sign in with Google
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
