"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios, { AxiosError } from "axios";

interface AnswerSubmissionProps {
  questionId: string;
  question: string;
}

export default function AnswerSubmission({
  questionId,
  question,
}: AnswerSubmissionProps) {
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      toast({
        title: "Submitting answer...",
        description: "Please wait while we process your submission.",
      });

      await axios.post("/api/evaluate/practice", {
        questionId,
        answer,
      });

      toast({
        title: "Success!",
        description: "Your answer has been submitted and evaluated successfully.",
      });
      
      router.refresh();
      setAnswer("");
      
    } catch (error) {
      console.error("Error submitting answer:", error);
      
      const axiosError = error as AxiosError<{ error?: string; message?: string }>;
      const errorMessage = axiosError.response?.data?.error 
        || axiosError.response?.data?.message 
        || "Failed to submit answer. Please try again.";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-4xl font-bold text-foreground tracking-tight">
            {question}
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {answer.length} chars
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here... (minimum 50 characters)"
            className="min-h-[200px] resize-y"
            disabled={isSubmitting}
          />
          {isSubmitting && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-md">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !answer.trim()}
            className="flex-1 h-12"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </span>
            ) : (
              "Submit Answer"
            )}
          </Button>
          {answer.trim() && (
            <Button
              variant="outline"
              onClick={() => setAnswer("")}
              disabled={isSubmitting}
              className="h-12"
            >
              Clear
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
