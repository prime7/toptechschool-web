import React from "react";
import {
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { Question } from "./types";
import { useQuestions } from "./hooks";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface QuestionCardProps {
  question: Question;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const { toggleBookmark, isAttempted } = useQuestions();
  const attempted = isAttempted(question.id);

  const getDifficultyVariant = (
    difficulty: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (difficulty) {
      case "Easy":
        return "secondary";
      case "Medium":
        return "default";
      case "Hard":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Card
      className={`group hover:shadow-md transition-all duration-200 hover:-translate-y-1 ${
        attempted
          ? "ring-2 ring-emerald-200 bg-emerald-50/50 dark:ring-emerald-800 dark:bg-emerald-950/50"
          : ""
      }`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={getDifficultyVariant(question.difficulty)}>
              {question.difficulty}
            </Badge>
            <Badge variant="outline">{question.category}</Badge>
            {attempted && (
              <Badge
                variant="secondary"
                className="bg-emerald-100 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100"
              >
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Attempted
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors leading-tight">
            {question.title}
          </h3>

          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
            {question.description}
          </p>

          <div className="pt-2">
            <div className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors group/cta">
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
