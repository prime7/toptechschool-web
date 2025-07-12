'use client'

import { memo, useMemo } from 'react'
import { Section } from '@/components/common/Section'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, FileSearch, LineChart, Brain, Zap, ChevronDown } from "lucide-react"
import Link from 'next/link'
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

type Feature = {
    icon: JSX.Element
    title: string
    description: string
    bgColor: string
}

type ImprovementArea = {
    title: string
    current: string
    improved: string
    explanation: string
}

type RedFlag = {
    title: string
    severity: 'high' | 'medium' | 'low'
}

const FEATURES: readonly Feature[] = [
    {
        icon: <Brain size={24} className="text-purple-600 dark:text-purple-400 stroke-[1.5]" />,
        title: "AI-Powered Analysis",
        description: "Get instant, detailed feedback on your resume with our advanced AI engine.",
        bgColor: "bg-purple-100 dark:bg-purple-950/50"
    },
    {
        icon: <FileSearch size={24} className="text-blue-600 dark:text-blue-400 stroke-[1.5]" />,
        title: "ATS Optimization",
        description: "Ensure your resume passes Applicant Tracking Systems with our optimization tools.",
        bgColor: "bg-blue-100 dark:bg-blue-950/50"
    },
    {
        icon: <LineChart size={24} className="text-green-600 dark:text-green-400 stroke-[1.5]" />,
        title: "Industry Insights",
        description: "Receive tailored suggestions based on your target industry and role.",
        bgColor: "bg-green-100 dark:bg-green-950/50"
    }
] as const

const MISSING_SKILLS = [
    "State Management Libraries (Redux, MobX, Recoil)",
    "Performance Optimization Techniques",
    "Responsive Design Patterns",
    "Testing Frameworks (Jest, React Testing Library)",
    "Web Accessibility (WCAG) Standards"
] as const

const RED_FLAGS: readonly RedFlag[] = [
    {
        title: "Limited professional experience (only two short-term roles)",
        severity: "medium"
    },
    {
        title: "No evidence of complex frontend architecture or scalable application development",
        severity: "high"
    },
    {
        title: "Lack of quantifiable achievements and impact metrics in project descriptions",
        severity: "high"
    }
] as const

const IMPROVEMENT_AREAS: readonly ImprovementArea[] = [
    {
        title: "Work Experience",
        current: "Developed scalable frontend applications using React",
        improved: "Developed and optimized scalable frontend applications using React, improving page load performance by 40% and reducing bundle size by 25%",
        explanation: "Quantifying technical achievements demonstrates tangible impact and technical proficiency for frontend roles"
    },
    {
        title: "Projects",
        current: "Built an interactive educational web app for toddlers",
        improved: "Architected and delivered a multilingual educational web application serving 500+ daily active users with 95% positive user feedback",
        explanation: "Adding user metrics and impact highlights problem-solving skills crucial for frontend development"
    },
    {
        title: "Technical Skills",
        current: "Frameworks & Libraries: Next.js, FastAPI (Familiar)",
        improved: "Frameworks & Libraries: Next.js (Advanced), React Hooks, Redux, FastAPI (Intermediate)",
        explanation: "Clarifying proficiency levels provides more precise skill representation for hiring managers"
    }
] as const

const fadeInUpAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
}

const fadeInScaleAnimation = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, delay: 0.2 }
}

const FeatureCard = memo(({ feature }: { feature: Feature }) => {
    const iconAnimation = useMemo(() => ({
        whileHover: { scale: 1.05 },
        transition: {
            type: "spring" as const,
            stiffness: 400,
            damping: 10
        }
    }), [])

    return (
        <motion.div
            whileHover={{ x: 8 }}
            transition={{
                type: "spring" as const,
                stiffness: 400,
                damping: 10
            }}
        >
            <Card className="group border-none bg-transparent">
                <CardContent className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 p-0">
                    <motion.div
                        {...iconAnimation}
                        className={cn("w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center flex-shrink-0", feature.bgColor)}
                        aria-hidden="true"
                    >
                        {feature.icon}
                    </motion.div>
                    <div className="flex-1">
                        <h3 className="text-lg sm:text-xl text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 font-semibold">
                            {feature.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                            {feature.description}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
})
FeatureCard.displayName = 'FeatureCard'

const CircularProgress = memo(({ value }: { value: number }) => {
    const circumference = 2 * Math.PI * 40
    const strokeDasharray = useMemo(() =>
        `${circumference * value / 100} ${circumference}`,
        [value, circumference]
    )

    return (
        <div className="relative w-24 h-24">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                    className="text-gray-800"
                    strokeWidth="12"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                />
                <circle
                    className="text-green-500"
                    strokeWidth="12"
                    strokeDasharray={strokeDasharray}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-green-500">{value}%</span>
            </div>
        </div>
    )
})
CircularProgress.displayName = 'CircularProgress'

const ImprovementArea = memo(({ area, index }: { area: ImprovementArea; index: number }) => (
    <div className="relative flex">
        <div className="absolute left-0 top-0 bottom-0 flex flex-col items-center" style={{ width: '2rem' }}>
            <div className="w-7 h-7 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center text-base font-medium">
                {index + 1}
            </div>
            <div className="w-0.5 flex-1 bg-green-500/20 my-2"></div>
        </div>

        <div className="bg-gray-900/50 rounded-lg overflow-hidden flex-1 ml-8">
            <div className="p-4">
                <h3 className="text-lg font-medium text-white mb-4">{area.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <div className="text-sm font-semibold text-muted-foreground mb-2">Current</div>
                        <div className="text-sm text-muted-foreground bg-gray-800/50 p-3 rounded">
                            {area.current}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-muted-foreground mb-2">Improved</div>
                        <div className="text-sm text-green-400 bg-green-900/20 p-3 rounded border border-green-900/50">
                            {area.improved}
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-4 pb-4">
                <Collapsible open={true}>
                    <CollapsibleTrigger className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-white transition-colors">
                        <ChevronDown size={16} />
                        Why This Matters
                    </CollapsibleTrigger>
                    <CollapsibleContent className="text-sm text-muted-foreground mt-2 pl-6">
                        {area.explanation}
                    </CollapsibleContent>
                </Collapsible>
            </div>
        </div>
    </div>
))
ImprovementArea.displayName = 'ImprovementArea'

const HeaderSection = memo(() => (
    <motion.div
        {...fadeInUpAnimation}
        className="text-center mb-6 sm:mb-8 lg:mb-12"
    >
        <Badge variant="outline" className="inline-flex items-center gap-2 rounded-full border-purple-200 bg-purple-50 text-purple-600 dark:text-purple-400 dark:bg-purple-950/30 dark:border-purple-900 px-2 sm:px-3 py-1 mb-3 sm:mb-4">
            <Zap size={14} />
            <span className="text-xs sm:text-sm font-medium">
                AI-Powered Resume Analysis
            </span>
        </Badge>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 text-gray-900 dark:text-white">
            Get Expert Resume Feedback
        </h2>
        <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-2">
            Optimize your resume with AI-powered insights and industry-specific recommendations to stand out from the competition.
        </p>
    </motion.div>
))
HeaderSection.displayName = 'HeaderSection'

const AnalysisHeaderCard = memo(() => (
    <Card className="bg-gray-900/50 border-0">
        <CardContent className="p-6">
            <div className="flex items-center gap-6">
                <CircularProgress value={75} />
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-white">Resume Analysis</h2>
                    <p className="text-gray-400">3 areas for improvement</p>
                    <div className="flex gap-3">
                        <Badge variant="outline" className="bg-gray-800/50 text-gray-300">
                            5 Missing Skills
                        </Badge>
                        <Badge variant="outline" className="bg-red-900/30 text-red-400 border-red-900">
                            3 Red Flags
                        </Badge>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
))
AnalysisHeaderCard.displayName = 'AnalysisHeaderCard'

const MainContent = memo(() => (
    <div className="space-y-6">
        <h2 className="text-xl font-semibold text-white mb-6">Areas for Improvement</h2>
        <div className="space-y-8">
            {IMPROVEMENT_AREAS.map((area, index) => (
                <ImprovementArea key={index} area={area} index={index} />
            ))}
        </div>
    </div>
))
MainContent.displayName = 'MainContent'

const SidebarContent = memo(() => (
    <div className="space-y-6">
        <Card className="bg-gray-900/50 border-0">
            <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <h3 className="text-lg font-medium text-white">Missing Skills</h3>
                </div>
                <div className="space-y-2">
                    {MISSING_SKILLS.map((skill) => (
                        <div key={skill} className="text-sm text-gray-300 bg-gray-800/50 p-3 rounded-lg">
                            {skill}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-0">
            <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <h3 className="text-lg font-medium text-white">Red Flags</h3>
                </div>
                <div className="space-y-2">
                    {RED_FLAGS.map((flag) => (
                        <div key={flag.title} className="text-sm text-red-400 bg-red-900/20 p-3 rounded-lg border border-red-900/50">
                            {flag.title}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    </div>
))
SidebarContent.displayName = 'SidebarContent'

const FeatureSection = memo(() => (
    <motion.div
        {...fadeInUpAnimation}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
    >
        {FEATURES.map((feature, index) => (
            <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
            >
                <FeatureCard feature={feature} />
            </motion.div>
        ))}
    </motion.div>
))
FeatureSection.displayName = 'FeatureSection'

const CTASection = memo(() => (
    <motion.div
        {...fadeInUpAnimation}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-center mt-12"
    >
        <Link href="/resume" className="sm:w-auto">
            <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold px-6 sm:px-10 py-2.5 sm:py-3 h-auto rounded-full transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] text-sm sm:text-base"
            >
                Analyze Your Resume
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
        </Link>
    </motion.div>
))
CTASection.displayName = 'CTASection'

export const ResumeAnalysisHighlight = memo(() => {
    return (
        <Section>
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-8 lg:py-12">
                <HeaderSection />

                <motion.div {...fadeInScaleAnimation}>
                    <Card className="shadow-2xl border-0 overflow-hidden">
                        <CardHeader className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-950 border-b border-gray-800">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-2">
                                    <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 bg-red-500 rounded-full"></div>
                                    <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 bg-yellow-500 rounded-full"></div>
                                    <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 bg-green-500 rounded-full"></div>
                                </div>
                                <div className="flex-1 text-center text-xs sm:text-sm text-muted-foreground bg-gray-900 rounded-full px-2 sm:px-4 py-1 mx-2 sm:mx-4 truncate">
                                    toptechschool.com/resume
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-6 bg-gray-950">
                            <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-6">
                                <div className="flex flex-col gap-6">
                                    <AnalysisHeaderCard />
                                    <MainContent />
                                </div>
                                <div className="flex flex-col gap-6">
                                    <SidebarContent />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <FeatureSection />
                <CTASection />
            </div>
        </Section>
    )
})
ResumeAnalysisHighlight.displayName = 'ResumeAnalysisHighlight'
