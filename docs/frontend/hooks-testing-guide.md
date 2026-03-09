# Frontend Hooks Testing Guide

## Overview
This document outlines the general strategy, patterns, and libraries used to unit test custom React hooks in the frontend application. 

The custom hooks in our application manage component state, form validation, and complex asynchronous interactions with backend services. Our test suites ensure these hooks behave correctly in complete isolation.

## Tools & Libraries
- **Vitest**: The core test runner, used for assertions (`expect`), suite definitions (`describe`, `it`, `beforeEach`), and advanced mocking (`vi.mock`, `vi.fn`, `vi.spyOn`).
- **React Testing Library (`@testing-library/react`)**: Used for rendering the hooks in a simulated environment via `renderHook` and managing React state updates side-effects via `act`.

## General Testing Strategy

### 1. Rendering the Hook
Hooks are executed in a test environment using the `renderHook` function.
```tsx
const { result } = renderHook(() => useMyCustomHook('initial_arg'));
```
Once rendered, you can access the hook's returned variables, properties, and functions through the `result.current` container.

### 2. Mocking Dependencies
Hooks typically depend on external services (API calls), navigation libraries (`react-router-dom`), or custom sub-hooks. These are universally mocked to isolate the logic to only the hook under test.
- **Service Mocks**:
  ```tsx
  import { myService } from '../../../services/myService';
  vi.mock('../../../services/myService', () => ({
      myService: {
          fetchData: vi.fn(),
      },
  }));
  ```
- **Router/Navigation Mocks**:
  ```tsx
  const mockNavigate = vi.fn();
  vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return { ...actual, useNavigate: () => mockNavigate };
  });
  ```
- We clear all mock instances and states between test cases using `beforeEach(() => vi.clearAllMocks());`.

### 3. Context & Wrappers
If a hook relies on React Context (e.g., `AuthContext`, `MemoryRouter`), we provide a `wrapper` component around the `renderHook` execution:
```tsx
const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>
        <AuthProvider>{children}</AuthProvider>
    </MemoryRouter>
);

const { result } = renderHook(() => useLoginForm(), { wrapper });
```

### 4. Triggering State Changes (`act`)
When interacting with functions that update React state inside the hook (e.g. tracking changes from forms or UI events), we must wrap them in the `act(...)` utility from React Testing Library.
```tsx
act(() => {
    result.current.setUsername('testuser');
    result.current.setPassword('password123');
});
```

### 5. Handling Asynchronous Operations
For form submissions, data fetching loops, and generic Promise-based interactions, we use `await act(async () => { ... })`. This ensures the test execution pauses until the asynchronous logic resolves and the React tree successfully commits the state updates.
```tsx
await act(async () => {
    await result.current.handleSubmit();
});

// Assert API call was made to the correct module
expect(myService.fetchData).toHaveBeenCalled();
// Assert the hook updated its local loading state
expect(result.current.isLoading).toBe(false);
```

### 6. Error & Failure Simulating
We comprehensively test error conditions (e.g. failing validation loops, 401 Unauthorized API reponse codes, or hard 500 Server Errors) by mocking the promise rejection explicitly in our test cases.
```tsx
vi.mocked(myService.fetchData).mockRejectedValueOnce({ status: 401 });

// ...
expect(result.current.error).toBe('login.invalidCredentials');
```

## Summary
By rigorously mocking out all service/API integrations alongside the combined usage of `renderHook` mixed with synchronous and asynchronous `act()` wrappings, every hook in this application evaluates strictly its own internal state, loading indicators, data formatting, and variable assignments without bleeding externally into real DOM implementations or live backend calls.
