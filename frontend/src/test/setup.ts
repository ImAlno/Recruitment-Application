/**
 * Vitest Global Setup
 * This file configures the testing environment for all unit tests.
 * It includes DOM matchers, MSW lifecycle management, and global mocks.
 */
import '@testing-library/jest-dom';
import { expect, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { server } from './mocks/server';

// Extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers as any);

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
    cleanup();
    // Reset any request handlers that we may add during the tests,
    // so they don't affect other tests.
    server.resetHandlers();
});

// Clean up after the tests are finished.
afterAll(() => server.close());

/**
 * Mocking react-i18next
 * Components often use the useTranslation hook which needs to be mocked
 * to prevent errors and ensure stable text matching in tests.
 */
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key, // Simply returns the key (e.g., 'common.login')
        i18n: {
            changeLanguage: () => Promise.resolve(),
        },
    }),
    initReactI18next: {
        type: '3rdParty',
        init: () => { },
    },
}));

/**
 * Mocking i18next
 * The ApiClient and other services use the i18next instance directly
 * for translations. This mock provides a chainable interface.
 */
vi.mock('i18next', () => {
    const i18nMock = {
        use: () => i18nMock,
        init: () => Promise.resolve(),
        t: (key: string) => key,
        changeLanguage: () => Promise.resolve(),
    };
    return {
        default: i18nMock,
        ...i18nMock,
    };
});
