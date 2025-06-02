'use client';

import { QuestionsProvider } from './hooks';

export default function PracticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QuestionsProvider>
      {children}
    </QuestionsProvider>
  );
} 