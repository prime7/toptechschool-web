"use client";

import { Section } from "@/components/common/Section";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

const LEAN_STARTUP_PRINCIPLES = [
  {
    icon: "⚙️",
    title: "Build-Measure-Learn",
    description:
      "Transform ideas into products through rapid iteration. Measure real customer response and gather data to make informed decisions about pivoting or persevering.",
  },
  {
    icon: "🚀",
    title: "Minimum Viable Product (MVP)",
    description:
      "Launch a basic version with core features to test key business hypotheses. This allows for maximum learning with minimum resources and faster market validation.",
  },
  {
    icon: "📊",
    title: "Validated Learning",
    description:
      "Conduct systematic experiments to test business assumptions. Use empirical data and customer feedback to validate or invalidate key hypotheses about your product and market.",
  },
  {
    icon: "📈",
    title: "Innovation Accounting",
    description:
      "Implement metrics that matter - focus on actionable, accessible, and auditable data to measure progress and guide strategic decisions effectively.",
  },
  {
    icon: "🔄",
    title: "Pivot or Persevere",
    description:
      "Make data-driven decisions to either maintain course or make fundamental changes to your business model based on validated learning and market feedback.",
  },
  {
    icon: "💡",
    title: "Continuous Innovation",
    description:
      "Embrace ongoing experimentation and adaptation. Regularly test new ideas and iterate based on customer insights to maintain competitive advantage.",
  },
] as const;

interface PrincipleCardProps {
  title: string;
  description: string;
  icon: string;
}

const PrincipleCard = ({ title, description, icon }: PrincipleCardProps) => (
  <div className="transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
            <span className="text-xl">{icon}</span>
          </div>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </div>
        <CardDescription className="text-sm leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  </div>
);

export function LeanStartupPrinciples() {
  return (
    <Section className="bg-muted/50 p-16 md:p-24 rounded-xl shadow-2xl border border-border">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            The Lean Startup Methodology
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
            A scientific approach to creating and managing startups, developed by
            Eric Ries. It teaches you how to drive a startup through steering,
            when to turn, and when to persevere.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {LEAN_STARTUP_PRINCIPLES.map((principle, i) => (
            <PrincipleCard 
              key={i}
              title={principle.title} 
              description={principle.description} 
              icon={principle.icon}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
