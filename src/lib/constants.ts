export const API_ENDPOINTS = {
  AUTH: {
    SIGNIN: "/api/auth/signin",
    SIGNOUT: "/api/auth/signout",
  },
  RESUME: {
    BASE: "/api/resume",
    UPLOAD: "/api/file-upload",
  },
  JOB: {
    EVALUATE: "/api/job/evaluate",
  },
} as const;

export const RESTRICTED_PAGES = [
  "/upload",
  "/resume",
  "/job",
  "/practice/:id/start",
] as const;

export const RESTRICTED_API_ROUTES = [
  "/api/resume",
  "/api/evaluate/job",
  "/api/file-upload",
  "/api/resume/:resumeId",
] as const;

export const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "chrome-extension://",
] as const;

export const AI_CONFIGS = {
  "gpt-4o-mini": {
    model: "gpt-4o-mini", 
    maxTokens: 16384,
    temperature: 0.3,
    inputCostPer1kTokens: 0.00015,
    outputCostPer1kTokens: 0.0006
  },
  "claude-3-haiku-20240307": {
    model: "claude-3-haiku-20240307",
    maxTokens: 4096,
    temperature: 0.7,
    inputCostPer1kTokens: 0.0008,
    outputCostPer1kTokens: 0.004
  }
} as const;


export const R2_CONFIG = {
  REGION: "auto",
  DEFAULT_EXPIRY: 3600,
} as const;

export const FILE_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ["application/pdf"],
} as const; 