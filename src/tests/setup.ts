import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

global.URL.createObjectURL = () => 'mock-url';
global.URL.revokeObjectURL = () => {};
