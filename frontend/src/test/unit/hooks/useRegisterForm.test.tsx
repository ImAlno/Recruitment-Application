/**
 * useRegisterForm Hook Tests
 * Tests the registration form logic: field management, validation, password visibility,
 * availability checking integration, and final submission.
 */
import { renderHook, act, waitFor } from '@testing-library/react';
import { useRegisterForm } from '../../../hooks/useRegisterForm';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as authService from '../../../services/authService';

// Mock the auth service to prevent real network calls
vi.mock('../../../services/authService', () => ({
    registerApplicant: vi.fn(),
    checkAvailability: vi.fn(),
}));

// Mock useAvailability to isolate register form logic
vi.mock('../../../hooks/useAvailability', () => ({
    useAvailability: vi.fn(() => ({
        isCheckingUsername: false,
        isCheckingEmail: false,
        setIsCheckingUsername: vi.fn(),
        setIsCheckingEmail: vi.fn(),
        checkedValues: {},
    })),
}));

describe('useRegisterForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize with empty form data and no errors', () => {
        const { result } = renderHook(() => useRegisterForm());

        expect(result.current.formData.firstName).toBe('');
        expect(result.current.formData.lastName).toBe('');
        expect(result.current.formData.email).toBe('');
        expect(result.current.formData.username).toBe('');
        expect(result.current.formData.password).toBe('');
        expect(result.current.errors).toEqual({});
        expect(result.current.isSubmitting).toBe(false);
        expect(result.current.showPassword).toBe(false);
        expect(result.current.success).toBeNull();
    });

    it('should update formData when handleChange is called', () => {
        const { result } = renderHook(() => useRegisterForm());

        act(() => {
            result.current.handleChange({
                target: { name: 'firstName', value: 'Alice' },
            } as React.ChangeEvent<HTMLInputElement>);
        });

        expect(result.current.formData.firstName).toBe('Alice');
    });

    it('should format personNumber with dashes on change', () => {
        const { result } = renderHook(() => useRegisterForm());

        act(() => {
            result.current.handleChange({
                target: { name: 'personNumber', value: '199001011234' },
            } as React.ChangeEvent<HTMLInputElement>);
        });

        // formatPersonNumber should format "199001011234" as "19900101-1234"
        expect(result.current.formData.personNumber).toBe('19900101-1234');
    });

    it('should toggle showPassword', () => {
        const { result } = renderHook(() => useRegisterForm());

        expect(result.current.showPassword).toBe(false);

        act(() => {
            result.current.setShowPassword(true);
        });

        expect(result.current.showPassword).toBe(true);
    });

    it('should set validation errors for empty required fields on submit', async () => {
        const { result } = renderHook(() => useRegisterForm());

        await act(async () => {
            await result.current.handleSubmit();
        });

        expect(result.current.errors.firstName).toBe('validation.firstNameRequired');
        expect(result.current.errors.lastName).toBe('validation.lastNameRequired');
        expect(result.current.errors.email).toBe('validation.emailRequired');
        expect(result.current.errors.personNumber).toBe('validation.personNumberRequired');
        expect(result.current.errors.username).toBe('validation.usernameRequired');
        expect(result.current.errors.password).toBe('validation.passwordRequired');
    });

    it('should set email invalid error when email format is wrong', async () => {
        const { result } = renderHook(() => useRegisterForm());

        act(() => {
            result.current.handleChange({
                target: { name: 'email', value: 'not-an-email' },
            } as React.ChangeEvent<HTMLInputElement>);
        });

        await act(async () => {
            await result.current.handleSubmit();
        });

        expect(result.current.errors.email).toBe('validation.emailInvalid');
    });

    it('should set password errors when password does not meet requirements', async () => {
        const { result } = renderHook(() => useRegisterForm());

        act(() => {
            result.current.handleChange({ target: { name: 'firstName', value: 'Alice' } } as any);
            result.current.handleChange({ target: { name: 'lastName', value: 'Smith' } } as any);
            result.current.handleChange({ target: { name: 'email', value: 'alice@example.com' } } as any);
            result.current.handleChange({ target: { name: 'personNumber', value: '19900101-1234' } } as any);
            result.current.handleChange({ target: { name: 'username', value: 'alicesmith' } } as any);
            result.current.handleChange({ target: { name: 'password', value: 'weak' } } as any);
        });

        await act(async () => {
            await result.current.handleSubmit();
        });

        expect(result.current.errors.password).toMatch(/^PASSWORD_ERROR:/);
    });

    it('should call registerApplicant and set success on valid submission', async () => {
        (authService.registerApplicant as any).mockResolvedValueOnce({});

        const { result } = renderHook(() => useRegisterForm());

        act(() => {
            result.current.handleChange({ target: { name: 'firstName', value: 'Alice' } } as any);
            result.current.handleChange({ target: { name: 'lastName', value: 'Smith' } } as any);
            result.current.handleChange({ target: { name: 'email', value: 'alice@example.com' } } as any);
            result.current.handleChange({ target: { name: 'personNumber', value: '19900101-1234' } } as any);
            result.current.handleChange({ target: { name: 'username', value: 'alicesmith' } } as any);
            result.current.handleChange({ target: { name: 'password', value: 'StrongPass1!' } } as any);
        });

        await act(async () => {
            await result.current.handleSubmit();
        });

        expect(authService.registerApplicant).toHaveBeenCalled();
        // success is set to the translation key returned by the t() mock (which returns the key)
        expect(result.current.success).toBe('common.success.registration');
    });

    it('should set submit error when registerApplicant fails', async () => {
        (authService.registerApplicant as any).mockRejectedValueOnce(new Error('Registration failed'));

        const { result } = renderHook(() => useRegisterForm());

        act(() => {
            result.current.handleChange({ target: { name: 'firstName', value: 'Alice' } } as any);
            result.current.handleChange({ target: { name: 'lastName', value: 'Smith' } } as any);
            result.current.handleChange({ target: { name: 'email', value: 'alice@example.com' } } as any);
            result.current.handleChange({ target: { name: 'personNumber', value: '19900101-1234' } } as any);
            result.current.handleChange({ target: { name: 'username', value: 'alicesmith' } } as any);
            result.current.handleChange({ target: { name: 'password', value: 'StrongPass1!' } } as any);
        });

        await act(async () => {
            await result.current.handleSubmit();
        });

        expect(result.current.errors.submit).toBe('Registration failed');
        expect(result.current.isSubmitting).toBe(false);
    });

    it('should clear a specific error using clearErrors(key)', () => {
        const { result } = renderHook(() => useRegisterForm());

        act(() => {
            result.current.setErrors({ firstName: 'validation.firstNameRequired', email: 'validation.emailRequired' });
        });

        act(() => {
            result.current.clearErrors('firstName');
        });

        expect(result.current.errors.firstName).toBeUndefined();
        expect(result.current.errors.email).toBe('validation.emailRequired');
    });

    it('should clear all errors using clearErrors()', () => {
        const { result } = renderHook(() => useRegisterForm());

        act(() => {
            result.current.setErrors({ firstName: 'err1', email: 'err2' });
        });

        act(() => {
            result.current.clearErrors();
        });

        expect(result.current.errors).toEqual({});
    });

    it('should not submit if async username error exists', async () => {
        const { result } = renderHook(() => useRegisterForm());

        // Set async error directly
        act(() => {
            result.current.setErrors({ username: 'validation.usernameExists' });
            result.current.handleChange({ target: { name: 'firstName', value: 'Alice' } } as any);
            result.current.handleChange({ target: { name: 'lastName', value: 'Smith' } } as any);
            result.current.handleChange({ target: { name: 'email', value: 'alice@example.com' } } as any);
            result.current.handleChange({ target: { name: 'personNumber', value: '19900101-1234' } } as any);
            result.current.handleChange({ target: { name: 'username', value: 'alicesmith' } } as any);
            result.current.handleChange({ target: { name: 'password', value: 'StrongPass1!' } } as any);
        });

        await act(async () => {
            await result.current.handleSubmit();
        });

        expect(authService.registerApplicant).not.toHaveBeenCalled();
    });
});
