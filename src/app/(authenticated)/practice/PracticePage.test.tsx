import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import PracticePage from './page'; // Adjust if your page export is different
import * as practiceActions from '@/actions/practice';
import { PracticeQuestion } from './types';

// Mock next/navigation (already in jest.setup.js, but can be more specific here if needed)
// We'll rely on the global mock from jest.setup.js for useRouter, usePathname, etc.
const mockRouterPush = jest.fn();
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'), // Import and retain default behavior
  useRouter: () => ({ push: mockRouterPush }),
  usePathname: () => '/practice', // Example pathname
}));


// Mock actions
jest.mock('@/actions/practice', () => ({
  getAllQuestions: jest.fn(),
}));

const mockedGetAllQuestions = practiceActions.getAllQuestions as jest.MockedFunction<typeof practiceActions.getAllQuestions>;

const mockQuestions: PracticeQuestion[] = [
  { id: 'q1', question: 'Question 1 about React', categories: ['React', 'Frontend'], difficulty: 'intermediate', type: 'text' },
  { id: 'q2', question: 'Question 2 about TypeScript', categories: ['TypeScript', 'Frontend'], difficulty: 'easy', type: 'text' },
  { id: 'q3', question: 'Question 3 about Node.js', categories: ['Node.js', 'Backend'], difficulty: 'hard', type: 'text' },
  { id: 'q4', question: 'Another React question', categories: ['React', 'Performance'], difficulty: 'hard', type: 'text' },
];

// Mock UI components if they are complex or not essential to this page's logic test
jest.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input {...props} data-testid="input" />,
}));
jest.mock('@/components/ui/select', () => ({
  Select: ({ children, onValueChange, value }: { children: React.ReactNode, onValueChange: (value: string) => void, value: string }) => (
    <select data-testid="select-difficulty" value={value} onChange={(e) => onValueChange(e.target.value)}>
      {children}
    </select>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectItem: ({ children, value }: { children: React.ReactNode, value: string }) => <option value={value}>{children}</option>,
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectValue: ({ placeholder }: { placeholder: string }) => <span>{placeholder}</span>,
}));


describe('PracticePage', () => {
  beforeEach(() => {
    mockedGetAllQuestions.mockResolvedValue([...mockQuestions]); // Return a fresh copy
    mockRouterPush.mockClear();
  });

  it('renders search, filters, and questions', async () => {
    render(<PracticePage />);

    await waitFor(() => expect(mockedGetAllQuestions).toHaveBeenCalledTimes(1));

    expect(screen.getByLabelText('Search Questions')).toBeInTheDocument();
    expect(screen.getByTestId('select-difficulty')).toBeInTheDocument(); // Using data-testid from mock
    expect(screen.getByText('Filter by Categories')).toBeInTheDocument(); // Label for category buttons

    // Check if category buttons are rendered
    const reactCategoryButton = screen.getByRole('button', { name: 'React' });
    expect(reactCategoryButton).toBeInTheDocument();

    // Check if questions are listed
    expect(screen.getByText('Question 1 about React')).toBeInTheDocument();
    expect(screen.getByText('Question 2 about TypeScript')).toBeInTheDocument();
  });

  it('filters questions by search term', async () => {
    render(<PracticePage />);
    await waitFor(() => expect(mockedGetAllQuestions).toHaveBeenCalledTimes(1));

    const searchInput = screen.getByLabelText('Search Questions');
    fireEvent.change(searchInput, { target: { value: 'TypeScript' } });

    expect(screen.queryByText('Question 1 about React')).not.toBeInTheDocument();
    expect(screen.getByText('Question 2 about TypeScript')).toBeInTheDocument();
  });

  it('filters questions by difficulty', async () => {
    render(<PracticePage />);
    await waitFor(() => expect(mockedGetAllQuestions).toHaveBeenCalledTimes(1));

    const difficultySelect = screen.getByTestId('select-difficulty');
    fireEvent.change(difficultySelect, { target: { value: 'easy' } });

    expect(screen.queryByText('Question 1 about React')).not.toBeInTheDocument();
    expect(screen.getByText('Question 2 about TypeScript')).toBeInTheDocument(); // q2 is easy
    expect(screen.queryByText('Question 3 about Node.js')).not.toBeInTheDocument();
  });

  it('filters questions by category', async () => {
    render(<PracticePage />);
    await waitFor(() => expect(mockedGetAllQuestions).toHaveBeenCalledTimes(1));

    const reactCategoryButton = screen.getByRole('button', { name: 'React' });
    fireEvent.click(reactCategoryButton); // Select React

    expect(screen.getByText('Question 1 about React')).toBeInTheDocument();
    expect(screen.queryByText('Question 2 about TypeScript')).not.toBeInTheDocument();
    expect(screen.queryByText('Question 3 about Node.js')).not.toBeInTheDocument();
    expect(screen.getByText('Another React question')).toBeInTheDocument();

    // Toggle off
    fireEvent.click(reactCategoryButton);
    expect(screen.getByText('Question 2 about TypeScript')).toBeInTheDocument(); // All should be back
  });

  it('filters with combined search, difficulty, and category', async () => {
    render(<PracticePage />);
    await waitFor(() => expect(mockedGetAllQuestions).toHaveBeenCalledTimes(1));

    // Search for "React"
    const searchInput = screen.getByLabelText('Search Questions');
    fireEvent.change(searchInput, { target: { value: 'React' } });

    // Select 'hard' difficulty
    const difficultySelect = screen.getByTestId('select-difficulty');
    fireEvent.change(difficultySelect, { target: { value: 'hard' } });

    // Select 'Performance' category
    // Need to wait for categories to be derived from allQuestions which is async
    // For simplicity, assuming 'Performance' button is available after initial render and question load
    const performanceCategoryButton = await screen.findByRole('button', { name: 'Performance' });
    fireEvent.click(performanceCategoryButton);

    expect(screen.queryByText('Question 1 about React')).not.toBeInTheDocument(); // intermediate
    expect(screen.queryByText('Question 2 about TypeScript')).not.toBeInTheDocument();
    expect(screen.queryByText('Question 3 about Node.js')).not.toBeInTheDocument();
    expect(screen.getByText('Another React question')).toBeInTheDocument(); // Matches all: "React", "hard", "Performance"
  });


  it('navigates to question detail page on question click', async () => {
    render(<PracticePage />);
    await waitFor(() => expect(mockedGetAllQuestions).toHaveBeenCalledTimes(1));

    // Find the link associated with the question title. The title itself is wrapped in a Link.
    const questionLink = screen.getByText('Question 1 about React').closest('a');
    expect(questionLink).toHaveAttribute('href', '/practice/question/q1');

    // To test actual navigation, you'd check mockRouterPush, but here we check the href
    // If you wanted to simulate click and test router.push:
    // fireEvent.click(questionLink);
    // expect(mockRouterPush).toHaveBeenCalledWith('/practice/question/q1');
    // This requires Link to correctly call router.push, which it does internally.
  });

  it('shows loading state initially', () => {
    mockedGetAllQuestions.mockImplementationOnce(() => new Promise(() => {})); // Never resolves
    render(<PracticePage />);
    expect(screen.getByText('Loading questions...')).toBeInTheDocument();
  });

  it('shows empty state message when no questions match filters', async () => {
    render(<PracticePage />);
    await waitFor(() => expect(mockedGetAllQuestions).toHaveBeenCalledTimes(1));

    const searchInput = screen.getByLabelText('Search Questions');
    fireEvent.change(searchInput, { target: { value: 'NonExistentSearchTerm123' } });

    expect(screen.getByText('No questions match your current filters.')).toBeInTheDocument();
  });

});
