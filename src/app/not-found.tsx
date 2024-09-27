"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-background">
      <Card className="w-[350px] border-secondary">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center">404</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <h2 className="text-xl font-semibold mb-4">Page Not Found</h2>
          <p className="mb-6">
            Oops! The page you&apos;re looking for doesn&apos;t exist or has
            been moved.
          </p>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/">Return to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
