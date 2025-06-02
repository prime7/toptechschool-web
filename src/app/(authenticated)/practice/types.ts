export interface Question {
  id: string;
  title: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  instructions: string;
  hints: string[];
  sampleAnswer?: string;
}

export type QuestionCategory =
  | "Situational"
  | "Behavioral"
  | "Problem Solving"
  | "Background"
  | "Technical"
  | "Value Based"
  | "Culture Fit";