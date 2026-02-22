/**
 * useApplications Hook Tests
 * This file tests the custom hook responsible for fetching and managing
 * application data within the UI components.
 */
import { renderHook, waitFor } from '@testing-library/react';
import { useApplications } from '../../../hooks/useApplications';
import { describe, it, expect, vi } from 'vitest';

describe('useApplications', () => {
    it('should fetch applications on mount', async () => {
        const { result } = renderHook(() => useApplications());

        expect(result.current.loading).toBe(true);

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.applications).toHaveLength(2);
        expect(result.current.error).toBeNull();
    });

    it('should handle fetch errors', async () => {
        // Mock the service to throw an error
        // We need to use vi.spyOn to mock the service method for this specific test
        const { applicationService } = await import('../../../services/applicationService');
        const getSpy = vi.spyOn(applicationService, 'getApplications').mockRejectedValue(new Error('Network error'));

        const { result } = renderHook(() => useApplications());

        expect(result.current.loading).toBe(true);

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.error).toBe('errors.loadApplicationsFailed');
        expect(result.current.applications).toEqual([]);

        getSpy.mockRestore();
    });
});
