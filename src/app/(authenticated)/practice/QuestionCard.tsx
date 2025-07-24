"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
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
    <Card className="shadow-lg hover:shadow-xl rounded-lg border-gray-200 dark:border-gray-700 transition-all duration-300">
      <CardHeader>
        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors leading-tight">
          {question.title}
        </h3>
      </CardHeader>
      <CardContent>
        <div className="pt-2">
          <div className="flex items-center justify-between text-sm font-medium text-primary hover:text-primary/80 transition-colors group/cta">
            <div className="flex items-center">
              {attempted ? "Review Answer" : "Practice Question"}
              <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover/cta:translate-x-1" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
