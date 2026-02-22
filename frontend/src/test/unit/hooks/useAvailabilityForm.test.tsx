/**
 * useAvailabilityForm Hook Tests
 * Tests the availability period form: initial state, validation (empty dates, invalid
 * date range, overlapping periods), successful add, and form reset.
 */
import { renderHook, act } from '@testing-library/react';
import { useAvailabilityForm } from '../../../hooks/useAvailabilityForm';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock useApplication so we don't need the unexported ApplicationContext.Provider
const mockAddAvailability = vi.fn();
const mockRemoveAvailability = vi.fn();
const mockClearApplication = vi.fn();
let mockAvailability: any[] = [];

vi.mock('../../../contexts/ApplicationContext', () => ({
    useApplication: () => ({
        competences: [],
        availability: mockAvailability,
        addCompetence: vi.fn(),
        removeCompetence: vi.fn(),
        addAvailability: mockAddAvailability,
        removeAvailability: mockRemoveAvailability,
        clearApplication: mockClearApplication,
        submitApplication: vi.fn(),
        isSubmitting: false,
    }),
}));

describe('useAvailabilityForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockAvailability = [];
    });

    it('should initialize with empty values', () => {
        const { result } = renderHook(() => useAvailabilityForm());

        expect(result.current.startDate).toBe('');
        expect(result.current.endDate).toBe('');
        expect(result.current.error).toBe('');
    });

    it('should validate empty start date', () => {
        const { result } = renderHook(() => useAvailabilityForm());

        act(() => {
            const success = result.current.handleAddAvailability();
            expect(success).toBe(false);
        });

        expect(result.current.error).toBe('validation.selectStartDate');
    });

    it('should validate missing end date', () => {
        const { result } = renderHook(() => useAvailabilityForm());

        act(() => {
            result.current.setStartDate('2023-01-01');
        });

        act(() => {
            const success = result.current.handleAddAvailability();
            expect(success).toBe(false);
        });

        expect(result.current.error).toBe('validation.selectEndDate');
    });

    it('should validate invalid date range (start after end)', () => {
        const { result } = renderHook(() => useAvailabilityForm());

        act(() => {
            result.current.setStartDate('2023-01-05');
            result.current.setEndDate('2023-01-01');
        });

        act(() => {
            const success = result.current.handleAddAvailability();
            expect(success).toBe(false);
        });

        expect(result.current.error).toBe('validation.dateRangeInvalid');
    });

    it('should add availability when valid', () => {
        const { result } = renderHook(() => useAvailabilityForm());

        act(() => {
            result.current.setStartDate('2023-01-01');
            result.current.setEndDate('2023-01-05');
        });

        act(() => {
            const success = result.current.handleAddAvailability();
            expect(success).toBe(true);
        });

        expect(mockAddAvailability).toHaveBeenCalledWith({
            from_date: '2023-01-01',
            to_date: '2023-01-05'
        });

        // Should reset form
        expect(result.current.startDate).toBe('');
        expect(result.current.endDate).toBe('');
        expect(result.current.error).toBe('');
    });

    it('should reject overlapping availability periods', () => {
        // Pre-populate with an existing period
        mockAvailability = [{ from_date: '2023-01-01', to_date: '2023-01-31' }];

        const { result } = renderHook(() => useAvailabilityForm());

        act(() => {
            result.current.setStartDate('2023-01-15');
            result.current.setEndDate('2023-02-15');
        });

        act(() => {
            const success = result.current.handleAddAvailability();
            expect(success).toBe(false);
        });

        expect(result.current.error).toBe('validation.dateOverlap');
        expect(mockAddAvailability).not.toHaveBeenCalled();
    });

    it('should clear the error when clearError is called', () => {
        const { result } = renderHook(() => useAvailabilityForm());

        act(() => {
            result.current.setError('some error');
        });

        act(() => {
            result.current.clearError();
        });

        expect(result.current.error).toBe('');
    });
});
