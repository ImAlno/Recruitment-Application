/**
 * useReviewSubmit Hook Tests
 * Tests the final review and submission step of the applicant application flow.
 * Covers validation (empty competences/availability), successful submission navigation,
 * error handling on submission failure, and the clearError helper.
 */
import { renderHook, act } from '@testing-library/react';
import { useReviewSubmit } from '../../../hooks/useReviewSubmit';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

// Mocks for ApplicationContext state
const mockSubmitApplication = vi.fn();
const mockClearApplication = vi.fn();

// Default mock values (will be overridden per test as needed)
let mockCompetences: any[] = [];
let mockAvailability: any[] = [];

vi.mock('../../../contexts/ApplicationContext', () => ({
    useApplication: () => ({
        competences: mockCompetences,
        availability: mockAvailability,
        submitApplication: mockSubmitApplication,
        isSubmitting: false,
        clearApplication: mockClearApplication,
    }),
}));

describe('useReviewSubmit', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockCompetences = [];
        mockAvailability = [];
    });

    it('should expose competences, availability, isSubmitting from context', () => {
        mockCompetences = [{ competence_id: 1, years_of_experience: 2 }];
        mockAvailability = [{ from_date: '2023-01-01', to_date: '2023-06-01' }];

        const { result } = renderHook(() => useReviewSubmit());

        expect(result.current.competences).toEqual(mockCompetences);
        expect(result.current.availability).toEqual(mockAvailability);
        expect(result.current.isSubmitting).toBe(false);
    });

    it('should return an error and false when competences list is empty', async () => {
        mockCompetences = [];
        mockAvailability = [{ from_date: '2023-01-01', to_date: '2023-06-01' }];

        const { result } = renderHook(() => useReviewSubmit());

        let returnValue: boolean | undefined;
        await act(async () => {
            returnValue = await result.current.handleFinalSubmit();
        });

        expect(returnValue).toBe(false);
        expect(result.current.error).toBe('validation.minOneCompetence');
        expect(mockSubmitApplication).not.toHaveBeenCalled();
    });

    it('should return an error and false when availability list is empty', async () => {
        mockCompetences = [{ competence_id: 1, years_of_experience: 2 }];
        mockAvailability = [];

        const { result } = renderHook(() => useReviewSubmit());

        let returnValue: boolean | undefined;
        await act(async () => {
            returnValue = await result.current.handleFinalSubmit();
        });

        expect(returnValue).toBe(false);
        expect(result.current.error).toBe('validation.minOneAvailability');
        expect(mockSubmitApplication).not.toHaveBeenCalled();
    });

    it('should call submitApplication, navigate, and return true on successful submit', async () => {
        mockCompetences = [{ competence_id: 1, years_of_experience: 2 }];
        mockAvailability = [{ from_date: '2023-01-01', to_date: '2023-06-01' }];
        mockSubmitApplication.mockResolvedValueOnce(true);

        const { result } = renderHook(() => useReviewSubmit());

        let returnValue: boolean | undefined;
        await act(async () => {
            returnValue = await result.current.handleFinalSubmit();
        });

        expect(mockSubmitApplication).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/applicant/apply/confirmation');
        expect(returnValue).toBe(true);
        expect(result.current.error).toBeNull();
    });

    it('should set submissionFailed error and return false when submitApplication returns false', async () => {
        mockCompetences = [{ competence_id: 1, years_of_experience: 2 }];
        mockAvailability = [{ from_date: '2023-01-01', to_date: '2023-06-01' }];
        mockSubmitApplication.mockResolvedValueOnce(false);

        const { result } = renderHook(() => useReviewSubmit());

        let returnValue: boolean | undefined;
        await act(async () => {
            returnValue = await result.current.handleFinalSubmit();
        });

        expect(mockNavigate).not.toHaveBeenCalled();
        expect(returnValue).toBe(false);
        expect(result.current.error).toBe('errors.submissionFailed');
    });

    it('should clear the error when clearError is called', async () => {
        mockCompetences = [];
        mockAvailability = [];

        const { result } = renderHook(() => useReviewSubmit());

        // Trigger an error first
        await act(async () => {
            await result.current.handleFinalSubmit();
        });
        expect(result.current.error).not.toBeNull();

        // Clear it
        act(() => {
            result.current.clearError();
        });

        expect(result.current.error).toBeNull();
    });

    it('should expose clearApplication from context', () => {
        const { result } = renderHook(() => useReviewSubmit());

        act(() => {
            result.current.clearApplication();
        });

        expect(mockClearApplication).toHaveBeenCalledTimes(1);
    });
});
