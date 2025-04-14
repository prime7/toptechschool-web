import { useState, useCallback } from "react"
import axios from "axios"
import { useSession } from "next-auth/react"

export const useEmailVerify = () => {
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(null)
  const [isVerified, setIsVerified] = useState(false)
  const { update } = useSession()
  const sendVerificationEmail = useCallback(async () => {
    setIsVerifying(true)
    setVerificationError(null)

    await axios.post("/api/auth/verify-email")
      .then(() => { })
      .catch((err) => {
        setVerificationError("Failed to send verification email")
        console.error("Failed to send verification email: ", err)
      })
      .finally(() => setIsVerifying(false))
  }, [])

  const verifyEmail = useCallback(async (token: string) => {
    if (isVerifying || isVerified) return

    setIsVerifying(true)
    setVerificationError(null)

    await axios.get(`/api/auth/verify-email?token=${token}`)
      .then((data) => {
        if (data.data.success) {
          setIsVerified(true)
          update({
            user: {
              isEmailVerified: true,
            }
          })
        }
      })
      .catch((err) => {
        setVerificationError("Failed to verify email")
        console.error("Failed to verify email:", err)
      })
      .finally(() => setIsVerifying(false))
  }, [isVerifying, isVerified])

  return {
    sendVerificationEmail,
    verifyEmail,
    isVerifying,
    verificationError,
    isVerified
  }
}