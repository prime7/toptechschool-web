import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuestionDetailPage from './page'; // Adjust path as needed
import * as practiceActions from '@/actions/practice';
import { PracticeQuestion } from '@/app/(authenticated)/practice/types';
import type { UserQuestionAttempt } from '@prisma/client'; // Assuming prisma types are available
import axios from 'axios';

// Mock next/navigation (already in jest.setup.js, but can be more specific for useParams)
const mockRouterBack = jest.fn();
const mockRouterPush = jest.fn(); // if you add navigation from this page
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    back: mockRouterBack,
    push: mockRouterPush,
  }),
  useParams: () => ({
    questionId: 'q1', // Default mock questionId
  }),
  usePathname: () => '/practice/question/q1', // Example pathname
}));

// Mock actions
jest.mock('@/actions/practice', () => ({
  getQuestionById: jest.fn(),
  getSavedAnswers: jest.fn(),
}));

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock useToast (already in jest.setup.js)
// const mockToast = jest.fn();
// jest.mock('@/hooks/use-toast', () => ({
//   useToast: () => ({ toast: mockToast }),
// }));
// No need to re-mock if it's in jest.setup.js and working.

const mockQuestion: PracticeQuestion = {
  id: 'q1',
  question: 'What is a closure in JavaScript?',
  categories: ['JavaScript', 'Core Concepts'],
  difficulty: 'intermediate',
  type: 'text',
  hints: ['Execution context', 'Lexical environment'],
};

const mockAttempts: UserQuestionAttempt[] = [
  {
    id: 'attempt1',
    userId: 'user1',
    questionId: 'q1',
    answer: 'An old answer.',
    savedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    evaluations: [{ evaluatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), feedback: 'Old feedback' }] as any,
  },
  {
    id: 'attempt2',
    userId: 'user1',
    questionId: 'q1',
    answer: 'A more recent answer, evaluated today.',
    savedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    evaluations: [{ evaluatedAt: new Date().toISOString(), feedback: 'Feedback given today.' }] as any,
  },
  {
    id: 'attempt3',
    userId: 'user1',
    questionId: 'q1',
    answer: 'A very recent answer, not evaluated.',
    savedAt: new Date(),
    updatedAt: new Date(),
    evaluations: [] as any,
  },
];

describe('QuestionDetailPage', () => {
  beforeEach(() => {
    (practiceActions.getQuestionById as jest.Mock).mockResolvedValue(mockQuestion);
    (practiceActions.getSavedAnswers as jest.Mock).mockResolvedValue([...mockAttempts]); // Use a copy
    mockedAxios.post.mockClear();
    // mockToast.mockClear();
    mockRouterBack.mockClear();
  });

  it('renders question details, answer textarea, and saved attempts', async () => {
    render(<QuestionDetailPage />);

    await waitFor(() => {
      expect(screen.getByText(mockQuestion.question)).toBeInTheDocument();
      expect(screen.getByText(mockQuestion.categories[0])).toBeInTheDocument();
      expect(screen.getByText(mockQuestion.difficulty)).toBeInTheDocument();
      expect(screen.getByLabelText('Your Answer')).toBeInTheDocument();
    });

    // Check for saved attempts
    expect(screen.getByText('An old answer.')).toBeInTheDocument();
    expect(screen.getByText('Old feedback')).toBeInTheDocument();
    expect(screen.getByText('A very recent answer, not evaluated.')).toBeInTheDocument();
  });

  it('shows "Feedback given today" badge for attempt evaluated today', async () => {
    render(<QuestionDetailPage />);
    await waitFor(() => expect(practiceActions.getSavedAnswers).toHaveBeenCalled());

    // For attempt2, which was evaluated today
    const attempt2Answer = screen.getByText('A more recent answer, evaluated today.');
    const attempt2Card = attempt2Answer.closest('li'); // Assuming each attempt is in an <li>
    expect(attempt2Card).toHaveTextContent('Feedback given today');
    expect(within(attempt2Card!).queryByRole('button', { name: /Get AI Feedback/i })).toBeNull();
  });

  it('allows typing in textarea and saving an answer', async () => {
    (practiceActions.getSavedAnswers as jest.Mock).mockResolvedValueOnce([]); // Start with no attempts
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        message: 'Answer saved successfully',
        attempt: { ...mockAttempts[2], id: 'newAttempt', answer: 'A brand new answer' } // Simulate new attempt
      }
    });

    render(<QuestionDetailPage />);
    await waitFor(() => expect(screen.getByLabelText('Your Answer')).toBeInTheDocument());

    const textarea = screen.getByLabelText('Your Answer') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'A brand new answer' } });
    expect(textarea.value).toBe('A brand new answer');

    const saveButton = screen.getByRole('button', { name: 'Save Answer' });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/practice/question/answer', {
        questionId: 'q1',
        answer: 'A brand new answer',
      });
    });
    // expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ title: "Success" })); // Relies on useToast mock from setup

    // Check if new attempt is displayed
    await waitFor(() => {
      expect(screen.getByText('A brand new answer')).toBeInTheDocument();
    });
    expect(textarea.value).toBe(''); // Textarea should clear
  });


  it('allows getting AI feedback for an eligible attempt', async () => {
    // Use attempt1 (evaluated long ago) or attempt3 (not evaluated)
    const targetAttempt = mockAttempts[2]; // attempt3, not evaluated
     (practiceActions.getSavedAnswers as jest.Mock).mockResolvedValueOnce([targetAttempt]);


    mockedAxios.post.mockResolvedValueOnce({
      data: {
        evaluation: { evaluatedAt: new Date().toISOString(), feedback: 'Fresh AI feedback!' },
        attempt: { ...targetAttempt, evaluations: [{ evaluatedAt: new Date().toISOString(), feedback: 'Fresh AI feedback!' }] as any },
      },
    });

    render(<QuestionDetailPage />);
    await waitFor(() => expect(screen.getByText(targetAttempt.answer)).toBeInTheDocument());

    const attemptCard = screen.getByText(targetAttempt.answer).closest('li');
    const feedbackButton = within(attemptCard!).getByRole('button', { name: /Get AI Feedback/i });

    expect(feedbackButton).not.toBeDisabled();
    fireEvent.click(feedbackButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/practice/evaluate', {
        userQuestionAttemptId: targetAttempt.id,
      });
    });
    // expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ title: "Success" }));

    await waitFor(() => {
      expect(within(attemptCard!).getByText('Fresh AI feedback!')).toBeInTheDocument();
      // Button should now be gone or show "Feedback given today"
      expect(within(attemptCard!).queryByRole('button', { name: /Get AI Feedback/i })).toBeNull();
      expect(within(attemptCard!).getByText('Feedback given today')).toBeInTheDocument();
    });
  });

  it('handles AI feedback daily limit reached for an attempt', async () => {
    const targetAttempt = mockAttempts[2]; // attempt3, not evaluated initially
    (practiceActions.getSavedAnswers as jest.Mock).mockResolvedValueOnce([targetAttempt]);

    mockedAxios.post.mockRejectedValueOnce({
      response: { status: 429, data: { error: 'This specific answer has already been evaluated today.' } },
    });

    render(<QuestionDetailPage />);
    await waitFor(() => expect(screen.getByText(targetAttempt.answer)).toBeInTheDocument());

    const attemptCard = screen.getByText(targetAttempt.answer).closest('li');
    const feedbackButton = within(attemptCard!).getByRole('button', { name: /Get AI Feedback/i });
    fireEvent.click(feedbackButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/practice/evaluate', {
        userQuestionAttemptId: targetAttempt.id,
      });
    });
    // expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ title: "Error", variant: "destructive" }));

    await waitFor(() => {
      // The UI should update to show "Feedback given today" due to the 429 handling logic in component
      expect(within(attemptCard!).getByText('Feedback given today')).toBeInTheDocument();
    });
  });


  it('shows loading state for question details', () => {
    (practiceActions.getQuestionById as jest.Mock).mockImplementationOnce(() => new Promise(() => {})); // Never resolves
    render(<QuestionDetailPage />);
    expect(screen.getByText('Loading question...')).toBeInTheDocument();
  });

  it('shows "Not Found" when question does not exist', async () => {
    (practiceActions.getQuestionById as jest.Mock).mockResolvedValue(null);
    render(<QuestionDetailPage />);
    await waitFor(() => {
      expect(screen.getByText('Question Not Found')).toBeInTheDocument();
    });
  });

});

// Helper to use RTL's query functions within a specific element
// (useful if you have multiple cards/buttons and need to be specific)
import { queries, getQueriesForElement } from '@testing-library/dom';
function within(element: HTMLElement) {
  return getQueriesForElement(element, queries);
}
