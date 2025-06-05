import React from "react";
import {
  BrainCircuit,
  CheckCircle2,
  Sparkles,
  Trophy,
  FilePlus2,
} from "lucide-react";
import { Section } from "@/components/common/Section";

export const Features: React.FC = () => {
  return (
    <Section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Cutting-Edge Features</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our platform combines AI technology with human expertise to provide
            you with the most comprehensive job search toolkit.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<FilePlus2 className="text-primary" size={28} />}
            title="Master Resume Builder"
            description="Create a comprehensive master resume and easily import sections to build tailored resumes for different job applications, saving you time and effort."
            features={[
              "Save time and effort",
              "Maintain consistency across applications",
              "Quickly customize for each job",
            ]}
          />
          <FeatureCard
            title="Practice Interview Questions"
            description="Sharpen your skills with our comprehensive collection of interview questions. Practice individual questions, save your answers, and get AI feedback."
            icon={<Sparkles className="text-primary" size={28} />}
            features={[
              "Comprehensive question collection",
              "Save and review your answers",
              "Get AI feedback on your responses",
              "Track your progress",
            ]}
          />
          <FeatureCard
            title="Resume Feedback"
            description="Get instant, personalized feedback on your resume with our advanced AI engine. Optimize your profile for ATS systems and hiring managers."
            icon={<BrainCircuit className="text-primary" size={28} />}
            features={[
              "ATS Optimization",
              "Keyword Analysis",
              "Industry-Specific Tips",
            ]}
          />
          <FeatureCard
            title="Smart Job Validation"
            description="Our browser extension analyzes job postings in real-time, helping you identify the most promising opportunities instantly."
            icon={<Sparkles className="text-primary" size={28} />}
            features={[
              "Company Culture Insights",
              "Skills Match Score",
              "Salary Range Analysis",
            ]}
            comingSoon={true}
          />
          <FeatureCard
            title="Expert Mentorship"
            description="Connect with industry veterans who've walked your path and can guide you to success in your tech career."
            icon={<Trophy className="text-primary" size={28} />}
            features={["1-on-1 Sessions", "Career Planning", "Mock Interviews"]}
            comingSoon={true}
          />
        </div>
      </div>
    </Section>
  );
};

const FeatureCard = ({
  title,
  description,
  icon,
  features,
  comingSoon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  comingSoon?: boolean;
}) => {
  return (
    <div className="bg-card p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
      <div className="bg-primary/10 w-14 h-14 flex items-center justify-center rounded-lg mb-6">
        {icon}
      </div>
      <h3 className="text-2xl font-semibold mb-4">{title}</h3>
      <p className="text-base text-muted-foreground mb-6">{description}</p>
      <ul className="space-y-2">
        {features.map((feature: string) => (
          <li className="flex items-center text-muted-foreground" key={feature}>
            <CheckCircle2 className="text-primary mr-2" size={16} />
            {feature}
          </li>
        ))}
      </ul>
      {comingSoon && <p className="text-sm text-primary mt-4">Coming soon</p>}
    </div>
  );
};
