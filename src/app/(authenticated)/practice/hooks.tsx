"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import { Question, QuestionCategory } from "./types";
import { questions } from "./data";
import { getUserAllAnswers } from "@/actions/practice";

interface QuestionsContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: QuestionCategory | "All";
  setSelectedCategory: (category: QuestionCategory | "All") => void;
  selectedStatus: "All" | "Attempted" | "Unattempted";
  setSelectedStatus: (status: "All" | "Attempted" | "Unattempted") => void;
  filteredQuestions: Question[];
  isAttempted: (questionId: string) => boolean;
  stats: {
    total: number;
    attempted: number;
    unattempted: number;
    progress: number;
  };
  isLoading: boolean;
  refreshAttemptedQuestions: () => Promise<void>;
}

const QuestionsContext = createContext<QuestionsContextType | undefined>(undefined);

export function QuestionsProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | "All">("All");
  const [selectedStatus, setSelectedStatus] = useState<"All" | "Attempted" | "Unattempted">("All");
  const [attemptedQuestions, setAttemptedQuestions] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAttemptedQuestions();
  }, []);

  const loadAttemptedQuestions = async () => {
    try {
      setIsLoading(true);
      const answers = await getUserAllAnswers();
      const attemptedIds = new Set(answers.map((answer: any) => answer.questionId));
      setAttemptedQuestions(attemptedIds);
    } catch (error) {
      console.error("Error loading attempted questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const matchesSearch = question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          question.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          question.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === "All" || question.category === selectedCategory;

      const matchesStatus = selectedStatus === "All" || 
                           (selectedStatus === "Attempted" && attemptedQuestions.has(question.id)) ||
                           (selectedStatus === "Unattempted" && !attemptedQuestions.has(question.id));

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchQuery, selectedCategory, selectedStatus, attemptedQuestions]);

  const isAttempted = (questionId: string) => attemptedQuestions.has(questionId);

  const stats = useMemo(() => {
    const totalQuestions = questions.length;
    const attemptedCount = attemptedQuestions.size;
    const unattemptedCount = totalQuestions - attemptedCount;
    const progressPercentage = totalQuestions > 0 ? Math.round((attemptedCount / totalQuestions) * 100) : 0;

    return {
      total: totalQuestions,
      attempted: attemptedCount,
      unattempted: unattemptedCount,
      progress: progressPercentage
    };
  }, [attemptedQuestions]);

  const value = {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    filteredQuestions,
    isAttempted,
    stats,
    isLoading,
    refreshAttemptedQuestions: loadAttemptedQuestions
  };

  return (
    <QuestionsContext.Provider value={value}>
      {children}
    </QuestionsContext.Provider>
  );
}

export function useQuestions() {
  const context = useContext(QuestionsContext);
  if (context === undefined) {
    throw new Error('useQuestions must be used within a QuestionsProvider');
  }
  return context;
}