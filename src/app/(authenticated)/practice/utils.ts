export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "beginner":
      return "bg-green-500"
    case "intermediate":
      return "bg-yellow-500"
    case "advanced":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}
