"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, CheckCircle, Loader2 } from "lucide-react"
import { useEmailVerify } from "@/hooks/use-email-verify"
import { useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"

export default function EmailVerificationPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const { sendVerificationEmail, verifyEmail, isVerifying, verificationError, isVerified } = useEmailVerify()
  const verificationAttempted = useRef(false)

  useEffect(() => {
    if (token && !verificationAttempted.current && !isVerified) {
      verificationAttempted.current = true
      verifyEmail(token)
    }
  }, [token, verifyEmail, isVerified])

  if (token) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] bg-gradient-to-b from-background to-muted/20">
        <div className="w-full max-w-2xl p-4">
          <Card className="shadow-lg border-muted/20">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                {isVerifying ? (
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                ) : isVerified ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <Mail className="h-6 w-6 text-primary" />
                )}
                <CardTitle className="text-2xl font-bold">
                  {isVerifying ? "Verifying email..." : isVerified ? "Email Verified!" : "Verification Failed"}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground leading-relaxed text-center">
                {isVerifying 
                  ? "Please wait while we verify your email address."
                  : isVerified 
                    ? "Your email has been successfully verified!"
                    : verificationError || "Failed to verify email. Please try again."
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
                onClick={sendVerificationEmail}
                disabled={isVerifying}
              >
                {isVerifying ? "Sending..." : "Send Verification Email"}
              </Button>
              {isVerified && (
                <p className="text-green-500">Verification email sent successfully!</p>
              )}
              {verificationError && (
                <p className="text-red-500">{verificationError}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}