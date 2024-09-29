import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <Card className="hover:scale-105 transition-transform duration-300 text-center">
      <CardHeader className="flex flex-col items-center">
        <div className="mb-4 text-primary">{icon}</div>
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}
