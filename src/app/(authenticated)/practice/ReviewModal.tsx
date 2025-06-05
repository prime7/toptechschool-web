"use client";

import React, { useState, useEffect } from "react";
import { Eye, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getUserAllAnswers } from "@/actions/practice";
import { questions } from "./data";
import { Question } from "./types";

interface AttemptedAnswer {
  id: string;
  userId: string;
  questionId: string;
  answer: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AttemptedQuestionWithDetails extends AttemptedAnswer {
  question: Question;
}

export default function ReviewModal() {
  const [attemptedQuestions, setAttemptedQuestions] = useState<AttemptedQuestionWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<AttemptedQuestionWithDetails | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadAttemptedAnswers();
  }, []);

  const loadAttemptedAnswers = async () => {
    try {
      setIsLoading(true);
      const answers = await getUserAllAnswers();
      
      const questionsWithDetails = answers
        .map((answer: AttemptedAnswer) => {
          const questionDetails = questions.find(q => q.id === answer.questionId);
          if (questionDetails) {
            return {
              ...answer,
              question: questionDetails,
            };
          }
          return null;
        })
        .filter(Boolean) as AttemptedQuestionWithDetails[];

      setAttemptedQuestions(questionsWithDetails);
    } catch (error) {
      console.error("Error loading attempted answers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          Review Answers
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Review Your Answers
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-6 h-[calc(80vh-100px)]">
          <div className="w-1/3 border-r pr-4">
            <div className="mb-4">
              <h3 className="font-semibold mb-2">
                Questions ({attemptedQuestions.length})
              </h3>
            </div>
            
            <ScrollArea className="h-full">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : attemptedQuestions.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <XCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground text-sm">
                      No attempted questions yet
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2">
                  {attemptedQuestions.map((item) => (
                    <Card
                      key={item.id}
                      className={`cursor-pointer transition-all hover:shadow-sm ${
                        selectedQuestion?.id === item.id
                          ? "ring-2 ring-primary bg-primary/5"
                          : ""
                      }`}
                      onClick={() => setSelectedQuestion(item)}
                    >
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm leading-tight">
                          {item.question.title}
                        </h4>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          <div className="flex-1">
            {selectedQuestion ? (
              <ScrollArea className="h-full">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-bold mb-2">
                      {selectedQuestion.question.title}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      {selectedQuestion.question.description}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-3">Your Answer</h3>
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {selectedQuestion.answer}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </ScrollArea>
            ) : (
              <div className="h-full flex items-center justify-center">
                <Card>
                  <CardContent className="py-12 text-center">
                    <Eye className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                    <h3 className="font-semibold mb-1">
                      Select a Question
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Choose a question to review your answer
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 