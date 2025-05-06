import React from 'react';
import dynamic from 'next/dynamic';
import { Label } from './label';
import { cn } from '@/lib/utils';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { useTheme } from 'next-themes';

// We need to dynamically import the MDEditor to avoid SSR issues
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { 
  ssr: false,
  loading: () => <div className="h-40 w-full border rounded-md bg-muted/20 animate-pulse" />
});

interface MarkdownEditorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helperText?: string;
  className?: string;
  id?: string;
  minHeight?: number;
}

export function MarkdownEditor({
  label,
  value,
  onChange,
  placeholder,
  helperText = "Markdown formatting supported",
  className,
  id,
  minHeight = 200
}: MarkdownEditorProps) {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  
  const handleChange = (val?: string) => {
    onChange(val || '');
  };

  return (
    <div 
      className={cn("space-y-2", className)} 
      data-color-mode={isDarkMode ? "dark" : "light"}
    >
      {label && <Label htmlFor={id}>{label}</Label>}
      
      <MDEditor
        value={value}
        onChange={handleChange}
        preview="edit"
        hideToolbar={false}
        height={minHeight}
        visibleDragbar={false}
        extraCommands={[]}
        textareaProps={{
          id: id,
          placeholder: placeholder
        }}
      />
      
      {helperText && (
        <div className="text-xs text-muted-foreground">
          <span>{helperText}</span>
        </div>
      )}
    </div>
  );
} 