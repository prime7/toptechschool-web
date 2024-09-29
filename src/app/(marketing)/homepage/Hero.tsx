import React from "react";
import {
  CheckCircle,
  Zap,
  Users,
  BookOpen,
  Brain,
  ArrowRight,
} from "lucide-react";
import { FeatureItem } from "./Feature";

export const Hero: React.FC = () => {
  return (
    <section className="mb-24">
      <h2 className="text-3xl font-bold text-center mb-12">Our Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        <FeatureItem
          icon={<CheckCircle className="h-8 w-8 text-primary" />}
          title="Resume Tools"
          description="Evaluate, optimize for ATS, and craft perfect resumes"
        />
        <FeatureItem
          icon={<Zap className="h-8 w-8 text-primary" />}
          title="Job Preparation"
          description="AI-powered guidance and planning for your dream job"
        />
        <FeatureItem
          icon={<Users className="h-8 w-8 text-primary" />}
          title="AI Mentor"
          description="Personalized mentorship for career growth"
        />
        <FeatureItem
          icon={<BookOpen className="h-8 w-8 text-primary" />}
          title="Interview Assistance"
          description="Chat-based behavioral interview preparation"
        />
        <FeatureItem
          icon={<ArrowRight className="h-8 w-8 text-primary" />}
          title="Career Development"
          description="Social media optimization and content creation tools"
        />
        <FeatureItem
          icon={<Brain className="h-8 w-8 text-primary" />}
          title="Mental Helper"
          description="AI agent to focus on crucial career steps"
        />
      </div>
    </section>
  );
};
