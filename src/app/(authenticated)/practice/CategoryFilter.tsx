import React from 'react';
import { useQuestions } from './hooks';
import { Button } from "@/components/ui/button";
import { QuestionCategory } from './types';

const categories: (QuestionCategory | 'All')[] = [
  'All',
  'Situational',
  'Behavioral',
  'Problem Solving',
  'Background',
  'Technical',
  'Value Based',
  'Culture Fit'
];

const CategoryFilter: React.FC = () => {
  const { selectedCategory, setSelectedCategory } = useQuestions();
  
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {categories.map((category) => {
        const isSelected = category === selectedCategory;
        
        return (
          <Button
            key={category}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="rounded-full px-4 py-1 h-8 text-sm font-medium transition-colors"
          >
            {category}
          </Button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;