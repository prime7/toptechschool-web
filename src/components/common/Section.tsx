import React from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  id?: string;
  title?: string;
  className?: string;
}

export const Section = ({ children, title, className, id }: SectionProps) => {
  return (
    <div className={cn("py-16 md:py-40", className)} id={id}>
      {title && <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>}
      {children}
    </div>
  );
};
