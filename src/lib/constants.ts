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
  MAX_TOKENS: 16384,
  TEMPERATURE: 0.3,
  INPUT_COST_PER_1K_TOKENS: 0.00015,
  OUTPUT_COST_PER_1K_TOKENS: 0.0006
} as const;


export const ANTHROPIC_CONFIG = {
  MODEL: "claude-3-haiku-20240307",
  MAX_TOKENS: 4096,
  TEMPERATURE: 0.7,
  INPUT_COST_PER_1K_TOKENS: 0.0008,
  OUTPUT_COST_PER_1K_TOKENS: 0.004
} as const;


export const R2_CONFIG = {
  REGION: "auto",
  DEFAULT_EXPIRY: 3600,
} as const;

export const FILE_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ["application/pdf"],
} as const; 