import { setupTestEnvironment, teardownTestEnvironment, testUser } from './globalSetup';

beforeAll(async () => {
    await setupTestEnvironment();
});

afterAll(async () => {
    await teardownTestEnvironment();
});

export { testUser };