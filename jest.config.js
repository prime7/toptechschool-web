module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    // Handle CSS imports (if you're using CSS Modules)
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Handle image imports
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js',
    // Handle module aliases
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    // Use ts-jest for .ts and .tsx files
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json', // Or your specific tsconfig for tests
    }],
  },
  // Ignore Next.js specific files/folders if not needed for unit/integration tests
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
};
