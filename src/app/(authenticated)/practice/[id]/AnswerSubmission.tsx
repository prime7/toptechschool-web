"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Save, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios, { AxiosError } from "axios";

interface AnswerSubmissionProps {
  questionId: string;
  question: string;
  answer: string;
}

export default function AnswerSubmission({
  questionId,
  question,
  answer,
}: AnswerSubmissionProps) {
  const [localAnswer, setLocalAnswer] = useState(answer);

  const router = useRouter();
  const { toast } = useToast();

  const showToast = (title: string, description: string, isError = false) => {
    toast({
      title,
      description,
      variant: isError ? "destructive" : "default",
    });
  };

  const handleSubmission = async (withAIFeedback: boolean) => {
    try {
      showToast(
        withAIFeedback ? "Getting AI feedback..." : "Saving answer...",
        withAIFeedback
          ? "Please wait while we analyze your answer."
          : "Please wait while we save your answer."
      );

      const method = withAIFeedback ? 'post' : 'patch';
      await axios[method]("/api/evaluate/practice", {
        questionId,
        answer: localAnswer,
      });

      router.refresh();
    } catch (error) {
      const axiosError = error as AxiosError<{
        error?: string;
        message?: string;
      }>;
      const errorMessage =
        axiosError.response?.data?.error ||
        axiosError.response?.data?.message ||
        `Failed to ${withAIFeedback ? "get AI feedback" : "save answer"}. Please try again.`;

      showToast("Error", errorMessage, true);
    }
  };

  const handleAnswerChange = (value: string) => {
    setLocalAnswer(value);
  };

  const handleClear = () => {
    handleAnswerChange("");
  };

  const renderButton = (
    onClick: () => void,
    disabled: boolean,
    icon: JSX.Element,
    text: string,
    variant: "default" | "outline" = "default"
  ) => (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="flex-1 h-12"
      variant={variant}
    >
      <span className="flex items-center gap-2">
        {icon}
        {text}
      </span>
    </Button>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-4xl font-bold text-foreground tracking-tight">
            {question}
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {localAnswer.length} chars
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative">
          <Textarea
            value={localAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Type your answer here... (minimum 50 characters)"
            className="min-h-[200px] resize-y"
          />
        </div>

        <div className="flex items-center gap-4">
          {renderButton(
            () => handleSubmission(false),
            !localAnswer.trim(),
            <Save className="h-4 w-4" />,
            "Save Answer",
            "default"
          )}

          {renderButton(
            () => handleSubmission(true),
            !localAnswer.trim(),
            <Sparkles className="h-4 w-4" />,
            "Get Feedback",
            "default"
          )}

          {localAnswer.trim() && (
            <Button variant="outline" onClick={handleClear} className="h-12">
              Clear
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
