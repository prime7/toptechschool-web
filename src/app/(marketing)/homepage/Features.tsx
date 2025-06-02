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
          <div className="bg-card p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-primary/10 w-14 h-14 flex items-center justify-center rounded-lg mb-6">
              <FilePlus2 className="text-primary" size={28} />
            </div>
            <h3 className="text-2xl font-semibold mb-4">
              Master Resume Builder
            </h3>
            <p className="text-base text-muted-foreground mb-6">
              Create a comprehensive master resume and easily import sections to
              build tailored resumes for different job applications, saving you
              time and effort.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-muted-foreground">
                <CheckCircle2 className="text-primary mr-2" size={16} />
                Save time and effort
              </li>
              <li className="flex items-center text-muted-foreground">
                <CheckCircle2 className="text-primary mr-2" size={16} />
                Maintain consistency across applications
              </li>
              <li className="flex items-center text-muted-foreground">
                <CheckCircle2 className="text-primary mr-2" size={16} />
                Quickly customize for each job
              </li>
            </ul>
          </div>

          {/* Resume Feedback */}
          <div className="bg-card p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-primary/10 w-14 h-14 flex items-center justify-center rounded-lg mb-6">
              <BrainCircuit className="text-primary" size={28} />
            </div>
            <h3 className="text-2xl font-semibold mb-4">
              AI-Powered Resume Analysis
            </h3>
            <p className="text-base text-muted-foreground mb-6">
              Get instant, personalized feedback on your resume with our
              advanced AI engine. Optimize your profile for ATS systems and
              hiring managers.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-muted-foreground">
                <CheckCircle2 className="text-primary mr-2" size={16} />
                ATS Optimization
              </li>
              <li className="flex items-center text-muted-foreground">
                <CheckCircle2 className="text-primary mr-2" size={16} />
                Keyword Analysis
              </li>
              <li className="flex items-center text-muted-foreground">
                <CheckCircle2 className="text-primary mr-2" size={16} />
                Industry-Specific Tips
              </li>
            </ul>
          </div>

          {/* Job Validation */}
          <div className="bg-card p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-primary/10 w-14 h-14 flex items-center justify-center rounded-lg mb-6">
              <Sparkles className="text-primary" size={28} />
            </div>
            <h3 className="text-2xl font-semibold mb-4">
              Smart Job Validation
            </h3>
            <p className="text-base text-muted-foreground mb-6">
              Our browser extension analyzes job postings in real-time, helping
              you identify the most promising opportunities instantly.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-muted-foreground">
                <CheckCircle2 className="text-primary mr-2" size={16} />
                Salary Range Analysis
              </li>
              <li className="flex items-center text-muted-foreground">
                <CheckCircle2 className="text-primary mr-2" size={16} />
                Company Culture Insights
              </li>
              <li className="flex items-center text-muted-foreground">
                <CheckCircle2 className="text-primary mr-2" size={16} />
                Skills Match Score
              </li>
            </ul>
          </div>

          {/* Mentorship */}
          <div className="bg-card p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-primary/10 w-14 h-14 flex items-center justify-center rounded-lg mb-6">
              <Trophy className="text-primary" size={28} />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Expert Mentorship</h3>
            <p className="text-base text-muted-foreground mb-6">
              Connect with industry veterans who&apos;ve walked your path and
              can guide you to success in your tech career.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-muted-foreground">
                <CheckCircle2 className="text-primary mr-2" size={16} />
                1-on-1 Sessions
              </li>
              <li className="flex items-center text-muted-foreground">
                <CheckCircle2 className="text-primary mr-2" size={16} />
                Career Planning
              </li>
              <li className="flex items-center text-muted-foreground">
                <CheckCircle2 className="text-primary mr-2" size={16} />
                Mock Interviews
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
};
