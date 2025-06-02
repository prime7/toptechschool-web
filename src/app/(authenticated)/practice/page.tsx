"use client";

import React from "react";
import Link from "next/link";
import { FileQuestion, RefreshCw } from "lucide-react";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import StatusFilter from "./StatusFilter";
import QuestionCard from "./QuestionCard";
import { useQuestions } from "./hooks";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const QuestionsPage: React.FC = () => {
  const { 
    filteredQuestions, 
    searchQuery, 
    selectedCategory, 
    selectedStatus,
    setSelectedStatus,
    stats,
    isLoading,
  } = useQuestions();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading your practice progress...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col items-center text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
          Practice Interview Questions
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
          Sharpen your skills with our comprehensive collection of interview
          questions. Practice individual questions, save your answers, and get AI feedback.
        </p>
      </div>

      <div className="flex flex-col items-center mb-8 space-y-6">
        <SearchBar />
        <CategoryFilter />
        <StatusFilter 
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          stats={stats}
        />
      </div>

      <div className="w-full">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              {searchQuery || selectedCategory !== "All" || selectedStatus !== "All"
                ? "Filtered Results"
                : "All Questions"}
            </h2>
            <p className="text-muted-foreground mt-1">
              {filteredQuestions.length}{" "}
              {filteredQuestions.length === 1 ? "question" : "questions"}{" "}
              {selectedStatus !== "All" ? selectedStatus.toLowerCase() : "found"}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select defaultValue="newest">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="difficulty">Difficulty</SelectItem>
                <SelectItem value="category">Category</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredQuestions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuestions.map((question) => (
              <Link key={question.id} href={`/practice/${question.id}`}>
                <QuestionCard question={question} />
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <FileQuestion className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No questions found
              </h3>
              <p className="text-muted-foreground">
                {selectedStatus !== "All" 
                  ? `No ${selectedStatus.toLowerCase()} questions match your current filters.`
                  : "Try adjusting your search or filter to find what you're looking for."
                }
              </p>
              {(searchQuery || selectedCategory !== "All" || selectedStatus !== "All") && (
                <Button
                  variant="outline"
                  className="mt-4"
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
      </div>
    </div>
  );
};

export default QuestionsPage;
