// Test setup file
import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '.env.test' });

// Increase timeout for integration tests
jest.setTimeout(30000);

// Global test teardown
afterAll(async () => {
  // Clean up any resources if needed
  await new Promise(resolve => setTimeout(resolve, 500));
});

// This empty test prevents "no tests" error
describe('Setup', () => {
  it('should run setup correctly', () => {
    expect(true).toBe(true);
  });
});
