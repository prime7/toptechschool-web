import { BrainCircuit, Sparkles, Trophy, FilePlus2 } from 'lucide-react';
import { Feature } from './types';

export const FEATURES: Feature[] = [
  {
    icon: FilePlus2,
    title: 'Master Resume Builder',
    description: 'Create a comprehensive master resume and easily import sections to build tailored resumes for different job applications, saving you time and effort.',
    features: [
      'Save time and effort',
      'Maintain consistency across applications',
      'Quickly customize for each job',
    ],
  },
  {
    icon: Sparkles,
    title: 'Practice Interview Questions',
    description: 'Sharpen your skills with our comprehensive collection of interview questions. Practice individual questions, save your answers, and get AI feedback.',
    features: [
      'Comprehensive question collection',
      'Save and review your answers',
      'Get AI feedback on your responses',
      'Track your progress',
    ],
  },
  {
    icon: BrainCircuit,
    title: 'Resume Feedback',
    description: 'Get instant, personalized feedback on your resume with our advanced AI engine. Optimize your profile for ATS systems and hiring managers.',
    features: [
      'ATS Optimization',
      'Keyword Analysis',
      'Industry-Specific Tips',
    ],
  },
  {
    icon: Sparkles,
    title: 'Smart Job Validation',
    description: 'Our browser extension analyzes job postings in real-time, helping you identify the most promising opportunities instantly.',
    features: [
      'Company Culture Insights',
      'Skills Match Score',
      'Salary Range Analysis',
    ],
    comingSoon: true,
  },
  {
    icon: Trophy,
    title: 'Expert Mentorship',
    description: 'Connect with industry veterans who\'ve walked your path and can guide you to success in your tech career.',
    features: [
      '1-on-1 Sessions',
      'Career Planning',
      'Mock Interviews',
    ],
    comingSoon: true,
  },
]; 