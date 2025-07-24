"use client";

import React from "react";
import { Section } from "@/components/common/Section";
import {
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import SpotlightCard from "@/components/common/SpotlightCard";

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
  index: number;
}

const PrincipleCard: React.FC<PrincipleCardProps> = ({ title, description, icon, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1 * index }}
  >
    <SpotlightCard
      spotlightColor="rgba(0, 229, 255, 0.2)"
      className="bg-transparent backdrop-blur-sm border-none h-full"
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-100/80 dark:bg-emerald-900/30">
            <span className="text-2xl">{icon}</span>
          </div>
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
        </div>
        <CardDescription className="text-base leading-relaxed text-foreground/80 dark:text-muted-foreground">
          {description}
        </CardDescription>
      </CardContent>
    </SpotlightCard>
  </motion.div>
);

export function LeanStartupPrinciples() {
  return (
    <Section>
      <div className="container px-4 md:px-6 py-12 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-20"
        >
          <Badge className="mb-8 py-1.5 px-4 bg-emerald-100/80 hover:bg-emerald-100/80 dark:bg-emerald-900/40 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-sm">
            <Lightbulb size={16} className="mr-2" />
            Lean Startup Methodology
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Build Your Startup the Right Way
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-muted-foreground max-w-2xl mx-auto">
            A scientific approach to creating and managing startups, developed by
            Eric Ries. Learn how to drive a startup through steering,
            when to turn, and when to persevere.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {LEAN_STARTUP_PRINCIPLES.map((principle, i) => (
            <PrincipleCard
              key={i}
              index={i}
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
