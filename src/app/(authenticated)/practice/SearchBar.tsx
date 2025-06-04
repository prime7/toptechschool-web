import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useQuestions } from './hooks';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from '@/hooks/use-debounce';

const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery } = useQuestions();
  const [inputValue, setInputValue] = useState(searchQuery);
  const debouncedValue = useDebounce(inputValue, 300);

  if (debouncedValue.debouncedValue !== searchQuery) {
    setSearchQuery(debouncedValue.debouncedValue);
  }
  
  return (
    <div className="relative w-full max-w-lg">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search questions..."
        className="pl-10 pr-10 h-11"
      />
      {inputValue && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute inset-y-0 right-0 h-full px-3 hover:bg-transparent"
          onClick={() => {
            setInputValue('');
            setSearchQuery('');
          }}
          aria-label="Clear search"
        >
          <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
        </Button>
      )}
    </div>
  );
};

export default SearchBar;