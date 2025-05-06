import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
  printMode?: boolean;
}

export function MarkdownPreview({ content, className, printMode = false }: MarkdownPreviewProps) {
  if (!content) return null;
  
  // Process the content to properly handle newlines
  // Conventional markdown requires two spaces for line breaks
  // Only process content that doesn't already have markdown features
  const processedContent = React.useMemo(() => {
    return content
      // Add custom processing only for plain text sections
      .split(/(\n\n|\r\n\r\n)/)
      .map(block => {
        // Skip processing for blocks that appear to have markdown syntax
        if (block.match(/^(#{1,6}\s|\*\s|\-\s|\d+\.\s|\[|\!\[|```|>)/)) {
          return block;
        }
        
        // For plain text blocks, ensure single newlines become line breaks
        return block.replace(/\n(?!\n)/g, '  \n');
      })
      .join('');
  }, [content]);
  
  return (
    <div className={cn(
      "markdown-content markdown-body",
      "text-gray-700 text-sm leading-relaxed",
      printMode ? "print:text-black" : "",
      className
    )}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({node, ...props}) => <h1 {...props} className="text-lg font-bold mt-3 mb-2 text-gray-800" />,
          h2: ({node, ...props}) => <h2 {...props} className="text-base font-bold mt-3 mb-1 text-gray-800" />,
          h3: ({node, ...props}) => <h3 {...props} className="text-sm font-bold mt-2 mb-1 text-gray-800" />,
          ul: ({node, ...props}) => <ul {...props} className="list-disc pl-5 my-2" />,
          ol: ({node, ...props}) => <ol {...props} className="list-decimal pl-5 my-2" />,
          li: ({node, ...props}) => <li {...props} className="mb-1" />,
          p: ({node, ...props}) => <p {...props} className="mb-2" />,
          a: ({node, ...props}) => (
            <a 
              {...props} 
              className="text-blue-600 hover:underline" 
              target="_blank"
              rel="noopener noreferrer"
            />
          ),
          blockquote: ({node, ...props}) => (
            <blockquote {...props} className="border-l-4 border-gray-200 pl-4 py-1 italic text-gray-800" />
          ),
          pre: ({node, ...props}) => (
            <pre {...props} className="bg-gray-100 p-3 rounded my-3 overflow-auto text-sm" />
          ),
          code: ({node, className, children, ...props}) => {
            const match = /language-(\w+)/.exec(className || '');
            return !match ? (
              <code {...props} className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">
                {children}
              </code>
            ) : (
              <code {...props} className={cn("block text-gray-800 font-mono", className)}>
                {children}
              </code>
            );
          },
          table: ({node, ...props}) => (
            <div className="overflow-x-auto">
              <table {...props} className="w-full text-sm border-collapse my-3" />
            </div>
          ),
          th: ({node, ...props}) => <th {...props} className="border border-gray-300 bg-gray-100 px-3 py-2 text-left font-medium" />,
          td: ({node, ...props}) => <td {...props} className="border border-gray-300 px-3 py-2" />
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
} 