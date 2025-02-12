import '@jest/globals';

// Mock environment variables
process.env = {
  ...process.env,
  AZURE_OPENAI_ENDPOINT: 'https://test-endpoint.azure.com',
  AZURE_OPENAI_API_KEY: 'test-api-key',
  AZURE_OPENAI_DEPLOYMENT_NAME: 'test-deployment'
};

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    query: {}
  })
}));