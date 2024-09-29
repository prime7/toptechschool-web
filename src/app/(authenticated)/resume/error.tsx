"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function Error({ error }: { error: Error }) {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Something went wrong
      </h1>
      <Card>
        <CardContent className="p-6">
          <p className="mb-4">
            {error.message || "An unexpected error occurred."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
