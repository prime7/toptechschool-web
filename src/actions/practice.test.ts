import {
  getAllQuestions,
  getQuestionById,
  getSavedAnswers,
  getPracticeSets, // Keep if getAllQuestions depends on it and you want to test that interaction
  // getPracticeSet, // Not directly tested here unless a dependency for others
  // getPracticeAttempt, // Legacy, not focused on for these unit tests
  // getPracticeAttempts // Legacy
} from './practice'; // Adjust path as necessary
import fs from 'fs/promises';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { PracticeQuestion, PracticeSet } from '@/app/(authenticated)/practice/types';
import type { UserQuestionAttempt } from '@prisma/client';

// Mock dependencies
jest.mock('fs/promises');
jest.mock('@/lib/prisma', () => ({
  prisma: {
    userQuestionAttempt: {
      findMany: jest.fn(),
      create: jest.fn(), // Though not directly used by actions being tested, good to have if expanding
    },
    // Mock other models if other actions were being tested
  },
}));
jest.mock('@/lib/auth');

const mockedFs = fs as jest.Mocked<typeof fs>;
const mockedPrisma = prisma as jest.Mocked<typeof prisma>;
const mockedAuth = auth as jest.MockedFunction<typeof auth>;

const mockPracticeSetsData = {
  practiceSets: [
    {
      id: 'set1',
      title: 'Set 1',
      difficulty: 'easy',
      category: 'General',
      questions: [
        { id: 'set1_q1', question: 'Question 1.1', categories: ['CatA'], type: 'text' },
        { id: 'set1_q2', question: 'Question 1.2', categories: ['CatB'], type: 'text' },
      ],
    },
    {
      id: 'set2',
      title: 'Set 2',
      difficulty: 'intermediate',
      category: 'Specific',
      questions: [
        { id: 'set2_q1', question: 'Question 2.1', categories: ['CatA', 'CatC'], type: 'text' },
      ],
    },
  ],
};

describe('Practice Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Setup default mock implementations
    mockedFs.readFile.mockResolvedValue(JSON.stringify(mockPracticeSetsData));
  });

  describe('getAllQuestions', () => {
    it('should read, flatten, and assign difficulty to questions', async () => {
      const questions = await getAllQuestions();
      expect(mockedFs.readFile).toHaveBeenCalledWith(expect.stringContaining('practice-sets.json'), 'utf-8');
      expect(questions).toHaveLength(3);
      expect(questions[0]).toEqual(expect.objectContaining({
        id: 'set1_q1',
        question: 'Question 1.1',
        categories: ['CatA'],
        difficulty: 'easy',
      }));
      expect(questions[1]).toEqual(expect.objectContaining({
        id: 'set1_q2',
        question: 'Question 1.2',
        categories: ['CatB'],
        difficulty: 'easy',
      }));
      expect(questions[2]).toEqual(expect.objectContaining({
        id: 'set2_q1',
        question: 'Question 2.1',
        categories: ['CatA', 'CatC'],
        difficulty: 'intermediate',
      }));
    });
  });

  describe('getQuestionById', () => {
    it('should return the correct question when ID exists', async () => {
      const question = await getQuestionById('set1_q2');
      expect(question).toBeDefined();
      expect(question?.id).toBe('set1_q2');
      expect(question?.question).toBe('Question 1.2');
      expect(question?.difficulty).toBe('easy');
    });

    it('should return undefined when ID does not exist', async () => {
      const question = await getQuestionById('nonexistent_id');
      expect(question).toBeUndefined();
    });
  });

  describe('getSavedAnswers', () => {
    const mockUserId = 'user_test_id';
    const mockQuestionId = 'set1_q1';
    const mockAttempts: UserQuestionAttempt[] = [
      { id: 'attempt1', userId: mockUserId, questionId: mockQuestionId, answer: 'My first answer', savedAt: new Date(), updatedAt: new Date(), evaluations: [] },
      { id: 'attempt2', userId: mockUserId, questionId: mockQuestionId, answer: 'My second answer', savedAt: new Date(), updatedAt: new Date(), evaluations: [] },
    ];

    it('should return saved answers for an authenticated user', async () => {
      mockedAuth.mockResolvedValue({ user: { id: mockUserId } } as any);
      mockedPrisma.userQuestionAttempt.findMany.mockResolvedValue(mockAttempts);

      const answers = await getSavedAnswers(mockQuestionId);
      expect(mockedAuth).toHaveBeenCalledTimes(1);
      expect(mockedPrisma.userQuestionAttempt.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId, questionId: mockQuestionId },
        orderBy: { savedAt: 'desc' },
      });
      expect(answers).toEqual(mockAttempts);
    });

    it('should return an empty array if user has no saved answers for that question', async () => {
      mockedAuth.mockResolvedValue({ user: { id: mockUserId } } as any);
      mockedPrisma.userQuestionAttempt.findMany.mockResolvedValue([]);

      const answers = await getSavedAnswers(mockQuestionId);
      expect(answers).toEqual([]);
    });

    it('should return an empty array if no user is authenticated', async () => {
      mockedAuth.mockResolvedValue(null); // Simulate unauthenticated user

      const answers = await getSavedAnswers(mockQuestionId);
      expect(mockedAuth).toHaveBeenCalledTimes(1);
      expect(mockedPrisma.userQuestionAttempt.findMany).not.toHaveBeenCalled();
      expect(answers).toEqual([]);
    });

    it('should return an empty array on Prisma error', async () => {
      mockedAuth.mockResolvedValue({ user: { id: mockUserId } } as any);
      mockedPrisma.userQuestionAttempt.findMany.mockRejectedValue(new Error('Prisma connection failed'));

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress error log during test
      const answers = await getSavedAnswers(mockQuestionId);

      expect(answers).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to fetch saved answers'), expect.any(Error));
      consoleErrorSpy.mockRestore();
    });
  });
});
