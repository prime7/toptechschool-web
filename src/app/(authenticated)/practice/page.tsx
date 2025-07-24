"use client";

import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { FileQuestion, NotebookPen } from "lucide-react";
import { useQuestions } from "./hooks";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const SearchBar = dynamic(() => import("./SearchBar"), { ssr: false });
const CategoryFilter = dynamic(() => import("./CategoryFilter"), {
  ssr: false,
});
const StatusFilter = dynamic(() => import("./StatusFilter"), { ssr: false });
const QuestionCard = dynamic(() => import("./QuestionCard"), {
  ssr: false,
  loading: () => (
    <div className="h-48 w-full bg-muted animate-pulse rounded-md" />
  ),
});
const ReviewModal = dynamic(() => import("./ReviewModal"), { ssr: false });

const QuestionsPage: React.FC = () => {
  const {
    filteredQuestions,
    searchQuery,
    selectedCategory,
    selectedStatus,
    setSelectedStatus,
    stats,
  } = useQuestions();

  return (
    <div className="container mx-auto px-4 py-12 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <Badge className="mb-4 py-1.5 px-4 bg-emerald-100/80 hover:bg-emerald-100/80 dark:bg-emerald-900/40 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-sm">
          <NotebookPen size={16} className="mr-2" />
          AI-Powered Practice
        </Badge>
        <h2 className="text-4xl lg:text-5xl font-bold mb-4">
          Practice Interview Questions
        </h2>
        <p className="text-base md:text-lg text-gray-600 dark:text-muted-foreground max-w-2xl mx-auto">
          Sharpen your skills with our comprehensive collection of interview
          questions. Practice individual questions, save your answers, and get
          AI feedback.
        </p>
      </motion.div>

      <div className="flex gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="w-64 shrink-0 space-y-6 sticky self-start bg-background/50 backdrop-blur-sm border-none shadow-lg">
            <SearchBar />
            <CategoryFilter />
            <StatusFilter
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              stats={stats}
            />
            <ReviewModal />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex-1"
        >
          {filteredQuestions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredQuestions.map((question, index) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Link href={`/practice/${question.id}`}>
                    <QuestionCard question={question} />
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="bg-background/50 backdrop-blur-sm border-none shadow-none">
              <CardContent className="py-16 text-center">
                <div className="mx-auto w-16 h-16 bg-emerald-100/80 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
                  <FileQuestion className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  No questions found
                </h3>
                <p className="text-gray-600 dark:text-muted-foreground">
                  {selectedStatus !== "All"
                    ? `No ${selectedStatus.toLowerCase()} questions match your current filters.`
                    : "Try adjusting your search or filter to find what you're looking for."}
                </p>
                {(searchQuery ||
                  selectedCategory !== "All" ||
                  selectedStatus !== "All") && (
                    <Button
                      variant="outline"
                      className="mt-6 rounded-full"
                      onClick={() => {
                        window.location.reload();
                      }}
                    >
                      Clear All Filters
                    </Button>
                  )}
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default QuestionsPage;
