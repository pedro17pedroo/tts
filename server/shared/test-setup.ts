// Global test setup file

// Setup global mocks
global.console = {
  ...console,
  error: () => {},
  warn: () => {},
  log: () => {},
};

// Mock environment variables for tests
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';

// Global test utilities
beforeEach(() => {
  // Clear all mocks before each test
  // Mock clearing logic here
});

afterEach(() => {
  // Clean up after each test
  // Mock restoration logic here
});