import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getPracticeSet, getPracticeAttempt } from "@/actions/practice"
import Link from "next/link"
import { ArrowLeft, Play, List, Timer, Save, CheckCircle2 } from "lucide-react"
import { getDifficultyColor } from "../utils"


export default async function PracticeSetPage({ params }: { params: { id: string } }) {
  const practiceSet = await getPracticeSet(params.id)
  if (!practiceSet) {
    redirect("/practice")
  }
  const practiceAttempt = await getPracticeAttempt(params.id)
  const hasAttempted = !!practiceAttempt.practiceTest

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm">{practiceSet.category}</Badge>
                <Badge className={`${getDifficultyColor(practiceSet.difficulty)} text-white`}>
                  {practiceSet.difficulty}
                </Badge>
              </div>
              {hasAttempted && (
                <div className="flex items-center gap-2 text-green-500">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm font-medium">Completed</span>
                </div>
              )}
            </div>
            <CardTitle className="text-3xl font-bold">{practiceSet.title}</CardTitle>
            <CardDescription className="text-lg">{practiceSet.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="p-6 bg-secondary rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Practice Details</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <List className="w-5 h-5" />
                  <span>{practiceSet.questions.length} questions to answer</span>
                </li>
                <li className="flex items-center gap-3">
                  <Timer className="w-5 h-5" />
                  <span>Time tracking</span>
                </li>
                <li className="flex items-center gap-3">
                  <Save className="w-5 h-5" />
                  <span>AI-powered feedback</span>
                </li>
              </ul>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Link href={`/practice`}>
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              </Link>
              <Link href={hasAttempted ? `/practice/${params.id}/result` : `/practice/${params.id}/start`}>
                <Button className="gap-2">
                  <Play className="w-4 h-4" />
                  {hasAttempted ? "View Results" : "Start Practice"}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardContent className="space-y-8 pt-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Instructions</h3>
              <p className="text-muted-foreground">{practiceSet.instructions}</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tips</h3>
              <ul className="space-y-3">
                {practiceSet.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}