"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Save,
  Lightbulb,
  Bot,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import {
  saveAnswer,
  getAnswer,
  generateFeedback,
} from "@/actions/practice";
import { questions } from "../data";
import { Question } from "../types";

interface QuestionDetailPageProps {
  params: {
    id: string;
  };
}

interface SavedAnswer {
  id: string;
  userId: string;
  questionId: string;
  answer: string;
  feedback: string | null;
  score: number | null;
  suggestions: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface Feedback {
  feedback: string;
  score?: number;
  strengths?: string[];
  areasToImprove?: string[];
  suggestions?: string[];
}

export default function QuestionDetailPage({
  params,
}: QuestionDetailPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState("");
  const [savedAnswer, setSavedAnswer] = useState<SavedAnswer | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    loadData();

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [params.id, hasUnsavedChanges]);

  const loadData = async () => {
    try {
      setIsLoading(true);

      const questionData = questions.find((q) => q.id === params.id);
      if (!questionData) {
        toast({
          title: "Error",
          description: "Question not found",
          variant: "destructive",
        });
        router.push("/practice");
        return;
      }

      setQuestion(questionData);

      const existingAnswer = await getAnswer(params.id);
      if (existingAnswer) {
        setSavedAnswer(existingAnswer);
        setAnswer(existingAnswer.answer);
        if (existingAnswer.feedback) {
          try {
            const parsedFeedback = JSON.parse(existingAnswer.feedback);
            setFeedback(parsedFeedback);
          } catch (e) {
            console.warn("Could not parse feedback JSON:", e);
          }
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Failed to load question data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswer(e.target.value);
    setHasUnsavedChanges(e.target.value !== savedAnswer?.answer);
  };

  const handleSaveAnswer = async () => {
    if (!answer.trim()) {
      toast({
        title: "Error",
        description: "Please provide an answer before saving",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      const result = await saveAnswer(params.id, answer);
      setSavedAnswer(result);
      setHasUnsavedChanges(false);
      toast({
        title: "Success",
        description: "Answer saved successfully!",
      });
      
      // Update the URL to trigger a refresh of the practice page when user goes back
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.set('saved', Date.now().toString());
        window.history.replaceState({}, '', url);
      }
    } catch (error) {
      console.error("Error saving answer:", error);
      toast({
        title: "Error",
        description: "Failed to save answer",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateFeedback = async () => {
    if (!answer.trim()) {
      toast({
        title: "Error",
        description: "Please provide an answer before getting feedback",
        variant: "destructive",
      });
      return;
    }

    if (hasUnsavedChanges) {
      toast({
        title: "Warning",
        description: "Please save your changes before generating feedback",
      });
      return;
    }

    try {
      setIsGeneratingFeedback(true);
      const feedbackResult = await generateFeedback(params.id, answer);
      setFeedback(feedbackResult);
      toast({
        title: "Success",
        description: "AI feedback generated!",
      });
    } catch (error) {
      console.error("Error generating feedback:", error);
      toast({
        title: "Error",
        description: "Failed to generate feedback",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-500 text-white";
      case "medium":
        return "bg-yellow-500 text-white";
      case "hard":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-4">Question not found</p>
            <Link href="/practice">
              <Button className="mt-4">Back to Practice</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="mb-6">
        <Link
          href="/practice"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Practice Questions
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{question.category}</Badge>
              </div>
              <CardTitle className="text-2xl">{question.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-6 text-muted-foreground">
                {question.description}
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="answer" className="text-sm font-medium">
                    Your Answer
                  </label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowHints(!showHints)}
                      className="transition-colors"
                    >
                      <Lightbulb
                        className={`h-4 w-4 mr-1 ${showHints ? "text-yellow-500" : ""}`}
                      />
                      {showHints ? "Hide" : "Show"} Hints
                    </Button>
                  </div>
                </div>

                <Textarea
                  id="answer"
                  placeholder="Type your answer here..."
                  value={answer}
                  onChange={handleAnswerChange}
                  rows={10}
                  className="min-h-[200px] focus:ring-2 focus:ring-primary"
                />

                <div className="flex gap-3">
                  <Button
                    onClick={handleSaveAnswer}
                    disabled={isSaving || !answer.trim()}
                    className={hasUnsavedChanges ? "animate-pulse" : ""}
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {hasUnsavedChanges ? "Save Changes" : "Save Answer"}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleGenerateFeedback}
                    disabled={
                      isGeneratingFeedback ||
                      !answer.trim() ||
                      hasUnsavedChanges
                    }
                    className="transition-colors hover:bg-primary hover:text-white"
                  >
                    {isGeneratingFeedback ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Bot className="h-4 w-4 mr-2" />
                    )}
                    Get AI Feedback
                  </Button>
                </div>

                {savedAnswer && (
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-green-600 rounded-full"></span>
                    Last saved:{" "}
                    {new Date(savedAnswer.updatedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {feedback && (
            <Card className="animate-fadeIn">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  AI Feedback
                  {feedback.score && (
                    <Badge variant="secondary" className="ml-auto">
                      Score: {feedback.score}/10
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Overall Feedback</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {feedback.feedback}
                  </p>
                </div>

                {feedback.strengths && feedback.strengths.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-green-600 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-green-600 rounded-full"></span>
                      Strengths
                    </h4>
                    <ul className="list-none space-y-2">
                      {feedback.strengths.map(
                        (strength: string, index: number) => (
                          <li
                            key={index}
                            className="text-sm flex items-start gap-2"
                          >
                            <span className="text-green-600">✓</span>
                            {strength}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {feedback.areasToImprove &&
                  feedback.areasToImprove.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 text-orange-600 flex items-center gap-2">
                        <span className="inline-block w-2 h-2 bg-orange-600 rounded-full"></span>
                        Areas to Improve
                      </h4>
                      <ul className="list-none space-y-2">
                        {feedback.areasToImprove.map(
                          (area: string, index: number) => (
                            <li
                              key={index}
                              className="text-sm flex items-start gap-2"
                            >
                              <span className="text-orange-600">!</span>
                              {area}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                {feedback.suggestions && feedback.suggestions.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-blue-600 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                      Suggestions
                    </h4>
                    <ul className="list-none space-y-2">
                      {feedback.suggestions.map(
                        (suggestion: string, index: number) => (
                          <li
                            key={index}
                            className="text-sm flex items-start gap-2"
                          >
                            <span className="text-blue-600">→</span>
                            {suggestion}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {showHints && question.hints && question.hints.length > 0 && (
            <Card className="animate-fadeIn">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Hints
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {question.hints.map((hint: string, index: number) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 bg-muted/50 p-3 rounded-lg"
                    >
                      <span className="text-yellow-500 mt-1">💡</span>
                      <span className="text-sm">{hint}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-primary rounded-full"></span>
                Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {question.instructions}
              </p>
            </CardContent>
          </Card>

          {question.sampleAnswer && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-primary rounded-full"></span>
                  Sample Answer Structure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {question.sampleAnswer}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
