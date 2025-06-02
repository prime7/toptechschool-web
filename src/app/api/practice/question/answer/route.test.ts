import { POST } from './route'; // Adjust path as necessary
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Mock dependencies
jest.mock('@/lib/auth');
jest.mock('@/lib/prisma', () => ({
  prisma: {
    userQuestionAttempt: {
      create: jest.fn(),
    },
  },
}));

const mockedAuth = auth as jest.MockedFunction<typeof auth>;
const mockedPrisma = prisma as jest.Mocked<typeof prisma>;

describe('POST /api/practice/question/answer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUserId = 'user_test_id_123';

  it('should save an answer successfully for an authenticated user', async () => {
    mockedAuth.mockResolvedValue({ user: { id: mockUserId } } as any);
    const mockAttempt = {
      id: 'attempt_id_1',
      userId: mockUserId,
      questionId: 'q1',
      answer: 'This is a test answer.',
      evaluations: [],
      savedAt: new Date(),
      updatedAt: new Date(),
    };
    mockedPrisma.userQuestionAttempt.create.mockResolvedValue(mockAttempt);

    const requestBody = { questionId: 'q1', answer: 'This is a test answer.' };
    const req = new NextRequest('http://localhost/api/practice/question/answer', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(req);
    const responseBody = await response.json();

    expect(response.status).toBe(201);
    expect(responseBody.message).toBe('Answer saved successfully');
    expect(responseBody.attempt).toEqual(expect.objectContaining({
      questionId: 'q1',
      answer: 'This is a test answer.',
      userId: mockUserId,
    }));
    expect(mockedPrisma.userQuestionAttempt.create).toHaveBeenCalledWith({
      data: {
        userId: mockUserId,
        questionId: 'q1',
        answer: 'This is a test answer.',
        evaluations: [],
      },
    });
  });

  it('should return 401 if user is not authenticated', async () => {
    mockedAuth.mockResolvedValue(null);

    const requestBody = { questionId: 'q1', answer: 'This is a test answer.' };
    const req = new NextRequest('http://localhost/api/practice/question/answer', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    const response = await POST(req);
    const responseBody = await response.json();

    expect(response.status).toBe(401);
    expect(responseBody.error).toBe('Unauthorized');
    expect(mockedPrisma.userQuestionAttempt.create).not.toHaveBeenCalled();
  });

  it('should return 400 for invalid request body (e.g., empty answer)', async () => {
    mockedAuth.mockResolvedValue({ user: { id: mockUserId } } as any);

    const requestBody = { questionId: 'q1', answer: '' }; // Empty answer
    const req = new NextRequest('http://localhost/api/practice/question/answer', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    const response = await POST(req);
    const responseBody = await response.json();

    expect(response.status).toBe(400);
    expect(responseBody.error).toBe('Invalid request body');
    expect(responseBody.details).toBeDefined(); // Zod error details
    expect(mockedPrisma.userQuestionAttempt.create).not.toHaveBeenCalled();
  });

  it('should return 400 if questionId is missing', async () => {
    mockedAuth.mockResolvedValue({ user: { id: mockUserId } } as any);

    const requestBody = { answer: 'A valid answer' }; // Missing questionId
    const req = new NextRequest('http://localhost/api/practice/question/answer', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    const response = await POST(req);
    const responseBody = await response.json();

    expect(response.status).toBe(400);
    expect(responseBody.error).toBe('Invalid request body');
    expect(mockedPrisma.userQuestionAttempt.create).not.toHaveBeenCalled();
  });

  it('should return 500 if Prisma create fails', async () => {
    mockedAuth.mockResolvedValue({ user: { id: mockUserId } } as any);
    mockedPrisma.userQuestionAttempt.create.mockRejectedValue(new Error('Database error'));

    const requestBody = { questionId: 'q1', answer: 'This is a test answer.' };
    const req = new NextRequest('http://localhost/api/practice/question/answer', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const response = await POST(req);
    const responseBody = await response.json();

    expect(response.status).toBe(500);
    expect(responseBody.error).toBe('Internal Server Error');
    consoleErrorSpy.mockRestore();
  });
});
