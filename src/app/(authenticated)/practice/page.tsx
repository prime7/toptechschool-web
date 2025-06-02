"use client"; // Convert to client component

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { PracticeQuestion } from "./types"; // Assuming types.ts is in the same directory or accessible
import { getAllQuestions } from "@/actions/practice"; // Action to fetch all questions
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getDifficultyColor } from "./utils"; // Keep utility for colors

// Metadata export can remain if file structure allows mixed server/client aspects,
// or be moved to a layout/template if this page becomes purely client-rendered after initial shell.
// For Next.js 13+ App Router, the page file can export metadata even if it uses "use client".

// export const metadata: Metadata = { ... }; // Assuming Metadata type is available if this were a server component

export default function PracticePage() {
  const [allQuestions, setAllQuestions] = useState<PracticeQuestion[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<PracticeQuestion[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>(''); // 'all', 'beginner', 'intermediate', 'advanced'
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadQuestions() {
      setIsLoading(true);
      try {
        const questions = await getAllQuestions();
        setAllQuestions(questions);
        setFilteredQuestions(questions);
      } catch (error) {
        console.error("Failed to load questions:", error);
        // Handle error display if necessary
      } finally {
        setIsLoading(false);
      }
    }
    loadQuestions();
  }, []);

  const uniqueCategories = useMemo(() => {
    const allCats = allQuestions.flatMap(q => q.categories);
    return Array.from(new Set(allCats));
  }, [allQuestions]);

  // Ensure '' is a valid option for difficulty, representing 'All'
  const difficulties: Array<PracticeQuestion['difficulty'] | ''> = ['', 'beginner', 'intermediate', 'advanced'];


  useEffect(() => {
    let questions = allQuestions;

    if (searchTerm) {
      questions = questions.filter(q =>
        q.question.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDifficulty && selectedDifficulty !== '') {
      questions = questions.filter(q => q.difficulty === selectedDifficulty);
    }

    if (selectedCategories.length > 0) {
      questions = questions.filter(q =>
        selectedCategories.every(sc => q.categories.includes(sc))
      );
    }

    setFilteredQuestions(questions);
  }, [searchTerm, selectedDifficulty, selectedCategories, allQuestions]);

  const toggleCategoryFilter = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  if (isLoading) {
    // TODO: Replace with a proper loading spinner component if available
    // For now, using text. A common component like <LoadingSpinner /> would be ideal.
    return <div className="container mx-auto py-8 text-center">Loading questions...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">All Practice Questions</h1>
        <p className="text-muted-foreground">Search and filter through all available questions.</p>
      </header>

      {/* Filter and Search Section */}
      <div className="mb-8 p-6 bg-card border rounded-lg shadow"> {/* Changed bg-background to bg-card for better theme adapt */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label htmlFor="search" className="block text-sm font-medium mb-1">Search Questions</label>
            <Input
              id="search"
              type="text"
              placeholder="Enter keywords..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium mb-1">Filter by Difficulty</label>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger id="difficulty" className="w-full">
                <SelectValue placeholder="All Difficulties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Difficulties</SelectItem>
                {/* Filter out the empty string before mapping, as it's handled by placeholder or SelectItem value="" */}
                {difficulties.filter(d => d !== '').map(diff => (
                  <SelectItem key={diff} value={diff!}> {/* Non-null assertion as we filtered empty */}
                    {/* Capitalize first letter */}
                    {diff!.charAt(0).toUpperCase() + diff!.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2 lg:col-span-3"> {/* Full width on medium, full on large for categories */}
            <label className="block text-sm font-medium mb-1">Filter by Categories</label>
            <div className="flex flex-wrap gap-2">
              {uniqueCategories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategories.includes(category) ? "default" : "outline"}
                  onClick={() => toggleCategoryFilter(category)}
                  size="sm"
                  className="rounded-full px-3 py-1 text-sm" // Adjusted padding and text size for badges
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Display Filtered Questions */}
      {filteredQuestions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuestions.map(question => (
            <Card key={question.id} className="flex flex-col justify-between hover:shadow-lg transition-shadow">
              <CardHeader>
                {/* Ensure CardTitle can handle potentially long question text gracefully */}
                <CardTitle className="text-lg leading-tight hover:text-primary transition-colors">
                  <Link href={`/practice/question/${question.id}`} passHref>
                    {question.question}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow pt-2"> {/* Reduced padding top */}
                <div className="space-y-2 mb-3">
                  <Badge className={`${getDifficultyColor(question.difficulty)} text-white capitalize`}>
                    {question.difficulty}
                  </Badge>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {question.categories.map(cat => (
                      <Badge key={cat} variant="secondary" className="text-xs px-2 py-0.5">{cat}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <div className="p-4 pt-0"> {/* Adjusted padding for footer area */}
                <Link href={`/practice/question/${question.id}`} passHref>
                  <Button className="w-full" variant="ghost" size="sm"> {/* Changed to ghost, full width */}
                    Practice this Question
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12"> {/* Increased padding */}
          <p className="text-xl text-muted-foreground">No questions match your current filters.</p>
          <p className="text-sm mt-2">Try adjusting your search or filter criteria, or view all questions.</p>
        </div>
      )}
    </div>
  );
}
