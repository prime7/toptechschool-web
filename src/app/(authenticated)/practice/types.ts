export type PracticeSet = {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  instructions: string
  tips: string[]
  questions: PracticeQuestion[]
}

export type PracticeQuestion = {
  id: string
  question: string
  type: 'multiple_choice' | 'text'
  options?: string[]
  correctAnswer?: string
  explanation?: string
  hints?: string[]
}
