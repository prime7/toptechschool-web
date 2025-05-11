import React, { useEffect } from 'react';
import { ThemeProvider, useTheme } from 'next-themes';
import { StoryFn } from '@storybook/react';

export const ThemeDecorator = (Story: StoryFn, context: any) => {
  const themeParam = context.globals.theme || 'light';
  
  return (
    <ThemeProvider attribute="class" defaultTheme={themeParam} enableSystem={false} themes={["light", "dark"]}>
      <ThemeConsumer themeParam={themeParam}>
        <div className="min-h-screen bg-background text-foreground p-4">
          <Story />
        </div>
      </ThemeConsumer>
    </ThemeProvider>
  );
};

// Component to force theme update when parameter changes
const ThemeConsumer = ({ children, themeParam }: { children: React.ReactNode, themeParam: string }) => {
  const { setTheme } = useTheme();
  
  useEffect(() => {
    setTheme(themeParam);
  }, [themeParam, setTheme]);
  
  return <>{children}</>;
}; 