import { useEffect, useState } from "react"

export const useTimer = (startTime: number | null) => {
  const [timeSpent, setTimeSpent] = useState(0)

  useEffect(() => {
    if (startTime) {
      const interval = setInterval(() => {
        const currentTime = Date.now()
        setTimeSpent(Math.floor((currentTime - startTime) / 1000))
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [startTime])

  return timeSpent
}
