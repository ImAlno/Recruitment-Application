import { AVAILABLE_COMPETENCES } from '../types/application';
import type { AvailabilityPeriod } from '../types/application';

/**
 * Utility functions related to applications
 */

/**
 * Get the label for a competence ID
 */
export const getCompetenceLabel = (id: number): string => {
    return AVAILABLE_COMPETENCES.find(c => c.id === id)?.label || 'Unknown';
};

/**
 * Get the CSS text color class for a given application status
 */
export const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
        case 'accepted':
            return 'text-green-600';
        case 'rejected':
            return 'text-red-600';
        case 'unhandled':
        default:
            return 'text-blue-600';
    }
};

/**
 * Check if a new availability period overlaps with existing periods
 */
export const isOverlapping = (
    startDate: string,
    endDate: string,
    existingPeriods: AvailabilityPeriod[]
): boolean => {
    const newStart = new Date(startDate);
    const newEnd = new Date(endDate);

    return existingPeriods.some(period => {
        const periodStart = new Date(period.from_date);
        const periodEnd = new Date(period.to_date);
        return (newStart <= periodEnd && newEnd >= periodStart);
    });
};

/**
 * Validate if an end date is after the start date
 */
export const isValidDateRange = (startDate: string, endDate: string): boolean => {
    if (!startDate || !endDate) return false;
    return new Date(endDate) > new Date(startDate);
};
