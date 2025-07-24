"use client";

import React from 'react';
import {
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SpotlightCard from "@/components/common/SpotlightCard";
import { cn } from "@/lib/utils";

interface BlogCardProps {
  title: string;
  description: string;
  date: string;
  category: string;
  className?: string;
}

export const BlogCard = React.memo(function BlogCard({
  title,
  description,
  date,
  category,
  className
}: BlogCardProps) {
  return (
    <SpotlightCard
      spotlightColor="rgba(0, 229, 255, 0.2)"
      className={cn(
        "flex flex-col bg-transparent backdrop-blur-sm border-gray-200 dark:border-gray-700 rounded-xl",
        className
      )}
    >
      <CardHeader className="space-y-4 pb-6 pt-8 px-8">
        <div className="space-y-3">
          <CardTitle className="text-2xl font-bold leading-tight line-clamp-2">
            {title}
          </CardTitle>
          <p className="text-sm font-medium leading-relaxed text-gray-600 dark:text-muted-foreground line-clamp-3">
            {description}
          </p>
        </div>
      </CardHeader>

      <CardFooter className="flex justify-between items-center px-8 pb-8 mt-auto">
        <span className="text-sm text-gray-600 dark:text-muted-foreground font-medium">
          {date}
        </span>
        <Badge
          variant="secondary"
          className="text-emerald-600 bg-emerald-500/10 font-medium px-3 py-1 rounded-full"
        >
          {category}
        </Badge>
      </CardFooter>
    </SpotlightCard>
  );
}); 