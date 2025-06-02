import React from 'react';
import Link from 'next/link';
import { Bookmark, BookmarkCheck, ChevronRight } from 'lucide-react';
import { Question } from './types';
import { useQuestions } from './hooks';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface QuestionCardProps {
  question: Question;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const { toggleBookmark, isBookmarked } = useQuestions();
  const bookmarked = isBookmarked(question.id);
  
  const getDifficultyVariant = (difficulty: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (difficulty) {
      case 'Easy': return 'secondary';
      case 'Medium': return 'default';
      case 'Hard': return 'destructive';
      default: return 'outline';
    }
  };
  
  return (
    <Card className="group hover:shadow-md transition-all duration-200 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={getDifficultyVariant(question.difficulty)} className="font-medium">
              {question.difficulty}
            </Badge>
            <Badge variant="outline" className="text-muted-foreground">
              {question.category}
            </Badge>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              toggleBookmark(question.id);
            }}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            {bookmarked ? (
              <BookmarkCheck className="h-4 w-4 text-primary" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <div className="space-y-3">
          <Link href={`/questions/${question.id}`} className="group/link">
            <h3 className="text-lg font-semibold text-foreground group-hover/link:text-primary transition-colors leading-tight">
              {question.title}
            </h3>
          </Link>
          
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
            {question.description}
          </p>
          
          <div className="pt-2">
            <Link
              href={`/practice/${question.id}`}
              className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors group/cta"
            >
              View Question
              <ChevronRight className="ml-1 h-3 w-3 transition-transform group-hover/cta:translate-x-1" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;