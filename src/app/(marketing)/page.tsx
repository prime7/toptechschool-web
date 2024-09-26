import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <div className="container mx-auto px-4 min-h-screen flex items-center justify-center">
      <div className="p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-6">Welcome to Our App</h1>
        <Link href="/upload" className="text-primary hover:underline">
          Resume
        </Link>
      </div>
    </div>
  );
}
