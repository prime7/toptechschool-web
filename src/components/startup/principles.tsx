"use client";

import { CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

export function LeanStartupPrinciples() {
  const principles = [
    {
      title: "Build-Measure-Learn",
      description:
        "Turn ideas into products, measure customer response, and learn whether to pivot or persevere.",
    },
    {
      title: "Minimum Viable Product",
      description:
        "Create the simplest version of your product that allows you to start the learning process as quickly as possible.",
    },
    {
      title: "Validated Learning",
      description:
        "Run experiments to test your vision and validate business hypotheses with empirical data.",
    },
    {
      title: "Innovation Accounting",
      description:
        "Use actionable metrics to evaluate progress and prioritize work in a systematic way.",
    },
    {
      title: "Pivot or Persevere",
      description:
        "Make strategic corrections or stay the course based on validated learning from your experiments.",
    },
  ];

  return (
    <section className="bg-muted py-16 md:py-24 rounded-xl">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              The Lean Startup Methodology
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Developed by Eric Ries, the Lean Startup methodology helps
              entrepreneurs reduce market risks and avoid building products
              nobody wants.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {principles.map((principle, i) => (
            <Card key={i} className="shadow-md border-none">
              <CardContent className="flex flex-col space-y-4 p-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base font-bold">
                    {principle.title}
                  </CardTitle>
                </div>
                <CardDescription className="text-sm text-muted-foreground">
                  {principle.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
