import { renderHook, act } from '@testing-library/react';
import { useApplicationDetails } from '../../../hooks/useApplicationDetails';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { applicationService } from '../../../services/applicationService';

describe('useApplicationDetails', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should find and return application details by id', async () => {
        const { result } = renderHook(() => useApplicationDetails('1'));

        await act(async () => {
            // Wait for useEffect to finish
        });

        expect(result.current.application).toEqual({
            applicationId: 1,
            status: 'unhandled',
            firstName: 'Test',
            lastName: 'User'
        });
        expect(result.current.status).toBe('unhandled');
    });

    it('should handle non-existent application id', async () => {
        const { result } = renderHook(() => useApplicationDetails('999'));

        await act(async () => {
            // Wait for useEffect to finish
        });

        expect(result.current.application).toBeNull();
    });

    it('should update status state when handleStatusChange is called', async () => {
        const { result } = renderHook(() => useApplicationDetails('1'));

        await act(async () => {
            // Wait for load
        });

        act(() => {
            result.current.handleStatusChange({ target: { value: 'accepted' } } as any);
        });

        expect(result.current.status).toBe('accepted');
        // application state should not change yet
        expect(result.current.application.status).toBe('unhandled');
    });

    it('should call service and update application on save', async () => {
        const updateSpy = vi.spyOn(applicationService, 'updateApplicationStatus').mockResolvedValue({} as any);
        const { result } = renderHook(() => useApplicationDetails('1'));

        await act(async () => {
            // Wait for load
        });

        // Change status first
        act(() => {
            result.current.handleStatusChange({ target: { value: 'accepted' } } as any);
        });

        // Save
        await act(async () => {
            await result.current.handleSaveStatus();
        });

        expect(updateSpy).toHaveBeenCalledWith(1, 'accepted');
        expect(result.current.application.status).toBe('accepted');
        expect(result.current.successMessage).toContain('accepted');
        expect(result.current.isSaving).toBe(false);
    });

    it('should handle save error', async () => {
        const updateSpy = vi.spyOn(applicationService, 'updateApplicationStatus').mockRejectedValue(new Error('Update failed'));
        const { result } = renderHook(() => useApplicationDetails('1'));

        await act(async () => {
            // Wait for load
        });

        act(() => {
            result.current.handleStatusChange({ target: { value: 'rejected' } } as any);
        });

        await act(async () => {
            await result.current.handleSaveStatus();
        });

        expect(updateSpy).toHaveBeenCalled();
        expect(result.current.errorMessage).toBe('errors.updateStatusFailed');
        expect(result.current.isSaving).toBe(false);
    });
});
