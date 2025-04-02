import { Ratelimit } from '@upstash/ratelimit';
import { redis } from './client';

export enum RateLimitKey {
  ResumeUpload = 'resume_upload',
  JobAnalyze = 'job_analyze',
}

type Duration = '1m' | '5m' | '15m' | '1h' | '1d';

interface RateLimitConfig {
  limit: number;
  duration: Duration;
  errorMessage?: string;
}

const rateLimitConfig: Record<RateLimitKey, RateLimitConfig> = {
  [RateLimitKey.ResumeUpload]: {
    limit: 2,
    duration: '1d',
    errorMessage: 'You can only upload 2 resumes per day'
  },
  [RateLimitKey.JobAnalyze]: {
    limit: 3,
    duration: '1h',
    errorMessage: 'You can analyze 3 jobs per hour'
  }
}

const rateLimiters: Record<string, Ratelimit> = {};

const getRateLimitKey = (key: RateLimitKey) => {
  const config = rateLimitConfig[key];
  const cacheKey = `${key}_${config.limit}`;

  if (!rateLimiters[cacheKey]) {
    rateLimiters[cacheKey] = new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(config.limit, config.duration),
      analytics: true,
      prefix: key
    });
  }
  return rateLimiters[cacheKey];
}

export class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RateLimitError';
  }
}

export const checkRateLimit = async (key: RateLimitKey, identifier: string) => {
  const rateLimiter = getRateLimitKey(key);
  const uniqueKey = `${key}_${identifier}`;
  const config = rateLimitConfig[key];

  try {
    const result = await rateLimiter.limit(uniqueKey);
    if (!result.success) {
      throw new RateLimitError(config.errorMessage || `Rate limit exceeded for ${key}`);
    }
    return true;
  } catch (error) {
    if (error instanceof RateLimitError) {
      throw error;
    }
    throw new Error('An unexpected error occurred during rate limiting');
  }
}

export const withRateLimit = async <T>(
  key: RateLimitKey,
  identifier: string,
  fn: () => Promise<T>
): Promise<T> => {
  await checkRateLimit(key, identifier);
  return await fn();
}

export const getRateLimitInfo = (key: RateLimitKey) => {
  const config = rateLimitConfig[key];
  return {
    limit: config.limit,
    duration: config.duration,
    errorMessage: config.errorMessage
  };
}
