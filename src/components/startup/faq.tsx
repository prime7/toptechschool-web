"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
  const faqs = [
    {
      question: "What is the Lean Startup methodology?",
      answer:
        "The Lean Startup methodology, developed by Eric Ries, is an approach to building new businesses based on the principles of lean manufacturing, validated learning, and rapid scientific experimentation. It emphasizes quick iteration, customer insight, and a scientific approach to making decisions.",
    },
    {
      question: "What's included in the Notion template?",
      answer:
        "Our Notion template includes structured frameworks for hypothesis testing, customer development, MVP planning, metrics tracking, experiment design, and pivot analysis. It provides a complete system for implementing the Lean Startup methodology in your business.",
    },
    {
      question: "How will I receive the template?",
      answer:
        "After submitting your email, you'll receive an email with instructions on how to access and duplicate the Notion template for your own use. The email will include a link to the template and detailed setup instructions.",
    },
    {
      question: "Is this template suitable for any type of startup?",
      answer:
        "Yes, the template is designed to be flexible and can be adapted for various types of startups, including SaaS, e-commerce, marketplaces, and physical products. The core principles of the Lean Startup methodology apply across industries.",
    },
    {
      question: "Do I need prior knowledge of the Lean Startup methodology?",
      answer:
        "No prior knowledge is required. The template includes explanations of key concepts and step-by-step guides. However, we recommend reading Eric Ries' book 'The Lean Startup' to deepen your understanding of the methodology.",
    },
    {
      question: "Is there any support available if I have questions?",
      answer:
        "Yes, after receiving the template, you'll have access to our email support where you can ask questions about using the template or implementing the Lean Startup methodology in your business.",
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
              Frequently Asked Questions
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Everything you need to know about our Lean Startup Notion
              template.
            </p>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="mx-auto mt-12 max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                {/* Question */}
                <AccordionTrigger className="text-left font-medium">
                  {faq.question}
                </AccordionTrigger>
                {/* Answer */}
                <AccordionContent className="text-sm text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
