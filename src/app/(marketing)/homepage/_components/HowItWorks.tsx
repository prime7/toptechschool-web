import type React from "react"
import { Section } from "@/components/common/Section"
import { Button } from "@/components/ui/button"
import { Timer, MoveRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      title: "Create Your Professional Profile",
      description:
        "Build your comprehensive professional profile by documenting your qualifications, work history, and key competencies.",
      buttonLabel: "Create Profile",
      buttonLink: "/profile",
    },
    {
      title: "Customize Your Resume",
      description:
        "Utilize our advanced resume editor to refine and optimize your resume content for targeted job applications.",
      buttonLabel: "Access Editor",
      buttonLink: "/resume/editor",
    },
    {
      title: "Generate Professional PDF",
      description: "Export your polished resume as a professionally formatted PDF document ready for submission.",
      buttonLabel: "View Sample",
      // buttonLink: "#",
    },
    {
      title: "Career Development",
      description:
        "Submit applications with confidence and leverage our comprehensive resources for interview preparation.",
      buttonLabel: "Explore Opportunities",
      // buttonLink: "#",
    },
  ]

  return (
    <Section className="bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-20">

          <Badge className="mb-8 py-1.5 px-4 bg-emerald-100/80 hover:bg-emerald-100/80 dark:bg-emerald-900/40 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-sm">
            <Timer size={16} className='mr-2' />
            Follow guided steps
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 text-gray-900 dark:text-white">
            How It Works
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-2">
            Our streamlined process helps you create professional resumes in minutes. Follow these simple steps to build
            your career success story.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="lg:col-span-1 relative flex justify-center items-center min-h-[300px] lg:min-h-[500px] h-full">
            <Image
              src="/images/howItWorks.png"
              alt="Resume Creation Process"
              fill
              className="object-contain rounded-2xl"
              priority
            />
          </div>

          <div className="lg:col-span-1 space-y-8">
            {steps.map((step, index) => (
              <Card key={index} className="group transition-all duration-300 shadow-md hover:shadow-lg border-none">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-4xl font-bold text-primary/80">{`0${index + 1}.`}</span>
                    <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">
                      {step.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-foreground dark:text-muted-foreground leading-relaxed">{step.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  {step.buttonLink && (
                    <Link href={step.buttonLink} passHref>
                      <Button variant="ghost" className="group-hover:translate-x-2 transition-transform">
                        {step.buttonLabel}
                        <MoveRight size={16} className="ml-2" />
                      </Button>
                    </Link>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* <div className="mt-32 text-center">
          <p className="text-2xl font-semibold mb-8">See How Easy It Is To Get Started</p>
          <div className="relative bg-gradient-to-br from-card to-muted aspect-video max-w-4xl mx-auto rounded-2xl shadow-xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center cursor-pointer group">
              <div className="relative z-10 bg-primary/90 rounded-full p-8 group-hover:scale-110 transition-transform duration-300">
                <PlayCircle size={48} className="text-background" strokeWidth={1.5} />
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        </div> */}
      </div>
    </Section>
  )
}

export default HowItWorks
