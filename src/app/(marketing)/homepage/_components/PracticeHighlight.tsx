'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Search, Eye, Save, Star, NotebookPen, Mic } from "lucide-react"
import { Section } from "@/components/common/Section"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { memo } from "react"
import { Separator } from "@/components/ui/separator"

const CATEGORIES = [
  { name: "All", count: 23, active: true },
  { name: "Situational", count: 8, active: false },
  { name: "Behavioral", count: 12, active: false },
  { name: "Problem Solving", count: 6, active: false },
  { name: "Background", count: 5, active: false },
  { name: "Technical", count: 7, active: false },
  { name: "Value Based", count: 4, active: false },
  { name: "Culture Fit", count: 3, active: false },
] as const

const FEATURES = [
  {
    icon: <Search className="h-7 w-7 text-green-600 dark:text-green-400 stroke-[1.5]" />,
    title: "Smart Question Search",
    description: "Instantly find relevant questions with our intelligent search and filtering system.",
    bgColor: "bg-green-100 dark:bg-green-950/50"
  },
  {
    icon: <svg className="h-7 w-7 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" className="stroke-current" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="6" className="stroke-current" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2" className="stroke-current" strokeWidth="1.5" />
    </svg>,
    title: "Category-Based Learning",
    description: "Focus on specific areas: Behavioral, Technical, Situational, and more.",
    bgColor: "bg-blue-100 dark:bg-blue-950/50"
  },
  {
    icon: <svg className="h-7 w-7 text-purple-600 dark:text-purple-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" className="stroke-current" strokeWidth="1.5" />
      <path d="M8 12L11 15L16 9" className="stroke-current" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
    title: "Progress Tracking",
    description: "Monitor your improvement with detailed analytics and completion tracking.",
    bgColor: "bg-purple-100 dark:bg-purple-950/50"
  }
] as const

const PRACTICE_QUESTIONS = [
  { title: "Tell me about yourself", category: "Background" },
  { title: "What is your greatest strength?", category: "Behavioral" },
  { title: "What is your greatest weakness?", category: "Behavioral" },
  { title: "Why should we hire you?", category: "Situational" },
  { title: "Describe your most challenging project", category: "Technical" },
  { title: "Tell me about a time you showed leadership", category: "Behavioral" },
] as const

const STAR_STEPS = [
  "Describe project context",
  "Explain key challenges",
  "Detail your solution",
  "Share outcomes"
] as const

const SUGGESTIONS = [
  "Add context about initial problem and impact",
  "Include specific technical challenges",
  "Describe optimization techniques used",
  "Share key learnings"
] as const

const STATS = [
  { label: "Not Attempted", count: 22 },
  { label: "All Questions", count: 23 },
  { label: "Attempted", count: 1 }
] as const

const FeatureCard = memo(({ feature }: { feature: typeof FEATURES[number] }) => (
  <Card className="group border-none bg-transparent transition-transform hover:translate-x-1">
    <CardContent className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 p-0">
      <div
        className={cn("w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center flex-shrink-0", feature.bgColor)}
        aria-hidden="true"
      >
        {feature.icon}
      </div>
      <div className="flex-1">
        <CardTitle className="text-lg sm:text-xl mb-2 sm:mb-3">
          {feature.title}
        </CardTitle>
        <CardDescription className="text-foreground dark:text-muted-foreground text-sm sm:text-base leading-relaxed">
          {feature.description}
        </CardDescription>
      </div>
    </CardContent>
  </Card>
))
FeatureCard.displayName = 'FeatureCard'

const QuestionCard = memo(({ question }: { question: typeof PRACTICE_QUESTIONS[number] }) => (
  <Card className="bg-gray-900 border-gray-800 hover:bg-gray-900/80 transition-colors cursor-pointer group">
    <CardContent className="p-3">
      <Badge variant="secondary" className="mb-2 text-xs bg-gray-950 text-background dark:text-muted-foreground px-2 py-0.5">
        {question.category}
      </Badge>
      <h4 className="text-white text-xs font-medium mb-2 group-hover:text-green-400 transition-colors line-clamp-2">
        {question.title}
      </h4>
      <div className="flex items-center justify-between">
        <span className="text-green-400 text-xs">Practice Question</span>
        <ArrowRight className="h-3 w-3 text-green-400" />
      </div>
    </CardContent>
  </Card>
))
QuestionCard.displayName = 'QuestionCard'

const CategoryButton = memo(({ category }: { category: typeof CATEGORIES[number] }) => (
  <Button
    variant={category.active ? "default" : "secondary"}
    size="sm"
    className={cn(
      "px-3 py-1 rounded-full text-[10px] font-semibold h-auto",
      category.active
        ? "bg-green-500/90 text-background hover:bg-green-600/90"
        : "bg-gray-800/90 text-background dark:text-muted-foreground hover:bg-gray-700/90"
    )}
  >
    {category.name}
  </Button>
))
CategoryButton.displayName = 'CategoryButton'

export const PracticeHighlight = memo(() => {
  return (
    <Section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <Badge className="mb-8 py-1.5 px-4 bg-emerald-100/80 hover:bg-emerald-100/80 dark:bg-emerald-900/40 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-sm">
            <NotebookPen size={16} className="-rotate-45 mr-2" />
            AI-Powered Interview Practice
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 text-gray-900 dark:text-white">
            Practice Interview Questions
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-2">
            Sharpen your skills with our comprehensive collection of interview questions. Practice individual questions, save your answers, and get AI feedback.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 sm:gap-8 items-start mb-8 sm:mb-12 lg:mb-16">
          <div className="lg:col-span-2 space-y-8 sm:space-y-12 lg:sticky lg:top-24 lg:self-start">
            <div className="space-y-6 sm:space-y-8">
              {FEATURES.map((feature, index) => (
                <FeatureCard key={index} feature={feature} />
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/practice" className="sm:w-auto w-full">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold px-6 sm:px-10 py-2.5 sm:py-3 w-full h-auto rounded-full transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] text-sm sm:text-base"
                >
                  Start Practicing Now
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-3 mt-12 lg:mt-0">
            {/* Question Interface Preview */}
            <div className="relative">
              <Card className="shadow-2xl border-0 overflow-">
                <CardHeader className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-950 rounded-t-xl border-b border-gray-800">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 text-center text-xs lg:text-sm text-background dark:text-muted-foreground bg-gray-900 rounded-full px-3 py-1 mx-4">
                      toptechschool.com/practice
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-48 bg-gray-950 sm:rounded-bl-xl p-3 sm:p-4 border-b sm:border-b-0 sm:border-r border-gray-800">
                      <div className="relative mb-4">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-background dark:text-muted-foreground h-3 w-3" />
                        <Input
                          type="text"
                          placeholder="Search questions..."
                          className="w-full bg-gray-900/75 text-background dark:text-muted-foreground pl-7 pr-2 py-1.5 rounded border-gray-800 focus:ring-0 placeholder:text-xs placeholder:text-background dark:placeholder:text-muted-foreground"
                        />
                      </div>

                      <div className="flex flex-wrap gap-1 mb-6">
                        {CATEGORIES.map((category) => (
                          <CategoryButton key={category.name} category={category} />
                        ))}
                      </div>

                      <div className="mb-4">
                        <div className="text-xs text-background dark:text-muted-foreground mb-1">1 of 23 completed</div>
                        <Progress value={4} className="h-1 mb-4" />

                        <div className="space-y-1">
                          {STATS.map((stat, index) => (
                            <div key={index} className="flex items-center justify-between text-background dark:text-muted-foreground text-xs">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full border border-background dark:border-muted-foreground"></div>
                                {stat.label}
                              </div>
                              <span>{stat.count}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2 text-xs dark:text-muted-foreground"
                      >
                        <Eye size={16} />
                        Review Answers
                      </Button>
                    </div>

                    <div className="flex-1 p-3 sm:p-4 bg-gray-950 sm:rounded-br-xl">
                      <div className="text-center mb-4">
                        <h3 className="text-base sm:text-lg font-bold text-background mb-1 text-foreground">Practice Interview Questions</h3>
                        <p className="text-xs text-background dark:text-muted-foreground">Sharpen your skills with our comprehensive collection</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative">
                        {PRACTICE_QUESTIONS.map((question, index) => (
                          <QuestionCard key={index} question={question} />
                        ))}

                        <div className="absolute -bottom-32 right-[20%] lg:right-[40%] z-20">
                          <svg width="200" height="240" viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-500/50">
                            <path
                              d="M40 0C80 0 180 60 180 120C180 180 120 220 60 230L70 240L50 230L60 220"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeDasharray="6 6"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Badge
                variant="default"
                className="absolute -top-4 -right-2 bg-gradient-to-r from-green-500 to-green-600 text-black font-semibold shadow-lg"
              >
                AI Feedback
              </Badge>
              <Badge
                variant="default"
                className="absolute -bottom-2 -left-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-lg"
              >
                Real-Time Progress
              </Badge>
            </div>

            {/* Answer Interface Preview */}
            <div className="mt-12 sm:mt-16 lg:mt-24 relative">
              <Card className="bg-gray-950 shadow-2xl border-0 rounded-xl overflow-hidden">
                <CardHeader className="px-4 py-3 border-b border-gray-800/30">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 text-center text-sm text-background dark:text-muted-foreground bg-gray-900 rounded-full px-3 py-1 mx-1">
                      <span className="text-xs lg:text-sm">toptechschool.com/practice/answer</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 sm:p-6">
                  <Card className="bg-gray-900 border-0 rounded-xl">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-6">
                        <h3 className="text-lg font-semibold text-background dark:text-foreground">
                          Describe your most challenging project
                        </h3>
                        <div className="text-xs text-background dark:text-muted-foreground">200 chars</div>
                      </div>

                      <div className="relative">
                        <textarea
                          className="w-full bg-gray-950 text-background dark:text-muted-foreground text-sm p-4 rounded-lg resize-none focus:outline-none min-h-[200px] mb-2 whitespace-pre-line"
                          defaultValue={`Built a cloud automation platform with AWS, Next.js, and Prisma

Challenge: Designed scalable system for resource management and automation

Solution: Implemented microservices architecture and optimized API performance

Results:
• 40% faster provisioning
• 500+ active users
• Improved reliability`}
                          disabled
                        ></textarea>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute right-3 top-3 p-2 rounded-lg bg-gray-900 text-background dark:text-muted-foreground"
                        >
                          <Mic size={14} />
                        </Button>
                      </div>
                      <div className="text-xs text-background/50 dark:text-muted-foreground">Click mic to record • Auto-punctuation enabled</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-900 mt-4 border-0 rounded-xl">
                    <CardContent className="p-6 text-sm">
                      <p className="text-background dark:text-muted-foreground mb-4">
                        Use STAR method to describe your experience:
                      </p>
                      <p className="text-background dark:text-muted-foreground mb-6">
                        Focus on project context, challenges, and measurable results.
                      </p>
                      <ul className="space-y-3">
                        {STAR_STEPS.map((text, index) => (
                          <li key={index} className="flex items-center gap-3">
                            <Badge variant="secondary" className="text-green-400 bg-green-500/10">
                              {index + 1}
                            </Badge>
                            <span className="text-sm text-background dark:text-muted-foreground">{text}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white gap-1 text-sm">
                      <Save size={16} />
                      Save Answer
                    </Button>
                    <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white gap-1 text-sm">
                      <Star size={16} />
                      Get Feedback
                    </Button>
                    <Button variant="outline" className="dark:text-muted-foreground hover:text-muted-foreground text-sm">
                      Clear
                    </Button>
                  </div>

                  <Separator className="my-4 bg-gray-800/50" />

                  <Card className="bg-gray-900 border-0 rounded-xl">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-1 h-5 bg-green-500 rounded-full"></div>
                        <h4 className="text-white text-sm font-medium">Feedback</h4>
                        <div className="ml-auto flex items-center justify-center w-10 h-10 rounded-full border-2 border-green-500/30 text-green-400">
                          <span className="text-sm">8/10</span>
                        </div>
                      </div>

                      <p className="text-background dark:text-muted-foreground mb-6 text-sm">
                        Good structure and clear results. Add more specific details about technical challenges and implementation approach.
                      </p>

                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-1 h-5 bg-green-500 rounded-full"></div>
                        <h4 className="text-background text-sm font-medium">Suggestions</h4>
                      </div>
                      <ul className="space-y-3 text-background dark:text-muted-foreground text-sm">
                        {SUGGESTIONS.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <Badge variant="secondary" className="text-green-400 bg-green-500/10">
                              {index + 1}
                            </Badge>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-8">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-1 h-5 bg-green-500 rounded-full"></div>
                          <h4 className="text-background text-sm font-medium">Answer</h4>
                        </div>
                        <p className="text-background dark:text-muted-foreground whitespace-pre-line text-sm">
                          Project: Cloud automation platform (AWS, Next.js, Prisma). Challenge: Built scalable system for resource management. Approach: Microservices architecture, API optimization, role-based access. Results: 40% faster provisioning, 500+ active users, high reliability scores.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
})
PracticeHighlight.displayName = 'PracticeHighlight'
