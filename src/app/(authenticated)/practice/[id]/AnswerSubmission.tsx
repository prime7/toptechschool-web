"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Loader2, Save, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios, { AxiosError } from "axios";

interface AnswerSubmissionProps {
  questionId: string;
  question: string;
  answer: string;
}

interface FeedbackData {
  feedback: string;
  score: number;
  suggestions: string[];
}

export default function AnswerSubmission({
  questionId,
  question,
  answer,
}: AnswerSubmissionProps) {
  const [localAnswer, setLocalAnswer] = useState(answer);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
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
      setIsProcessing(true);
      showToast(
        withAIFeedback ? "Getting AI feedback..." : "Saving answer...",
        withAIFeedback
          ? "Please wait while we analyze your answer."
          : "Please wait while we save your answer."
      );

      const response = await axios.post("/api/evaluate/practice", {
        questionId,
        answer: localAnswer,
        withAIFeedback,
      });

      withAIFeedback ? setFeedback(response.data) : setIsSaved(true);

      showToast(
        "Success!",
        withAIFeedback
          ? "AI feedback has been generated successfully."
          : "Your answer has been saved successfully."
      );

      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      const axiosError = error as AxiosError<{
        error?: string;
        message?: string;
      }>;
      const errorMessage =
        axiosError.response?.data?.error ||
        axiosError.response?.data?.message ||
        `Failed to ${withAIFeedback ? "get AI feedback" : "save answer"}. Please try again.`;

      showToast("Error", errorMessage, true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAnswerChange = (value: string) => {
    setLocalAnswer(value);
    setIsSaved(false);
    setFeedback(null);
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
        {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
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
            disabled={isProcessing}
          />
          {isProcessing && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-md">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {renderButton(
            () => handleSubmission(false),
            isProcessing || !localAnswer.trim() || localAnswer.length < 50,
            <Save className="h-4 w-4" />,
            isProcessing ? "Saving..." : isSaved ? "Saved" : "Save Answer",
            isSaved ? "outline" : "default"
          )}

          {renderButton(
            () => handleSubmission(true),
            isProcessing || !localAnswer.trim(),
            <Sparkles className="h-4 w-4" />,
            isProcessing
              ? "Analyzing..."
              : feedback
                ? "Refresh Feedback"
                : "Get Feedback",
            feedback ? "outline" : "default"
          )}

          {localAnswer.trim() && (
            <Button
              variant="outline"
              onClick={handleClear}
              disabled={isProcessing}
              className="h-12"
            >
              Clear
            </Button>
          )}
        </div>

        {feedback && (
          <div className="space-y-4 border rounded-lg p-6 bg-muted/10">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">AI Feedback</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Score:</span>
                <span className="font-semibold">{feedback.score}%</span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Feedback</h4>
                <p className="text-muted-foreground">{feedback.feedback}</p>
              </div>
              {feedback.suggestions.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">
                    Suggestions for Improvement
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {feedback.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
