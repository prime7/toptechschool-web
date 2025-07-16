"use client";

import type React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check } from "lucide-react"
import { submitToNewsletter, newsletterSchema, type NewsletterInput } from "@/actions/newsletter"
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

export const FormSubmission: React.FC = () => {
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<NewsletterInput>({
    resolver: zodResolver(newsletterSchema),
  })

  const onSubmit = async (data: NewsletterInput) => {
    setIsSubmitting(true)
    setSubmitMessage(null)
    try {
      const result = await submitToNewsletter(data)
      setSubmitMessage(result.message)
      if (result.success) {
        form.reset()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const features = ["Get free resources", "Premium contents", "No spam, unsubscribe at any time."]

  return (
    <Card className="relative flex items-center justify-center overflow-hidden bg-background dark:bg-foreground shadow-inner rounded-2xl border-none pt-10">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-200 opacity-20 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-200 opacity-20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-40 right-0 w-64 h-64 bg-pink-200 opacity-20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-xl mx-auto p-8 text-center">
        <CardHeader className="space-y-4 p-0">
          <Badge className="mb-4 w-fit mx-auto py-1 px-4 bg-emerald-100/80 dark:bg-emerald-800/20 text-emerald-600 text-xs">
            <Zap size={14} className='mr-2' />
            NEWSLETTER
          </Badge>

          <h1 className="text-4xl sm:text-5xl font-bold sm:mb-3 text-gray-900 dark:text-background leading-tight mb-10">
            Join to get exclusive contents for free.
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto px-2">
            Stay updated with the latest features and announcements.
          </p>
        </CardHeader>

        <CardContent className="p-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
              <div className="flex flex-col items-center gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full max-w-sm">
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Your email address"
                          className="px-6 py-6 rounded-xl border text-lg placeholder:text-gray-500 placeholder:text-sm focus:ring-2 transition-all shadow-sm"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-destructive text-sm text-center font-medium mt-2" />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  size="lg"
                  className="w-full max-w-sm font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-[1.01] bg-emerald-600 text-white hover:bg-emerald-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Joining..." : "Join Now"}
                </Button>
              </div>

              {submitMessage && (
                <Alert
                  variant={submitMessage.includes("Successfully") ? "default" : "destructive"}
                  className={`mt-4 ${submitMessage.includes("Successfully")
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                    }`}
                >
                  <AlertDescription>{submitMessage}</AlertDescription>
                </Alert>
              )}
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex-wrap justify-center gap-x-8 gap-y-4 mt-8 p-0">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <Check className="h-5 w-5 text-emerald-800 dark:text-emerald-300" />
              <span className="text-sm text-gray-600">{feature}</span>
            </div>
          ))}
        </CardFooter>
      </div>
    </Card>
  )
}
