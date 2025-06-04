"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { Question } from "./types";
import { useQuestions } from "./hooks";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface QuestionCardProps {
  question: Question;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const { isAttempted } = useQuestions();
  const attempted = isAttempted(question.id);

  return (
    <Card
      className={`group hover:shadow-md transition-all duration-200 hover:-translate-y-1 ${
        attempted
          ? "ring-2 ring-emerald-200 bg-emerald-50/50 dark:ring-emerald-800 dark:bg-emerald-950/50"
          : ""
      }`}
    >
      <CardHeader>
        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors leading-tight">
          {question.title}
        </h3>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          {question.description}
        </p>
        <div className="pt-2">
          <div className="flex items-center justify-between text-sm font-medium text-primary hover:text-primary/80 transition-colors group/cta">
            <div className="flex items-center">
              {attempted ? "Review Answer" : "Practice Question"}
              <ChevronRight className="ml-1 h-3 w-3 transition-transform group-hover/cta:translate-x-1" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
