"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, CheckCircle, Loader2 } from "lucide-react"
import { useApi } from "@/hooks/use-api"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

interface VerificationResponse {
  message: string
}

export default function EmailVerificationPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const { execute, isLoading, isError, isSuccess, error } = useApi<VerificationResponse>()
  const { execute: executeVerifyEmail, isLoading: isLoadingVerifyEmail, isSuccess: isSuccessVerifyEmail, error: errorVerifyEmail } = useApi<VerificationResponse>()

  const handleSendVerificationEmail = async () => {
    try {
      await execute({
        url: "/api/auth/verify-email",
        method: "POST"
      })
    } catch (err) {
      console.error("Failed to send verification email:", err)
    }
  }

  const handleVerifyEmail = async () => {
    try {
      await executeVerifyEmail({
        url: `/api/auth/verify-email?token=${token}`,
        method: "GET"
      })
    } catch (err) {
      console.error("Failed to verify email:", err)
    }
  }

  useEffect(() => {
    if (token) {
      handleVerifyEmail()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (token) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] bg-gradient-to-b from-background to-muted/20">
        <div className="w-full max-w-2xl p-4">
          <Card className="shadow-lg border-muted/20">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                {isLoadingVerifyEmail ? (
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                ) : isSuccessVerifyEmail ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <Mail className="h-6 w-6 text-primary" />
                )}
                <CardTitle className="text-2xl font-bold">
                  {isLoadingVerifyEmail ? "Verifying email..." : isSuccessVerifyEmail ? "Email Verified!" : "Verification Failed"}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground leading-relaxed text-center">
                {isLoadingVerifyEmail 
                  ? "Please wait while we verify your email address."
                  : isSuccessVerifyEmail 
                    ? "Your email has been successfully verified!"
                    : errorVerifyEmail || "Failed to verify email. Please try again."
                }
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] bg-gradient-to-b from-background to-muted/20">
      <div className="w-full max-w-2xl p-4">
        <Card className="shadow-lg border-muted/20">
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Mail className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground leading-relaxed text-center">
              Please verify your email address to access all features. Click the button below to send a verification email.
            </p>
            <div className="flex flex-col items-center gap-4">
              <Button
                className="w-full sm:w-auto"
                size="lg"
                onClick={handleSendVerificationEmail}
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Verification Email"}
              </Button>
              {isSuccess && (
                <p className="text-green-500">Verification email sent successfully!</p>
              )}
              {isError && (
                <p className="text-red-500">{error || "Failed to send verification email. Please try again."}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}