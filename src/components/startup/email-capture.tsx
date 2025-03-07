"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("/api/template-requests", { email });

      if (response.status === 200) {
        setIsSubmitted(true);
      } else {
        toast({
          title: "Oops!",
          description: response.data.message || "Something went wrong.",
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Oops!",
          description:
            error.response?.data?.message || "An unexpected error occurred.",
        });
      } else {
        toast({
          title: "Oops!",
          description: "An unexpected error occurred.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="email-capture" className="bg-muted py-16 md:py-24 rounded-xl">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl">
          <Card className="border-none rounded-xl shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl sm:text-3xl">
                Get Instant Access to Our Lean Startup Template
              </CardTitle>
              <CardDescription className="text-base sm:text-lg">
                Enter your email below and we&apos;ll send you access to our
                premium Notion template.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {!isSubmitted ? (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
                >
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1"
                    aria-label="Email Address"
                  />

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="gap-1.5"
                    aria-label="Submit Email"
                  >
                    {isLoading ? "Sending..." : "Get Access"}
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <div className="flex flex-col items-center space-y-4 py-6 text-center">
                  <div className="rounded-full bg-primary/10 p-3">
                    <CheckCircle2 className="h-10 w-10 text-green-400" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">
                      Email Sent Successfully!
                    </h3>
                    <p className="text-muted-foreground">
                      Please check your inbox at{" "}
                      <span className="font-medium">{email}</span> for access to
                      your Lean Startup template.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-center border-t bg-muted/50 px-6 py-4">
              <p className="text-center text-sm text-muted-foreground">
                By submitting, you agree to receive emails from us. We&apos;ll
                never share your information.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
