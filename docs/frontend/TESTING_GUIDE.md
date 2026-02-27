# Frontend Testing Guide

This document explains the unit testing strategy, tools, and practices used in the Recruitment Application frontend.

## 🛠️ Testing Stack

We use a modern testing stack designed for speed and reliability:

- **[Vitest](https://vitest.dev/)**: A Vite-native unit test framework. It's fast, supports HMR, and shares configuration with Vite.
- **[React Testing Library (RTL)](https://testing-library.com/docs/react-testing-library/intro/)**: Focuses on testing components from the user's perspective (behavioral testing) rather than implementation details.
- **[Mock Service Worker (MSW)](https://mswjs.io/)**: Intercepts network requests at the network level. This allows us to test API interactions without a real backend, ensuring tests are deterministic and fast.
- **[jsdom](https://github.com/jsdom/jsdom)**: A pure-JavaScript implementation of many web standards, providing a browser-like environment in Node.js.

## 🚀 How to Run Tests

The following scripts are available in `package.json`:

| Command | Description |
|---------|-------------|
| `npm run test` | Runs all tests in the terminal. |
| `npm run test:ui` | Opens the Vitest UI, a beautiful web dashboard for viewing and debugging tests. |
| `npm run test:coverage` | Generates a code coverage report (stored in `/coverage`). |

## 🧪 What is Being Tested?

Our tests are organized into the `src/test/unit` directory and follow a layered approach:

### 1. Service Layer (`/services`)
- **Focus**: API call logic, URL construction, request/response interceptors.
- **Goal**: Ensure the `ApiClient` correctly communicates with the backend and handles status codes (401, 500, etc.).

### 2. Hooks Layer (`/hooks`)
- **Focus**: Complex business logic extracted into custom hooks (e.g., `useApplications`).
- **Goal**: Verify state transitions, side effects, and data processing independent of the UI.

### 3. Context Layer (`/contexts`)
- **Focus**: Global state management (e.g., `AuthContext`).
- **Goal**: Verify session persistence (`localStorage`), login/logout logic, and state distribution across the app.

### 4. Component Layer (`/components` & `/pages`)
- **Atomic Components**: Testing `Input`, `Button`, etc., for accessibility, variants, and basic interaction.
- **Pages**: Testing full user flows like Login and Registration. This includes form validation, debounced availability checks, and navigation.

## 📂 Test Organization

Tests are separated from source code to keep the `src` directory clean:

```text
src/test/
├── mocks/          # MSW request handlers and server setup
├── unit/           # The actual test files
│   ├── components/ # tests for UI components
│   ├── contexts/   # tests for React contexts
│   ├── hooks/      # tests for custom hooks
│   ├── pages/      # tests for full pages
│   └── services/   # tests for API services
└── setup.ts        # Global Vitest configuration and mocks
```

## 💡 Best Practices
- **Mock Network Requests**: Always use MSW handlers for API calls.
- **User-Centric Selectors**: Prefer `findByRole` or `findByLabelText` over test IDs or class names.
- **Handle Async Properly**: Use `waitFor` or `findBy*` queries for elements that appear after an async action (like a debounce or API call).
