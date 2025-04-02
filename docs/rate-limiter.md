# Rate Limiter Documentation

## Overview

The rate limiter is a utility that helps control the frequency of actions performed by users or systems. It uses Redis to track and limit requests based on configurable parameters.

## Features

- Configurable limits and durations
- Custom error messages
- Type-safe implementation
- Reusable rate limiting wrapper
- Rate limit information retrieval

## Rate Limit Keys

```typescript
enum RateLimitKey {
  ResumeUpload = 'resume_upload',    // 2 uploads per day
  JobAnalyze = 'job_analyze',        // 3 analyses per hour
}
```

## Basic Usage

### 1. Direct Rate Limit Check

```typescript
import { checkRateLimit, RateLimitKey, RateLimitError } from '@/lib/redis/rate-limit';

async function uploadResume(userId: string) {
  try {
    await checkRateLimit(RateLimitKey.ResumeUpload, userId);
    // Proceed with resume upload
  } catch (error) {
    if (error instanceof RateLimitError) {
      // Handle rate limit error
      console.error(error.message);
    }
  }
}
```

### 2. Using withRateLimit Helper

```typescript
import { withRateLimit, RateLimitKey } from '@/lib/redis/rate-limit';

async function analyzeJob(userId: string, jobId: string) {
  try {
    await withRateLimit(
      RateLimitKey.JobAnalyze,
      userId,
      () => analyzeJobDetails(jobId)
    );
  } catch (error) {
    if (error instanceof RateLimitError) {
      // Handle rate limit error
    }
  }
}
```

## API Route Examples

### 1. Resume Upload API

```typescript
import { withRateLimit, RateLimitKey, RateLimitError } from '@/lib/redis/rate-limit';

export async function POST(req: Request) {
  const userId = getUserId(req);
  
  try {
    await withRateLimit(
      RateLimitKey.ResumeUpload,
      userId,
      async () => {
        const formData = await req.formData();
        return await uploadResumeToStorage(formData);
      }
    );
    
    return new Response('Resume uploaded successfully');
  } catch (error) {
    if (error instanceof RateLimitError) {
      return new Response(error.message, { status: 429 });
    }
    return new Response('Internal Server Error', { status: 500 });
  }
}
```

## Server Action Examples

### 1. Job Analysis Action

```typescript
'use server';

import { withRateLimit, RateLimitKey, RateLimitError } from '@/lib/redis/rate-limit';

export async function analyzeJobAction(userId: string, jobId: string) {
  try {
    return await withRateLimit(
      RateLimitKey.JobAnalyze,
      userId,
      async () => {
        const jobDetails = await fetchJobDetails(jobId);
        return await analyzeJobContent(jobDetails);
      }
    );
  } catch (error) {
    if (error instanceof RateLimitError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to analyze job');
  }
}
```

## UI Integration Examples

### 1. Display Rate Limit Information

```typescript
import { getRateLimitInfo, RateLimitKey } from '@/lib/redis/rate-limit';

function ResumeUploadForm() {
  const limitInfo = getRateLimitInfo(RateLimitKey.ResumeUpload);
  
  return (
    <div>
      <h2>Upload Resume</h2>
      <p className="text-sm text-muted-foreground">
        You can upload up to {limitInfo.limit} resumes per {limitInfo.duration}
      </p>
      {/* Upload form */}
    </div>
  );
}
```

### 2. Error Handling in UI

```typescript
'use client';

import { withRateLimit, RateLimitKey, RateLimitError } from '@/lib/redis/rate-limit';
import { useToast } from '@/hooks/use-toast';

export function JobAnalyzeButton({ jobId, userId }: { jobId: string; userId: string }) {
  const { toast } = useToast();
  
  const handleAnalyze = async () => {
    try {
      await withRateLimit(
        RateLimitKey.JobAnalyze,
        userId,
        () => analyzeJob(jobId)
      );
    } catch (error) {
      if (error instanceof RateLimitError) {
        toast({
          title: 'Rate Limit Exceeded',
          description: error.message,
          variant: 'destructive',
        });
      }
    }
  };
  
  return <Button onClick={handleAnalyze}>Analyze Job</Button>;
}
```

## Best Practices

1. **Error Handling**
   - Always catch and handle `RateLimitError` specifically
   - Provide user-friendly error messages
   - Log rate limit violations for monitoring

2. **Identifier Selection**
   - Use consistent identifiers (userId, email, IP)
   - Consider using multiple identifiers for stricter limits
   - Be mindful of privacy when storing identifiers

3. **UI Feedback**
   - Display rate limit information to users
   - Show remaining attempts when possible
   - Provide clear error messages

4. **Configuration**
   - Adjust limits based on user feedback
   - Monitor rate limit violations
   - Consider different limits for different user tiers

## Rate Limit Configuration

Current rate limits are configured as follows:

```typescript
const rateLimitConfig = {
  ResumeUpload: {
    limit: 2,
    duration: '1d',
    errorMessage: 'You can only upload 2 resumes per day'
  },
  JobAnalyze: {
    limit: 3,
    duration: '1h',
    errorMessage: 'You can analyze 3 jobs per hour'
  }
}
```

## Adding New Rate Limits

To add a new rate limit:

1. Add a new key to the `RateLimitKey` enum
2. Add configuration to `rateLimitConfig`
3. Use the new rate limit in your code

Example:

```typescript
// Add new rate limit key
export enum RateLimitKey {
  // ... existing keys
  NewFeature = 'new_feature',
}

// Add configuration
const rateLimitConfig = {
  // ... existing configs
  [RateLimitKey.NewFeature]: {
    limit: 5,
    duration: '15m',
    errorMessage: 'You can use this feature 5 times every 15 minutes'
  }
}
``` 