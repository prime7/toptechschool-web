"use client";

import {
  BarChart3,
  Lightbulb,
  Rocket,
  Target,
  Clock,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

export function Benefits() {
  const benefits = [
    {
      icon: <Lightbulb className="h-10 w-10 text-primary" />,
      title: "Clarity of Vision",
      description:
        "Organize your startup ideas and vision in one centralized location.",
    },
    {
      icon: <Target className="h-10 w-10 text-primary" />,
      title: "Hypothesis Tracking",
      description:
        "Document and track your business hypotheses and experiments.",
    },
    {
      icon: <BarChart3 className="h-10 w-10 text-primary" />,
      title: "Metrics Dashboard",
      description:
        "Monitor key metrics and KPIs to make data-driven decisions.",
    },
    {
      icon: <Clock className="h-10 w-10 text-primary" />,
      title: "Faster Iteration",
      description:
        "Streamline your build-measure-learn cycle to iterate quickly.",
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Customer Insights",
      description:
        "Capture and organize customer feedback and interview notes.",
    },
    {
      icon: <Rocket className="h-10 w-10 text-primary" />,
      title: "Growth Framework",
      description:
        "Implement proven growth strategies with our structured templates.",
    },
  ];

  return (
    <section className="py-16 md:py-24">
      {/* Container */}
      <div className="container px-4 md:px-6">
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Why Use Our Notion Template?
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Our template provides everything you need to implement the Lean
              Startup methodology effectively.
            </p>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="mx-auto mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, i) => (
            <Card key={i} className="shadow-md">
              <CardContent className="flex flex-col items-center space-y-4 p-6 text-center">
                {/* Icon */}
                <div className="rounded-full bg-muted p-3">{benefit.icon}</div>
                {/* Title */}
                <CardTitle className="text-xl font-bold">
                  {benefit.title}
                </CardTitle>
                {/* Description */}
                <CardDescription className="text-muted-foreground">
                  {benefit.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
