/**
 * useCompetenceForm Hook Tests
 * Tests the competence profile form: initial state, validation (no competence selected,
 * invalid years, duplicate competence), successful add, and form reset.
 */
import { renderHook, act } from '@testing-library/react';
import { useCompetenceForm } from '../../../hooks/useCompetenceForm';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the context via useApplication so we don't need the unexported ApplicationContext.Provider
const mockAddCompetence = vi.fn();
const mockRemoveCompetence = vi.fn();
const mockClearApplication = vi.fn();
let mockCompetences: any[] = [];

vi.mock('../../../contexts/ApplicationContext', () => ({
    useApplication: () => ({
        competences: mockCompetences,
        availability: [],
        addCompetence: mockAddCompetence,
        removeCompetence: mockRemoveCompetence,
        addAvailability: vi.fn(),
        removeAvailability: vi.fn(),
        clearApplication: mockClearApplication,
        submitApplication: vi.fn(),
        isSubmitting: false,
    }),
}));

describe('useCompetenceForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockCompetences = [];
    });

    it('should initialize with default values', () => {
        const { result } = renderHook(() => useCompetenceForm());

        expect(result.current.selectedCompetenceId).toBe(0);
        expect(result.current.years).toBe('0');
        expect(result.current.error).toBe('');
    });

    it('should validate unselected competence', () => {
        const { result } = renderHook(() => useCompetenceForm());

        act(() => {
            const success = result.current.handleAddCompetence();
            expect(success).toBe(false);
        });

        expect(result.current.error).toBe('validation.selectCompetence');
    });

    it('should validate invalid years', () => {
        const { result } = renderHook(() => useCompetenceForm());

        act(() => {
            result.current.setSelectedCompetenceId(1);
            result.current.setYears('-1');
        });

        act(() => {
            const success = result.current.handleAddCompetence();
            expect(success).toBe(false);
        });

        expect(result.current.error).toBe('validation.invalidYears');
    });

    it('should add competence when valid', () => {
        const { result } = renderHook(() => useCompetenceForm());

        act(() => {
            result.current.setSelectedCompetenceId(1);
            result.current.setYears('2.5');
        });

        act(() => {
            const success = result.current.handleAddCompetence();
            expect(success).toBe(true);
        });

        expect(mockAddCompetence).toHaveBeenCalledWith({
            competence_id: 1,
            years_of_experience: 2.5
        });

        // Should reset form
        expect(result.current.selectedCompetenceId).toBe(0);
        expect(result.current.years).toBe('0');
        expect(result.current.error).toBe('');
    });

    it('should reject duplicate competence', () => {
        // Pre-populate with an existing competence
        mockCompetences = [{ competence_id: 1, years_of_experience: 2 }];

        const { result } = renderHook(() => useCompetenceForm());

        act(() => {
            result.current.setSelectedCompetenceId(1);
            result.current.setYears('3');
        });

        act(() => {
            const success = result.current.handleAddCompetence();
            expect(success).toBe(false);
        });

        expect(result.current.error).toBe('validation.duplicateCompetence');
        expect(mockAddCompetence).not.toHaveBeenCalled();
    });

    it('should clear the error when clearError is called', () => {
        const { result } = renderHook(() => useCompetenceForm());

        act(() => {
            result.current.setError('some error');
        });

        act(() => {
            result.current.clearError();
        });

        expect(result.current.error).toBe('');
    });
});
