'use client'

import { memo, useState, useCallback } from 'react'
import { Section } from '@/components/common/Section'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, FileText, PenLine, Sparkles, User, FileSpreadsheet, GraduationCap, FolderGit2, Globe, Github, Linkedin, Plus, Zap, Eye } from "lucide-react"
import Link from 'next/link'
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Type } from "lucide-react"

const SECTIONS = [
    {
        id: "personal",
        label: "Personal Information",
        icon: <User size={16} />,
        active: true
    },
    {
        id: "summary",
        label: "Professional Summary",
        icon: <FileText size={16} />,
        active: false
    },
    {
        id: "work",
        label: "Work Experience",
        icon: <FileSpreadsheet size={16} />,
        active: false
    },
    {
        id: "education",
        label: "Education",
        icon: <GraduationCap size={16} />,
        active: false
    },
    {
        id: "projects",
        label: "Projects",
        icon: <FolderGit2 size={16} />,
        active: false
    }
] as const

const FEATURES = [
    {
        icon: <PenLine className="h-7 w-7 text-blue-600 dark:text-blue-400 stroke-[1.5]" />,
        title: "Smart Section Editor",
        description: "Intuitive section-based editing with real-time preview and AI suggestions.",
        bgColor: "bg-blue-100 dark:bg-blue-950/50"
    },
    {
        icon: <FileText className="h-7 w-7 text-purple-600 dark:text-purple-400 stroke-[1.5]" />,
        title: "Real-Time Preview",
        description: "See your changes instantly with our side-by-side preview panel.",
        bgColor: "bg-purple-100 dark:bg-purple-950/50"
    },
    {
        icon: <Sparkles className="h-7 w-7 text-green-600 dark:text-green-400 stroke-[1.5]" />,
        title: "AI-Powered Feedback",
        description: "Get instant feedback on your resume content and formatting.",
        bgColor: "bg-green-100 dark:bg-green-950/50"
    }
] as const

const WORK_EXPERIENCE = {
    company: "Stripe",
    position: "Senior Software Engineer",
    duration: "2020 - Present",
    highlights: [
        "Led the development of Stripe's next-generation payment processing system using Go and Kubernetes",
        "Reduced API response latency by 45% through implementation of advanced caching strategies",
        "Mentored 5 junior engineers and established team's code review guidelines"
    ]
} as const

const EDUCATION = {
    school: "University of California, Berkeley",
    degree: "Master of Science in Computer Science",
    duration: "2018 - 2020",
    gpa: "3.92/4.0"
} as const

const PROJECTS = [
    {
        name: "FinanceFlow",
        technologies: ["React", "TypeScript", "Node.js", "PostgreSQL"],
        description: "Built a full-stack personal finance management platform with real-time stock tracking and budget analytics, serving 2000+ monthly active users"
    }
] as const

interface ResumeData {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    github: string;
}

const DEFAULT_DATA: ResumeData = {
    fullName: "Sarah Chen",
    jobTitle: "Software Engineer",
    email: "sarah.chen@protonmail.com",
    phone: "(415) 555-0123",
    location: "San Francisco Bay Area",
    website: "sarahchen.dev",
    linkedin: "linkedin.com/in/sarahchen",
    github: "github.com/sarah-chen"
}

const FeatureCard = memo(({ feature }: { feature: typeof FEATURES[number] }) => (
    <motion.div
        whileHover={{ x: 8 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
        <Card className="group border-none bg-transparent">
            <CardContent className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 p-0">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={cn("w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center flex-shrink-0", feature.bgColor)}
                    aria-hidden="true"
                >
                    {feature.icon}
                </motion.div>
                <div className="flex-1">
                    <h3 className="text-lg sm:text-xl mb-2 sm:mb-3 font-semibold">
                        {feature.title}
                    </h3>
                    <p className="dark:text-muted-foreground text-sm sm:text-base leading-relaxed">
                        {feature.description}
                    </p>
                </div>
            </CardContent>
        </Card>
    </motion.div>
))
FeatureCard.displayName = 'FeatureCard'

const PreviewBadge = memo(() => (
    <Badge variant="outline" className="inline-flex items-center gap-2 rounded-full bg-green-50 text-green-600 dark:text-black dark:bg-green-950/30 dark:border-green-900 px-2 text-xs">
        Preview
    </Badge>
))
PreviewBadge.displayName = 'PreviewBadge'

const ResumePreviewLinks = memo(({ website, linkedin, github }: Pick<ResumeData, 'website' | 'linkedin' | 'github'>) => (
    <div className="text-sm text-gray-600 space-y-1 mt-2">
        <div className="flex items-center gap-2">
            <Globe size={16} />
            <span>{website}</span>
        </div>
        <div className="flex items-center gap-2">
            <Linkedin size={16} />
            <span>{linkedin}</span>
        </div>
        <div className="flex items-center gap-2">
            <Github size={16} />
            <span>{github}</span>
        </div>
    </div>
))
ResumePreviewLinks.displayName = 'ResumePreviewLinks'

const WorkExperienceSection = memo(() => (
    <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Work Experience</h2>
        <div>
            <div className="flex justify-between">
                <h3 className="font-medium text-gray-900">{WORK_EXPERIENCE.position}</h3>
                <span className="text-sm text-gray-500">{WORK_EXPERIENCE.duration}</span>
            </div>
            <p className="text-sm text-gray-600">{WORK_EXPERIENCE.company}</p>
            <ul className="mt-2 space-y-1">
                {WORK_EXPERIENCE.highlights.map((highlight, idx) => (
                    <li key={idx} className="text-sm text-gray-600 pl-4 relative before:content-['•'] before:absolute before:left-0">
                        {highlight}
                    </li>
                ))}
            </ul>
        </div>
    </div>
))
WorkExperienceSection.displayName = 'WorkExperienceSection'

const EducationSection = memo(() => (
    <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Education</h2>
        <div>
            <div className="flex justify-between">
                <h3 className="font-medium text-gray-900">{EDUCATION.school}</h3>
                <span className="text-sm text-gray-500">{EDUCATION.duration}</span>
            </div>
            <p className="text-sm text-gray-600">{EDUCATION.degree}</p>
            <p className="text-sm text-gray-600">GPA: {EDUCATION.gpa}</p>
        </div>
    </div>
))
EducationSection.displayName = 'EducationSection'

const ProjectsSection = memo(() => (
    <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
        {PROJECTS.map((project, idx) => (
            <div key={idx}>
                <h3 className="font-medium text-gray-900">{project.name}</h3>
                <div className="text-sm text-gray-500 italic my-1">
                    {project.technologies.join(" • ")}
                </div>
                <p className="text-sm text-gray-600">{project.description}</p>
            </div>
        ))}
    </div>
))
ProjectsSection.displayName = 'ProjectsSection'

const SectionNavigation = memo(({ activeSection, onSectionChange }: {
    activeSection: string;
    onSectionChange: (sectionId: string) => void
}) => (
    <div className="space-y-1">
        {SECTIONS.map((section) => (
            <motion.div
                key={section.id}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
            >
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full justify-start text-sm h-9 px-3 text-muted-foreground hover:bg-gray-900 hover:text-white transition-colors",
                        activeSection === section.id && "bg-gray-900 text-white",
                    )}
                    onClick={() => onSectionChange(section.id)}
                >
                    {section.icon}
                    <span className="ml-2">{section.label}</span>
                </Button>
            </motion.div>
        ))}
    </div>
))
SectionNavigation.displayName = 'SectionNavigation'

const MobileTabs = memo(({ activeTab, onTabChange }: {
    activeTab: 'form' | 'preview';
    onTabChange: (tab: 'form' | 'preview') => void;
}) => (
    <div className="lg:hidden flex items-center justify-between p-4 bg-gray-950 border-b border-gray-800">
        <div className="flex items-center gap-4">
            <Button
                variant="ghost"
                size="sm"
                className={cn(
                    "text-muted-foreground hover:text-white",
                    activeTab === 'form' && "text-white bg-gray-800"
                )}
                onClick={() => onTabChange('form')}
            >
                <FileText size={16} className="mr-2" />
                Editor
            </Button>
            <Button
                variant="ghost"
                size="sm"
                className={cn(
                    "text-muted-foreground hover:text-white",
                    activeTab === 'preview' && "text-white bg-gray-800"
                )}
                onClick={() => onTabChange('preview')}
            >
                <Eye size={16} className="mr-2" />
                Preview
            </Button>
        </div>
    </div>
))
MobileTabs.displayName = 'MobileTabs'

const FormField = memo(({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="space-y-1.5">
        <label className="text-sm text-white">{label}</label>
        {children}
    </div>
))
FormField.displayName = 'FormField'

const PersonalInfoForm = memo(({ formData, onInputChange, onSelectChange }: {
    formData: ResumeData;
    onInputChange: (field: keyof ResumeData) => (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectChange: (value: string) => void;
}) => (
    <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Full Name">
                <Input
                    value={formData.fullName}
                    onChange={onInputChange('fullName')}
                    placeholder="Enter your full name"
                    className="bg-gray-900 border-gray-800 text-white placeholder:text-muted-foreground"
                />
            </FormField>
            <FormField label="Job Title">
                <Select
                    value={formData.jobTitle === 'Software Engineer' ? 'swe' :
                        formData.jobTitle === 'Product Manager' ? 'pm' :
                            formData.jobTitle === 'UI/UX Designer' ? 'designer' : ''}
                    onValueChange={onSelectChange}
                >
                    <SelectTrigger className="bg-gray-900 border-gray-800 text-white">
                        <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-800">
                        <SelectItem value="swe" className="text-white hover:bg-gray-800">
                            Software Engineer
                        </SelectItem>
                        <SelectItem value="pm" className="text-white hover:bg-gray-800">
                            Product Manager
                        </SelectItem>
                        <SelectItem value="designer" className="text-white hover:bg-gray-800">
                            UI/UX Designer
                        </SelectItem>
                    </SelectContent>
                </Select>
            </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Email">
                <Input
                    type="email"
                    value={formData.email}
                    onChange={onInputChange('email')}
                    placeholder="Enter your email"
                    className="bg-gray-900 border-gray-800 text-white placeholder:text-muted-foreground"
                />
            </FormField>
            <FormField label="Phone">
                <Input
                    type="tel"
                    value={formData.phone}
                    onChange={onInputChange('phone')}
                    placeholder="Enter your phone number"
                    className="bg-gray-900 border-gray-800 text-white placeholder:text-muted-foreground"
                />
            </FormField>
        </div>

        <FormField label="Location">
            <Input
                value={formData.location}
                onChange={onInputChange('location')}
                placeholder="City, State"
                className="bg-gray-900 border-gray-800 text-white placeholder:text-muted-foreground"
            />
        </FormField>

        <div className="space-y-3">
            <h3 className="text-lg text-white font-medium">Online Presence</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField label="Website">
                    <Input
                        value={formData.website}
                        onChange={onInputChange('website')}
                        placeholder="https://yourwebsite.com"
                        className="bg-gray-900 border-gray-800 text-white placeholder:text-muted-foreground"
                    />
                </FormField>
                <FormField label="LinkedIn">
                    <Input
                        value={formData.linkedin}
                        onChange={onInputChange('linkedin')}
                        placeholder="https://linkedin.com/in/username"
                        className="bg-gray-900 border-gray-800 text-white placeholder:text-muted-foreground"
                    />
                </FormField>
            </div>
            <FormField label="GitHub">
                <Input
                    value={formData.github}
                    onChange={onInputChange('github')}
                    placeholder="https://github.com/username"
                    className="bg-gray-900 border-gray-800 text-white placeholder:text-muted-foreground"
                />
            </FormField>
        </div>
    </div>
))
PersonalInfoForm.displayName = 'PersonalInfoForm'

export const ResumeBuilderHighlight = memo(() => {
    const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form')
    const [activeSection, setActiveSection] = useState('personal')
    const [formData, setFormData] = useState<ResumeData>(DEFAULT_DATA)

    const handleInputChange = useCallback((field: keyof ResumeData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }))
    }, [])

    const handleSelectChange = useCallback((value: string) => {
        setFormData(prev => ({
            ...prev,
            jobTitle: value === 'swe' ? 'Software Engineer' :
                value === 'pm' ? 'Product Manager' :
                    value === 'designer' ? 'UI/UX Designer' : value
        }))
    }, [])

    const handleSectionChange = useCallback((sectionId: string) => {
        setActiveSection(sectionId)
    }, [])

    const handleTabChange = useCallback((tab: 'form' | 'preview') => {
        setActiveTab(tab)
    }, [])

    return (
        <Section>
            <div className="max-w-[95%] xl:max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-8 lg:py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-6 sm:mb-8 lg:mb-12"
                >
                    <Badge className="mb-8 py-1.5 px-4 bg-emerald-100/80 hover:bg-emerald-100/80 dark:bg-emerald-900/40 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-sm">
                        <Zap size={14} className='mr-2' />
                        AI-Powered Resume Builder
                    </Badge>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">
                        Build Your Professional Resume
                    </h2>
                    <p className="text- dark:text-muted-foreground max-w-2xl mx-auto px-2">
                        Create a standout resume with our intuitive builder. Get real-time preview, AI-powered suggestions, and export to PDF in minutes.
                    </p>
                </motion.div>

                <div className="grid gap-4 sm:gap-6 lg:gap-8 items-start mb-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Card className="shadow-2xl border-0 overflow-hidden">
                            <CardHeader className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-950 border-b border-gray-800">
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-2">
                                        <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 bg-red-500 rounded-full"></div>
                                        <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 bg-yellow-500 rounded-full"></div>
                                        <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 bg-green-500 rounded-full"></div>
                                    </div>
                                    <div className="flex-1 text-center text-xs sm:text-sm text-muted-foreground bg-gray-900 rounded-full px-2 sm:px-4 py-1 mx-2 sm:mx-4 truncate">
                                        toptechschool.com/resume/editor
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="p-0">
                                <div className="flex flex-col lg:flex-row min-h-[500px] lg:min-h-[600px]">
                                    <MobileTabs activeTab={activeTab} onTabChange={handleTabChange} />

                                    <div className={cn(
                                        "w-full lg:w-[240px] bg-gray-950 border-b lg:border-b-0 lg:border-r border-gray-800",
                                        "hidden lg:block"
                                    )}>
                                        <div className="p-4">
                                            <Tabs defaultValue="sections" className="w-full mb-4">
                                                <TabsList className="flex bg-gray-900">
                                                    <TabsTrigger value="sections" className="flex items-center gap-2">
                                                        <FileText size={16} />
                                                        <span>Sections</span>
                                                    </TabsTrigger>
                                                    <TabsTrigger value="styling" className="flex items-center gap-2">
                                                        <Type size={16} />
                                                        <span>Styling</span>
                                                    </TabsTrigger>
                                                </TabsList>
                                            </Tabs>

                                            <SectionNavigation activeSection={activeSection} onSectionChange={handleSectionChange} />

                                            <div className="mt-6">
                                                <div className="text-xs text-muted-foreground px-2 mb-2">Add Sections</div>
                                                <Button
                                                    variant="ghost"
                                                    className="w-full justify-start text-sm h-9 px-3 text-muted-foreground hover:bg-gray-900 hover:text-white"
                                                >
                                                    <Plus size={16} />
                                                    <span className="ml-2">Projects</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={cn(
                                        "bg-gray-950 p-3 sm:p-4",
                                        activeTab === 'preview' && "hidden lg:block"
                                    )}>
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-lg text-white font-semibold">Personal Information</h2>
                                            <Button size="sm" className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700">
                                                Export
                                            </Button>
                                        </div>

                                        <PersonalInfoForm formData={formData} onInputChange={handleInputChange} onSelectChange={handleSelectChange} />
                                    </div>

                                    <div className={cn(
                                        "w-full flex-1 lg:w-[400px] bg-white border-t lg:border-t-0 lg:border-l border-gray-800",
                                        activeTab === 'form' && "hidden lg:block"
                                    )}>
                                        <div className="p-4 sm:p-6">
                                            <div className='flex items-end justify-end'>
                                                <PreviewBadge />
                                            </div>

                                            <div className="space-y-6">
                                                <div className="pb-4 border-b">
                                                    <h1 className="text-xl font-bold text-gray-900">{formData.fullName}</h1>
                                                    <p className="text-gray-600">{formData.jobTitle}</p>
                                                    <div className="text-sm text-gray-500 mt-1">{formData.location}</div>
                                                    <ResumePreviewLinks website={formData.website} linkedin={formData.linkedin} github={formData.github} />
                                                </div>

                                                <WorkExperienceSection />
                                                <EducationSection />
                                                <ProjectsSection />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
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

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="text-center mt-12"
                >
                    <Link href="/resume/editor" className="sm:w-auto">
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold px-6 sm:px-10 py-2.5 sm:py-3 h-auto rounded-full transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] text-sm sm:text-base"
                        >
                            Start Building Your Resume
                            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </Section>
    )
})
ResumeBuilderHighlight.displayName = 'ResumeBuilderHighlight'