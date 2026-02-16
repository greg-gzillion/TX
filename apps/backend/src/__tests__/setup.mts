import { jest } from '@jest/globals';

// Increase timeout for integration tests
jest.setTimeout(30000);

// Global test teardown
afterAll(async () => {
  // Add any cleanup here
  await new Promise(resolve => setTimeout(resolve, 500));
});

// Add any other global setup here
beforeAll(() => {
  // Add any setup here
});

// Add a dummy test so this file doesn't complain about "no tests"
describe('Setup', () => {
  it('should run setup correctly', () => {
    expect(true).toBe(true);
  });
});
