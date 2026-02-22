/**
 * MSW Server Configuration
 * This initializes the mock server for the Node.js environment (jsdom).
 */
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
