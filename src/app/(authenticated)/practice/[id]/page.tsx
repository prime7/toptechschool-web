import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { Question } from "../types";
import AnswerSubmission from "./AnswerSubmission";
import { Toaster } from "@/components/ui/toaster";
import { Card, CardContent } from "@/components/ui/card";

interface QuestionWithAnswer extends Question {
  savedAnswer?: {
    id: string;
    answer: string;
    feedback: string | null;
    score: number | null;
    suggestions: string[];
    createdAt: Date;
    updatedAt: Date;
  };
}

async function getQuestionData(id: string): Promise<QuestionWithAnswer> {
  const { questions } = await import("../data");
  const questionData = questions.find((q) => q.id === id);

  if (!questionData) {
    notFound();
  }

  const session = await auth();
  if (session?.user?.id) {
    const savedAnswer = await prisma.practiceAnswer.findUnique({
      where: {
        userId_questionId: {
          userId: session.user.id,
          questionId: id,
        },
      },
    });

    if (savedAnswer) {
      return {
        ...questionData,
        savedAnswer,
      };
    }
  }

  return questionData;
}

export default async function QuestionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const question = await getQuestionData(params.id);

  return (
    <>
      <Toaster />
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <AnswerSubmission
              questionId={params.id}
              question={question.title}
            />

            {question.savedAnswer && (
              <Card>
                <CardContent className="mt-4 relative">
                  {question.savedAnswer.score !== null && (
                    <div className="absolute top-2 right-2">
                      <div className="flex items-center justify-center h-14 w-14 rounded-full border-2 border-primary bg-background shadow-sm">
                        <div className="text-center">
                          <div className="text-lg font-bold text-foreground">
                            {question.savedAnswer.score} / 10
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-8 pt-2">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-6 w-1 bg-primary rounded-full" />
                        <h3 className="text-xl font-semibold text-foreground">
                          Saved Answer
                        </h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap pl-4">
                        {question.savedAnswer.answer}
                      </p>
                    </div>

                    {question.savedAnswer.feedback && (
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-6 w-1 bg-primary rounded-full" />
                          <h3 className="text-xl font-semibold text-foreground">
                            Feedback
                          </h3>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-lg ml-4">
                          <p className="text-muted-foreground leading-relaxed">
                            {question.savedAnswer.feedback}
                          </p>
                        </div>
                      </div>
                    )}

                    {question.savedAnswer.suggestions.length > 0 && (
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-6 w-1 bg-primary rounded-full" />
                          <h3 className="text-xl font-semibold text-foreground">
                            Suggestions
                          </h3>
                        </div>
                        <ul className="space-y-3 pl-4">
                          {question.savedAnswer.suggestions.map(
                            (suggestion, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-3 text-muted-foreground"
                              >
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">
                                  {index + 1}
                                </span>
                                <span className="pt-0.5">{suggestion}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <div className="sticky top-6">
              <Card>
                <CardContent className="space-y-6 pt-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {question.instructions}
                  </p>
                  <ul className="space-y-2">
                    {question.hints.map((hint: string, index: number) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-muted-foreground"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted/50 text-primary text-sm">
                          {index + 1}
                        </span>
                        <span>{hint}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
