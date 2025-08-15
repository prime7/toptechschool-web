"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, Shield, ArrowRight, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Section } from "@/components/common/Section";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import Image from "next/image";

const userImages = [
  "/images/startup/user1.png",
  "/images/startup/user2.png",
  "/images/startup/user3.png",
  "/images/startup/user4.png",
];

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
            title: response.data.message,
            description: response.data.error || "Please try again later.",
            variant: "destructive",
          });
        }
      })
      .catch((error) => {
        console.error("Template request error:", error);

        // Format error message for better debugging
        const errorData = error.response?.data;
        const errorMessage =
          errorData?.error?.message || errorData?.error || "Unknown error";
        const errorCode = errorData?.error?.code
          ? `[${errorData.error.code}]`
          : "";
        const errorDetails = errorData?.error?.details
          ? JSON.stringify(errorData.error.details)
          : "";

        const formattedError = [
          errorMessage,
          errorCode,
          errorDetails,
          `Environment: ${process.env.NODE_ENV || "unknown"}`,
        ]
          .filter(Boolean)
          .join(" ");

        toast({
          title: errorData?.message || "Request failed",
          description: formattedError,
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Section
      id="email-capture"
      className="relative flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-emerald-200 opacity-20 rounded-full mix-blend-multiply filter blur-2xl animate-blob" />
        <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-teal-200 opacity-20 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-2000" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CardHeader className="space-y-4 p-0">
            <Badge className="mb-4 w-fit mx-auto py-1.5 px-4 bg-emerald-100/80 dark:bg-emerald-800/20 text-emerald-600 text-sm">
              <Zap size={16} className="mr-2" />
              FREE TEMPLATE
            </Badge>

            <CardTitle className="text-4xl sm:text-5xl font-bold mb-4 text-foreground leading-tight">
              Get Your Free Lean Startup Template
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 dark:text-muted-foreground max-w-2xl mx-auto">
              Accelerate your startup journey with our comprehensive Notion
              template.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 mt-8">
            {!isSubmitted ? (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                onSubmit={handleSubmit}
                className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 max-w-xl mx-auto"
              >
                <div className="flex-1 relative">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 text-base transition-all duration-200 focus:ring-0 pr-4 pl-4 rounded-full"
                    aria-label="Email Address"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-12 px-6 text-base font-medium bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white transition-all duration-200 shadow-xl hover:shadow-2xl rounded-full"
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
              </motion.form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center space-y-6 py-8 text-center animate-fadeIn max-w-md mx-auto"
              >
                <div className="rounded-full bg-emerald-100 p-3 ring-4 ring-emerald-50">
                  <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold">
                    Template Access Granted
                  </h3>
                  <p className="text-gray-600 dark:text-muted-foreground text-base">
                    We&apos;ve sent access instructions to{" "}
                    <span className="font-semibold text-emerald-600">
                      {email}
                    </span>
                    . Please check your inbox and spam folder.
                  </p>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-12"
            >
              <p className="text-sm font-medium text-gray-700 dark:text-muted-foreground mb-4">
                Join 500+ startups already growing with us.
              </p>
              <div className="flex justify-center -space-x-4">
                {userImages.map((src, index) => (
                  <motion.div
                    key={src}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.8 + index * 0.1,
                      type: "spring",
                      stiffness: 120,
                    }}
                    className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-800 overflow-hidden"
                  >
                    <Image
                      src={src}
                      alt={`User ${index + 1}`}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center text-sm text-gray-600 dark:text-muted-foreground flex items-center justify-center gap-2 mt-8"
            >
              <Shield className="h-4 w-4" />
              Your data is secure. We respect your privacy.
            </motion.p>
          </CardContent>
        </motion.div>
      </div>
    </Section>
  );
}
