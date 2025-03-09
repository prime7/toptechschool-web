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
import { CheckCircle2, Shield, ArrowRight } from "lucide-react";
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

    axios
      .post("/api/template-requests", { email })
      .then((response) => {
        if (response.status === 200) {
          setIsSubmitted(true);
        } else {
          toast({
            title: "Submission Error",
            description: response.data.message || "Please try again later.",
            variant: "destructive",
          });
        }
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          toast({
            title: "Submission Error",
            description:
              error.response?.data?.message || "Please try again later.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Submission Error",
            description: "An unexpected error occurred. Please try again later.",
            variant: "destructive",
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <section id="email-capture" className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl">
          <Card className="overflow-hidden border rounded-xl shadow-2xl">
            <CardHeader className="text-center space-y-2 pb-6 pt-8">
              <CardTitle className="text-2xl sm:text-3xl font-bold">
                Get Your Free Template
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-muted-foreground mx-auto">
                Access our Notion template to build and validate your startup faster.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              {!isSubmitted ? (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 max-w-xl mx-auto"
                >
                  <div className="flex-1 relative">
                    <Input
                      type="email"
                      placeholder="Your work email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 text-base transition-all duration-200 focus:ring-2 focus:ring-primary/20 pr-4 pl-4"
                      aria-label="Email Address"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-12 px-6 text-base font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                    aria-label="Submit Email"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Get Instant Access
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="flex flex-col items-center space-y-6 py-8 text-center animate-fadeIn max-w-md mx-auto">
                  <div className="rounded-full bg-green-100 p-3 ring-4 ring-green-50">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold">
                      Template Access Granted
                    </h3>
                    <p className="text-muted-foreground text-base">
                      We&apos;ve sent access instructions to{" "}
                      <span className="font-semibold text-primary">{email}</span>. 
                      Please check your inbox and spam folder.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-center px-8">
              <p className="text-center text-sm text-muted-foreground flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Your data is secure. We respect your privacy and will never share your information.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
