  import { BookOpen, Target, TrendingUp } from "lucide-react";
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import { auth } from "@/lib/auth";
  import { getUserAllAnswers } from "@/actions/practice";
  import { questions } from "@/app/(authenticated)/practice/data";
  import { Button } from "@/components/ui/button";

  interface PracticeAnswer {
    id: string;
    userId: string;
    questionId: string;
    answer: string;
    score: number | null;
    updatedAt: Date;
  }

  interface DashboardStats {
    totalQuestions: number;
    attemptedQuestions: number;
    unattemptedQuestions: number;
    averageScore: number;
    progressPercentage: number;
  }

  async function getDashboardStats(): Promise<DashboardStats> {
    const session = await auth();
    
    if (!session?.user?.id) {
      return {
        totalQuestions: questions.length,
        attemptedQuestions: 0,
        unattemptedQuestions: questions.length,
        averageScore: 0,
        progressPercentage: 0,
      };
    }

    const answers = await getUserAllAnswers() as PracticeAnswer[];
    const scoresOnly = answers.filter((answer: PracticeAnswer) => answer.score !== null);
    const averageScore = scoresOnly.length > 0 
      ? scoresOnly.reduce((sum: number, answer: PracticeAnswer) => sum + (answer.score || 0), 0) / scoresOnly.length
      : 0;

    const progressPercentage = Math.round((answers.length / questions.length) * 100);

    return {
      totalQuestions: questions.length,
      attemptedQuestions: answers.length,
      unattemptedQuestions: questions.length - answers.length,
      averageScore: Math.round(averageScore * 10) / 10,
      progressPercentage,
    };
  }

  export default async function Dashboard() {
    const stats = await getDashboardStats();

    return (
      <div className="container mx-auto py-8">
        <div className="grid gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          </div>
          
          <section>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Progress</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.progressPercentage}%</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.attemptedQuestions} of {stats.totalQuestions} completed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Performance</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.averageScore > 0 ? `${stats.averageScore}/10` : 'N/A'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Average score from AI feedback
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Next Steps</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.unattemptedQuestions}</div>
                  <p className="text-xs text-muted-foreground mb-4">Questions remaining</p>
                  <Button 
                    asChild
                    className="w-full"
                  >
                    <a href="/practice">Continue Practice</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    );
  }