import { renderHook, waitFor, act } from '@testing-library/react';
import { useAvailability } from '../../../hooks/useAvailability';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as authService from '../../../services/authService';

// Mock the auth service to prevent actual API calls
vi.mock('../../../services/authService', () => ({
    checkAvailability: vi.fn(),
}));

describe('useAvailability', () => {
    beforeEach(() => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        (authService.checkAvailability as any).mockResolvedValue({
            usernameTaken: false,
            emailTaken: false
        });
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
        vi.clearAllMocks();
    });

    it('should check username availability when valid username is entered', async () => {
        const formData = { username: 'validuser', email: '' };
        const setErrors = vi.fn();

        const { result } = renderHook(() => useAvailability({ formData, setErrors }));

        // Fast-forward timer to trigger the check
        act(() => {
            vi.advanceTimersByTime(600);
        });

        await waitFor(() => {
            expect(authService.checkAvailability).toHaveBeenCalledWith(expect.objectContaining({
                username: 'validuser'
            }));
        });
    });

    it('should set error if username is taken', async () => {
        (authService.checkAvailability as any).mockResolvedValue({
            usernameTaken: true,
            emailTaken: false
        });

        const formData = { username: 'takenuser', email: '' };
        const setErrors = vi.fn();

        const { result } = renderHook(() => useAvailability({ formData, setErrors }));

        act(() => {
            vi.advanceTimersByTime(600);
        });

        await waitFor(() => {
            expect(authService.checkAvailability).toHaveBeenCalled();
        });

        // Verify setErrors was called to update errors
        expect(setErrors).toHaveBeenCalled();
        // Since setErrors uses a functional update related to previous state, 
        // we can verify it was called with a function.
        expect(setErrors).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should check email availability when valid email is entered', async () => {
        const formData = { username: '', email: 'test@example.com' };
        const setErrors = vi.fn();

        const { result } = renderHook(() => useAvailability({ formData, setErrors }));

        act(() => {
            vi.advanceTimersByTime(600);
        });

        await waitFor(() => {
            expect(authService.checkAvailability).toHaveBeenCalledWith(expect.objectContaining({
                email: 'test@example.com'
            }));
        });
    });

    it('should not check invalid username', async () => {
        const formData = { username: 'inv', email: '' }; // Too short, invalid
        const setErrors = vi.fn();

        renderHook(() => useAvailability({ formData, setErrors }));

        act(() => {
            vi.advanceTimersByTime(600);
        });

        expect(authService.checkAvailability).not.toHaveBeenCalled();
    });
});
