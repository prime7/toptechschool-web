import { POST } from './route'; // Adjust path as necessary
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import * as practiceActions from '@/actions/practice';
import { aiEvaluationService } from '@/lib/ai/evaluationService';
import { NextRequest } from 'next/server';
import type { UserQuestionAttempt } from '@prisma/client';
import { PracticeQuestion } from '@/app/(authenticated)/practice/types';

// Mock dependencies
jest.mock('@/lib/auth');
jest.mock('@/lib/prisma', () => ({
  prisma: {
    userQuestionAttempt: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));
jest.mock('@/actions/practice', () => ({
  getQuestionById: jest.fn(),
}));
jest.mock('@/lib/ai/evaluationService', () => ({
  aiEvaluationService: {
    evaluateAnswer: jest.fn(),
  },
}));

const mockedAuth = auth as jest.MockedFunction<typeof auth>;
const mockedPrisma = prisma as jest.Mocked<typeof prisma>;
const mockedGetQuestionById = practiceActions.getQuestionById as jest.MockedFunction<typeof practiceActions.getQuestionById>;
const mockedAiService = aiEvaluationService as jest.Mocked<typeof aiEvaluationService>;

describe('POST /api/practice/evaluate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUserId = 'user_test_id_456';
  const mockAttemptId = 'attempt_id_abc';
  const mockQuestionId = 'q_xyz';

  const mockAttempt: UserQuestionAttempt = {
    id: mockAttemptId,
    userId: mockUserId,
    questionId: mockQuestionId,
    answer: 'A user answer.',
    savedAt: new Date(),
    updatedAt: new Date(),
    evaluations: [] as any[], // Start with no evaluations
  };

  const mockQuestion: PracticeQuestion = {
    id: mockQuestionId,
    question: 'The original question text?',
    categories: ['Test'],
    difficulty: 'easy',
    type: 'text',
  };

  it('should successfully evaluate an answer for an authenticated user', async () => {
    mockedAuth.mockResolvedValue({ user: { id: mockUserId } } as any);
    mockedPrisma.userQuestionAttempt.findUnique.mockResolvedValue(mockAttempt);
    mockedGetQuestionById.mockResolvedValue(mockQuestion);
    mockedAiService.evaluateAnswer.mockResolvedValue({ feedback: 'Great job!' });
    mockedPrisma.userQuestionAttempt.update.mockImplementation(async (args: any) => ({
      ...mockAttempt,
      evaluations: args.data.evaluations, // Return the updated evaluations
    }));


    const req = new NextRequest('http://localhost/api/practice/evaluate', {
      method: 'POST',
      body: JSON.stringify({ userQuestionAttemptId: mockAttemptId }),
    });

    const response = await POST(req);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.message).toBe('Evaluation successful');
    expect(responseBody.evaluation).toEqual(expect.objectContaining({ feedback: 'Great job!' }));
    expect(responseBody.attempt.evaluations).toHaveLength(1);
    expect(responseBody.attempt.evaluations[0].feedback).toBe('Great job!');

    expect(mockedPrisma.userQuestionAttempt.findUnique).toHaveBeenCalledWith({ where: { id: mockAttemptId } });
    expect(mockedGetQuestionById).toHaveBeenCalledWith(mockQuestionId);
    expect(mockedAiService.evaluateAnswer).toHaveBeenCalledWith({ question: mockQuestion.question, answer: mockAttempt.answer });
    expect(mockedPrisma.userQuestionAttempt.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: mockAttemptId },
      data: { evaluations: expect.arrayContaining([expect.objectContaining({ feedback: 'Great job!' })]) },
    }));
  });

  it('should return 401 if user is not authenticated', async () => {
    mockedAuth.mockResolvedValue(null);
    const req = new NextRequest('http://localhost/api/practice/evaluate', {
      method: 'POST',
      body: JSON.stringify({ userQuestionAttemptId: mockAttemptId }),
    });
    const response = await POST(req);
    expect(response.status).toBe(401);
  });

  it('should return 404 if attempt is not found', async () => {
    mockedAuth.mockResolvedValue({ user: { id: mockUserId } } as any);
    mockedPrisma.userQuestionAttempt.findUnique.mockResolvedValue(null);
    const req = new NextRequest('http://localhost/api/practice/evaluate', {
      method: 'POST',
      body: JSON.stringify({ userQuestionAttemptId: 'non_existent_id' }),
    });
    const response = await POST(req);
    expect(response.status).toBe(404);
  });

  it('should return 403 if attempt does not belong to the user', async () => {
    mockedAuth.mockResolvedValue({ user: { id: mockUserId } } as any);
    mockedPrisma.userQuestionAttempt.findUnique.mockResolvedValue({ ...mockAttempt, userId: 'another_user_id' });
    const req = new NextRequest('http://localhost/api/practice/evaluate', {
      method: 'POST',
      body: JSON.stringify({ userQuestionAttemptId: mockAttemptId }),
    });
    const response = await POST(req);
    expect(response.status).toBe(403);
  });

  it('should return 429 if attempt was already evaluated today', async () => {
    mockedAuth.mockResolvedValue({ user: { id: mockUserId } } as any);
    const evaluatedAttempt = {
      ...mockAttempt,
      evaluations: [{ evaluatedAt: new Date().toISOString(), feedback: 'Already done.' }] as any[],
    };
    mockedPrisma.userQuestionAttempt.findUnique.mockResolvedValue(evaluatedAttempt);

    const req = new NextRequest('http://localhost/api/practice/evaluate', {
      method: 'POST',
      body: JSON.stringify({ userQuestionAttemptId: mockAttemptId }),
    });
    const response = await POST(req);
    expect(response.status).toBe(429);
  });

  it('should return 500 if original question details are not found', async () => {
    mockedAuth.mockResolvedValue({ user: { id: mockUserId } } as any);
    mockedPrisma.userQuestionAttempt.findUnique.mockResolvedValue(mockAttempt); // Attempt found
    mockedGetQuestionById.mockResolvedValue(undefined); // Original question not found

    const req = new NextRequest('http://localhost/api/practice/evaluate', {
      method: 'POST',
      body: JSON.stringify({ userQuestionAttemptId: mockAttemptId }),
    });
    const response = await POST(req);
    const responseBody = await response.json();

    expect(response.status).toBe(500);
    expect(responseBody.error).toBe('Original question details not found.');
  });

  it('should return 500 on Prisma update error', async () => {
    mockedAuth.mockResolvedValue({ user: { id: mockUserId } } as any);
    mockedPrisma.userQuestionAttempt.findUnique.mockResolvedValue(mockAttempt);
    mockedGetQuestionById.mockResolvedValue(mockQuestion);
    mockedAiService.evaluateAnswer.mockResolvedValue({ feedback: 'Great job!' });
    mockedPrisma.userQuestionAttempt.update.mockRejectedValue(new Error("DB update failed"));

    const req = new NextRequest('http://localhost/api/practice/evaluate', {
      method: 'POST',
      body: JSON.stringify({ userQuestionAttemptId: mockAttemptId }),
    });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const response = await POST(req);
    const responseBody = await response.json();

    expect(response.status).toBe(500);
    expect(responseBody.error).toBe('Internal Server Error');
    consoleErrorSpy.mockRestore();
  });

});
