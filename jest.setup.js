// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    forward: jest.fn(),
  })),
  usePathname: jest.fn(() => '/'),
  useParams: jest.fn(() => ({})), // Default mock for useParams
  redirect: jest.fn(),
}));

// Mock useToast
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(() => ({
    toast: jest.fn(),
  })),
}));

// You can add other global mocks or setup here if needed
// global.fetch = jest.fn(...) // Example for fetch
