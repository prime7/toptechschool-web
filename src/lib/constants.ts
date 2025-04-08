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

export const RESTRICTED_ROUTES = [
  "/upload",
  "/resume",
  "/job",
  "/practice/:id/start",
  "/api/job/evaluate",
  "/api/file-upload",
  "/api/resume/:resumeId",
] as const;

export const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "chrome-extension://",
] as const;

export const OPENAI_CONFIG = {
  MODEL: "gpt-4o-mini",
  MAX_TOKENS: 10000,
  TEMPERATURE: 0.3,
} as const;

export const R2_CONFIG = {
  REGION: "auto",
  DEFAULT_EXPIRY: 3600,
} as const;

export const FILE_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ["application/pdf"],
} as const; 