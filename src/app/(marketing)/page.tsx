import Link from "next/link";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="h-[calc(100vh-64px)] flex items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Welcome to Toptechschool
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Button
            asChild
            className="px-6 py-3 text-lg font-semibold rounded-full"
          >
            <Link href="/upload">Upload Your Resume</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
