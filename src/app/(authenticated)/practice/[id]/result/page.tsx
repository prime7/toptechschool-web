import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getPracticeSet, getPracticeAttempt } from "@/actions/practice"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { revalidatePath } from "next/cache"

interface QuestionAnalysis {
  questionText: string
  answer: string
  feedback: string
  improvement: string
}

interface PracticeAnalysis {
  questionAnalysis: QuestionAnalysis[]
}

export default async function PracticeResultPage({ params }: { params: { id: string } }) {
  const practiceSet = await getPracticeSet(params.id)
  if (!practiceSet) {
    redirect("/practice")
  }

  const { practiceTest } = await getPracticeAttempt(params.id)
  if (!practiceTest) {
    redirect(`/practice/${params.id}`)
  }

  revalidatePath(`/practice`)

  const analysis = practiceTest.aiAnalysis as unknown as PracticeAnalysis
  if (!analysis?.questionAnalysis) {
    redirect(`/practice/${params.id}`)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">{practiceSet.title} Results</h1>
          <Link href="/practice">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Practice Sets
            </Button>
          </Link>
        </div>

        <div className="mb-4 text-gray-600 dark:text-gray-300">
          Completed on {new Date(practiceTest.createdAt).toLocaleDateString()}
          {practiceTest.totalTime && (
            <span className="ml-4">
              Time taken: {Math.floor(practiceTest.totalTime / 60)}m {practiceTest.totalTime % 60}s
            </span>
          )}
        </div>

        <div className="space-y-6">
          {analysis.questionAnalysis.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                    {index + 1}
                  </span>
                  <CardTitle>Question {index + 1}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                    <span className="text-primary">Question</span>
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">{item.questionText}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                    <span className="text-blue-600 dark:text-blue-400">Your Answer</span>
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">{item.answer}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                    <span className="text-green-600 dark:text-green-400">Feedback</span>
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{item.feedback}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                    <span className="text-purple-600 dark:text-purple-400">Improvement Suggestions</span>
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{item.improvement}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 