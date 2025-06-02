"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getQuestionById, getSavedAnswers } from '@/actions/practice'; // Import getSavedAnswers
import { PracticeQuestion } from '@/app/(authenticated)/practice/types';
import type { UserQuestionAttempt } from '@prisma/client'; // For typing saved attempts
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getDifficultyColor } from '@/app/(authenticated)/practice/utils';
import Link from 'next/link';
import { ArrowLeft, Info, Loader2 } from 'lucide-react'; // Added Loader2
import axios from 'axios'; // For API calls
import { useToast } from '@/hooks/use-toast'; // For user feedback

// Placeholder for a LoadingSpinner component
const LoadingSpinner = () => <div className="text-center py-10">Loading question...</div>;
// Placeholder for a NotFound component/message
const NotFound = () => (
  <div className="text-center py-10">
    <h1 className="text-2xl font-bold mb-4">Question Not Found</h1>
    <p className="text-muted-foreground mb-6">The question you are looking for does not exist or could not be loaded.</p>
    <Link href="/practice">
      <Button variant="outline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to All Questions
      </Button>
    </Link>
  </div>
);


export default function PracticeQuestionPage() {
  const router = useRouter();
  const params = useParams();
  const questionId = params.questionId as string;

  const [question, setQuestion] = useState<PracticeQuestion | null | undefined>(undefined);
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedAttempts, setSavedAttempts] = useState<UserQuestionAttempt[]>([]);
  const [evaluatingAttemptId, setEvaluatingAttemptId] = useState<string | null>(null); // To track loading state for individual feedback buttons
  const { toast } = useToast();

  const fetchQuestionDetailsAndAttempts = useCallback(async () => {
    if (!questionId) {
      setIsLoading(false);
      setQuestion(null);
      return;
    }
    setIsLoading(true);
    try {
      const [questionData, attemptsData] = await Promise.all([
        getQuestionById(questionId),
        getSavedAnswers(questionId) // Fetch saved attempts
      ]);
      setQuestion(questionData);
      setSavedAttempts(attemptsData || []);
    } catch (error) {
      console.error("Failed to fetch question details or attempts:", error);
      setQuestion(null); // Mark as not found on error
      toast({ title: "Error", description: "Could not load question details.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [questionId, toast]);

  useEffect(() => {
    fetchQuestionDetailsAndAttempts();
  }, [fetchQuestionDetailsAndAttempts]);

  const handleSaveAnswer = async () => {
    if (!questionId || !answer.trim()) {
      toast({ title: "Cannot save", description: "Answer cannot be empty.", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      const response = await axios.post('/api/practice/question/answer', {
        questionId,
        answer: answer.trim(),
      });
      if (response.data.attempt) {
        // Add new attempt to the top of the list and clear textarea
        setSavedAttempts(prevAttempts => [response.data.attempt, ...prevAttempts]);
        setAnswer(''); // Optionally clear answer field
        toast({ title: "Success", description: "Your answer has been saved." });
      }
    } catch (error) {
      console.error("Failed to save answer:", error);
      toast({ title: "Error", description: "Could not save your answer. Please try again.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGetAIFeedback = async (attemptId: string) => {
    setEvaluatingAttemptId(attemptId);
    try {
      const response = await axios.post('/api/practice/evaluate', {
        userQuestionAttemptId: attemptId,
      });

      if (response.data.evaluation && response.data.attempt) {
        // Update the specific attempt in our local state with the new evaluation
        setSavedAttempts(prevAttempts =>
          prevAttempts.map(attempt =>
            attempt.id === attemptId ? response.data.attempt : attempt
          )
        );
        toast({ title: "Success", description: "AI feedback received." });
      } else {
        toast({ title: "Info", description: response.data.message || "Could not retrieve evaluation.", variant: "default" });
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        toast({ title: "Error", description: error.response.data.error || "Failed to get AI feedback.", variant: "destructive" });
        // If 429 (already evaluated today), update UI to reflect that.
        if (error.response.status === 429) {
            setSavedAttempts(prevAttempts =>
                prevAttempts.map(attempt => {
                    if (attempt.id === attemptId) {
                        // Create a dummy evaluation to mark it as "evaluated today" for UI purposes
                        // This assumes the backend error message is reliable for this status code.
                        const existingEvaluations = (attempt.evaluations as any[] || []);
                        return {
                            ...attempt,
                            evaluations: [...existingEvaluations, { evaluatedAt: new Date().toISOString(), feedback: "Already evaluated today."}]
                        };
                    }
                    return attempt;
                })
            );
        }
      } else {
        toast({ title: "Error", description: "An unexpected error occurred while fetching AI feedback.", variant: "destructive" });
      }
      console.error("Failed to get AI feedback:", error);
    } finally {
      setEvaluatingAttemptId(null);
    }
  };

  if (isLoading || question === undefined) {
    return <LoadingSpinner />;
  }

  if (!question) {
    return <NotFound />;
  }

  return (
    <div className="container mx-auto py-8 max-w-3xl"> {/* Constrained width for better readability */}
      <div className="mb-6">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge className={`${getDifficultyColor(question.difficulty)} text-white capitalize`}>
              {question.difficulty}
            </Badge>
            {question.categories.map(cat => (
              <Badge key={cat} variant="secondary">{cat}</Badge>
            ))}
          </div>
          <CardTitle className="text-2xl">{question.question}</CardTitle>
          {question.hints && question.hints.length > 0 && (
            <CardDescription className="mt-3 italic text-sm">
              <Info className="inline h-4 w-4 mr-1 text-blue-500" />
              Hints: {question.hints.join('; ')}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="answer" className="block text-lg font-medium mb-2">Your Answer</label>
              <Textarea
                id="answer"
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                rows={8}
                className="text-base"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-stretch md:flex-row md:justify-end gap-3 mt-4">
          <Button variant="outline" onClick={handleSaveAnswer} disabled={isSaving || !answer.trim()}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Answer
          </Button>
          <Button disabled>Get AI Feedback (WIP)</Button>
        </CardFooter>
      </Card>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Your Past Attempts</h3>
        {savedAttempts.length > 0 ? (
          <ul className="space-y-6"> {/* Increased spacing */}
            {savedAttempts.map((attempt) => {
              const today = new Date().toISOString().split('T')[0];
              const evaluations = (attempt.evaluations as any[] || []);
              const latestEval = evaluations.length > 0 ? evaluations[evaluations.length - 1] : null;
              const isEvaluatedTodayForThisAttempt = evaluations.some(
                (evalRecord: any) => typeof evalRecord.evaluatedAt === 'string' && evalRecord.evaluatedAt.startsWith(today)
              );

              return (
                <li key={attempt.id} className="p-4 border rounded-lg bg-card shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-xs text-muted-foreground">
                      Saved on: {new Date(attempt.savedAt).toLocaleString()}
                    </p>
                    {!isEvaluatedTodayForThisAttempt ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleGetAIFeedback(attempt.id)}
                        disabled={evaluatingAttemptId === attempt.id}
                        className="text-xs px-2 py-1 h-auto" // Smaller button
                      >
                        {evaluatingAttemptId === attempt.id ? (
                          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                        ) : null}
                        Get AI Feedback
                      </Button>
                    ) : (
                      <Badge variant="secondary" className="text-xs">Feedback given today</Badge>
                    )}
                  </div>
                  <p className="whitespace-pre-wrap mb-3">{attempt.answer}</p>
                  {latestEval && (
                    <div className="mt-2 p-3 border rounded bg-sky-50 dark:bg-sky-900/30">
                      <p className="text-xs font-medium text-sky-700 dark:text-sky-300 mb-1">
                        AI Feedback (evaluated at: {new Date(latestEval.evaluatedAt).toLocaleString()}):
                      </p>
                      <p className="text-sm whitespace-pre-wrap">{latestEval.feedback}</p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="p-6 bg-muted rounded-lg text-center">
            <p className="text-sm text-gray-500">You have no saved attempts for this question yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
