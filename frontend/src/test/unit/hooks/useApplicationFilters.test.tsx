import { renderHook, act } from '@testing-library/react';
import { useApplicationFilters } from '../../../hooks/useApplicationFilters';
import { describe, it, expect } from 'vitest';

const mockApplications = [
    {
        application_id: 1,
        first_name: 'Alice',
        last_name: 'Smith',
        status: 'unhandled',
        created_at: '2023-01-01T10:00:00Z',
        competence_profile: [{ competence_id: 1 }] // ticket_sales
    },
    {
        application_id: 2,
        first_name: 'Bob',
        last_name: 'Jones',
        status: 'accepted',
        created_at: '2023-01-02T10:00:00Z',
        competence_profile: [{ competence_id: 2 }] // lotteries
    },
    {
        application_id: 3,
        first_name: 'Charlie',
        last_name: 'Brown',
        status: 'rejected',
        created_at: '2023-01-03T10:00:00Z',
        competence_profile: [{ competence_id: 3 }] // roller_coaster
    }
];

describe('useApplicationFilters', () => {
    it('should return all applications initially', () => {
        const { result } = renderHook(() => useApplicationFilters(mockApplications));
        expect(result.current.filteredApplications).toHaveLength(3);
    });

    it('should filter by name', () => {
        const { result } = renderHook(() => useApplicationFilters(mockApplications));

        act(() => {
            result.current.handleFilterChange('name', 'Alice');
        });

        expect(result.current.filteredApplications).toHaveLength(1);
        expect(result.current.filteredApplications[0].first_name).toBe('Alice');
    });

    it('should filter by status', () => {
        const { result } = renderHook(() => useApplicationFilters(mockApplications));

        act(() => {
            result.current.handleFilterChange('status', {
                unhandled: true,
                accepted: false,
                rejected: false
            });
        });

        expect(result.current.filteredApplications).toHaveLength(1);
        expect(result.current.filteredApplications[0].status).toBe('unhandled');
    });

    it('should filter by competence', () => {
        const { result } = renderHook(() => useApplicationFilters(mockApplications));

        act(() => {
            result.current.handleFilterChange('competence', 'ticket_sales');
        });

        expect(result.current.filteredApplications).toHaveLength(1);
        expect(result.current.filteredApplications[0].competence_profile[0].competence_id).toBe(1);
    });

    it('should sort by date asc', () => {
        const { result } = renderHook(() => useApplicationFilters(mockApplications));

        act(() => {
            result.current.handleFilterChange('sortBy', 'date');
            result.current.handleFilterChange('sortOrder', 'asc');
        });

        expect(result.current.filteredApplications[0].application_id).toBe(1);
        expect(result.current.filteredApplications[2].application_id).toBe(3);
    });

    it('should sort by date desc', () => {
        const { result } = renderHook(() => useApplicationFilters(mockApplications));

        act(() => {
            result.current.handleFilterChange('sortBy', 'date');
            result.current.handleFilterChange('sortOrder', 'desc');
        });

        expect(result.current.filteredApplications[0].application_id).toBe(3);
        expect(result.current.filteredApplications[2].application_id).toBe(1);
    });

    it('should calculate stats correctly', () => {
        const { result } = renderHook(() => useApplicationFilters(mockApplications));

        expect(result.current.stats).toEqual({
            unhandled: 1,
            accepted: 1,
            rejected: 1
        });
    });

    it('should reset filters', () => {
        const { result } = renderHook(() => useApplicationFilters(mockApplications));

        act(() => {
            result.current.handleFilterChange('name', 'Something');
        });
        expect(result.current.filteredApplications).toHaveLength(0);

        act(() => {
            result.current.handleReset();
        });
        expect(result.current.filteredApplications).toHaveLength(3);
        expect(result.current.filters.name).toBe('');
    });
});
