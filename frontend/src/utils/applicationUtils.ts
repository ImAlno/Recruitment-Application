import { AVAILABLE_COMPETENCES } from '../types/application';
import type { AvailabilityPeriod } from '../types/application';

/**
 * Utility functions related to applications
 */

/**
 * Retrieves the human-readable label for a given competence ID.
 * 
 * @param {number} id - The ID of the competence.
 * @returns {string} The label of the competence if found, otherwise 'Unknown'.
 */
export const getCompetenceLabel = (id: number): string => {
    return AVAILABLE_COMPETENCES.find(c => c.id === id)?.label || 'Unknown';
};

/**
 * Determines the appropriate CSS text color class based on the application status.
 * 
 * @param {string} status - The status of the application (e.g., 'accepted', 'rejected', 'unhandled').
 * @returns {string} A Tailwind CSS class for text color.
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
 * Checks if a proposed availability period overlaps with any existing availability periods.
 * 
 * @param {string} startDate - The start date of the new period (ISO string or date string).
 * @param {string} endDate - The end date of the new period (ISO string or date string).
 * @param {AvailabilityPeriod[]} existingPeriods - An array of already added availability periods.
 * @returns {boolean} True if there is an overlap, false otherwise.
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
 * Validates that the end date occurs after the start date.
 * 
 * @param {string} startDate - The start date string.
 * @param {string} endDate - The end date string.
 * @returns {boolean} True if both dates exist and end date is after start date.
 */
export const isValidDateRange = (startDate: string, endDate: string): boolean => {
    if (!startDate || !endDate) return false;
    return new Date(endDate) > new Date(startDate);
};
