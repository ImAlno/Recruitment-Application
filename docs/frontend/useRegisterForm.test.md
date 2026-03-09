# Documentation: useRegisterForm.test.tsx

## Overview
The `useRegisterForm.test.tsx` file contains a comprehensive test suite for the `useRegisterForm` custom React hook. It verifies that the registration form logic—such as field management, input validation, availability checking integration, and final form submission—works correctly. 

The tests are written using **Vitest** for assertions/mocking and **React Testing Library** (`@testing-library/react`) for rendering and interacting with the hook in isolation using `renderHook` and `act`.

## Key Mocks
To test the hook in isolation and prevent real network requests, the following dependencies are mocked:
- **`authService`**: Both `registerApplicant` and `checkAvailability` are mocked using `vi.mock` to simulate successful or failed API calls.
- **`useAvailability` hook**: Mocked to isolate the form logic from the asynchronous username/email availability checks.

## Test Cases Breakdown

### 1. Initialization
- **Initial State**: Ensures the hook initializes with empty strings for all form fields (`firstName`, `lastName`, `email`, `username`, `password`, `personNumber`), an empty `errors` object, `showPassword` set to `false`, and `isSubmitting` set to `false`.

### 2. State Updates
- **`handleChange`**: Verifies that calling `handleChange` correctly updates the corresponding field in the `formData` state (e.g., updating `firstName`).
- **Formatting `personNumber`**: Tests that when a user types a 12-digit person number (e.g., `199001011234`), it is automatically formatted with a dash (`19900101-1234`).
- **Toggling Password Visibility**: Verifies that `setShowPassword(true)` toggles the `showPassword` boolean correctly.

### 3. Validation Logic
- **Required Fields**: Tests that submitting an empty form sets validation error messages (e.g., `validation.firstNameRequired`) for all required fields.
- **Email Format**: Submitting an improperly formatted email (`not-an-email`) sets a specific `validation.emailInvalid` error.
- **Password Strength**: Checks that providing a weak password sets a password strength error prefix (`PASSWORD_ERROR:`).

### 4. Submission Logic
- **Valid Submission**: Intercepts `registerApplicant` to simulate a successful API response. Fills the form with valid data, submits it, checks if the API was called, and verifies that the `success` state is properly set.
- **Failed Submission**: Mocks `registerApplicant` to reject with an error. Submits valid form data but verifies that the rejection sets an error in `errors.submit` and stops the `isSubmitting` loading state.
- **Blocked Submission**: Tests that the form prevents submission (API is not called) if an asynchronous availability error exists (e.g., the username is already taken).

### 5. Error Management
- **Clearing Specific Errors**: Verifies that `clearErrors('fieldName')` successfully removes only the targeted error from the `errors` object.
- **Clearing All Errors**: Verifies that calling `clearErrors()` without arguments clears the entire `errors` object.

## Conclusion
This test suite effectively completely covers the operational integrity of the `useRegisterForm` hook. By verifying state changes, input formatting, robust validation mechanisms, and proper API interactions, it ensures that users will experience a reliable and predictable registration process.
