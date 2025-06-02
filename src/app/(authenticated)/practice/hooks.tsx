import React, { createContext, useContext, useState, useEffect } from 'react';
import { Question } from './types';
import { questionsData } from './data';

interface QuestionsContextType {
  questions: Question[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  filteredQuestions: Question[];
  recentlyViewed: Question[];
  addToRecentlyViewed: (question: Question) => void;
  bookmarks: string[];
  toggleBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  getQuestionById: (id: string) => Question | undefined;
}

const QuestionsContext = createContext<QuestionsContextType | undefined>(undefined);

export const QuestionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [questions] = useState<Question[]>(questionsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [recentlyViewed, setRecentlyViewed] = useState<Question[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  // Load bookmarks from localStorage on initial load
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('bookmarks');
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
  }, []);

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const filteredQuestions = questions.filter((question) => {
    const matchesSearch = 
      question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory ? question.category === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  const addToRecentlyViewed = (question: Question) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((q) => q.id !== question.id);
      return [question, ...filtered].slice(0, 5);
    });
  };

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      if (prev.includes(id)) {
        return prev.filter((bookmarkId) => bookmarkId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const isBookmarked = (id: string) => bookmarks.includes(id);

  const getQuestionById = (id: string) => questions.find((q) => q.id === id);

  return (
    <QuestionsContext.Provider
      value={{
        questions,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        filteredQuestions,
        recentlyViewed,
        addToRecentlyViewed,
        bookmarks,
        toggleBookmark,
        isBookmarked,
        getQuestionById,
      }}
    >
      {children}
    </QuestionsContext.Provider>
  );
};

export const useQuestions = () => {
  const context = useContext(QuestionsContext);
  if (context === undefined) {
    throw new Error('useQuestions must be used within a QuestionsProvider');
  }
  return context;
};