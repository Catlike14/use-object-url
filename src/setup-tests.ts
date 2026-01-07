import { beforeAll } from 'vitest';

beforeAll(() => {
  // Mock URL.createObjectURL and URL.revokeObjectURL if not available
  if (typeof URL.createObjectURL === 'undefined') {
    URL.createObjectURL = () => 'blob:mock-url';
  }
  if (typeof URL.revokeObjectURL === 'undefined') {
    URL.revokeObjectURL = () => {};
  }
});
