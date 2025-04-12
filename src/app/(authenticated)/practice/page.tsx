import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { PracticeSet } from "./types"
import { getPracticeSets, getPracticeAttempts } from "@/actions/practice"
import { getDifficultyColor } from "./utils"
import { CheckCircle2 } from "lucide-react"

export default async function PracticePage() {
  const practiceSets = await getPracticeSets()
  const practiceAttempts = await getPracticeAttempts()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Practice Sets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {practiceSets.map((set: PracticeSet, index) => (
          <Card key={set.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{set.title}</CardTitle>
                {practiceAttempts[index] && (
                  <CheckCircle2 className="text-green-500 h-5 w-5" />
                )}
              </div>
              <CardDescription>{set.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{set.category}</Badge>
                  <Badge className={getDifficultyColor(set.difficulty)}>
                    {set.difficulty}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500">
                  {set.questions.length} questions
                </div>
                <Link href={practiceAttempts[index] ? `/practice/${set.id}/result` : `/practice/${set.id}`} className="w-full">
                  <Button className="w-full">
                    {practiceAttempts[index] ? "View Results" : "Start Practice"}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
