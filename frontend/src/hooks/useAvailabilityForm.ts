import { useState } from 'react';
import { useApplication } from '../contexts/ApplicationContext';
import { isOverlapping, isValidDateRange } from '../utils/applicationUtils';

/**
 * Custom hook for managing the availability form state and logic.
 * Integrates with ApplicationContext to add and remove availability periods.
 * 
 * @returns {Object} An object containing form state, validation error, and handlers.
 * @property {string} startDate - The selected start date for the availability period.
 * @property {Function} setStartDate - State setter for the start date.
 * @property {string} endDate - The selected end date for the availability period.
 * @property {Function} setEndDate - State setter for the end date.
 * @property {string} error - Current validation error message key.
 * @property {Function} setError - State setter for the error message.
 * @property {Availability[]} availability - The list of currently added availability periods.
 * @property {Function} handleAddAvailability - Validates and adds a new availability period. Returns true if successful.
 * @property {Function} removeAvailability - Removes an existing availability period by index.
 * @property {Function} clearApplication - Clears all application data (from context).
 * @property {Function} clearError - Resets the validation error state.
 */
export const useAvailabilityForm = () => {
    const { availability, addAvailability, removeAvailability, clearApplication } = useApplication();
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleAddAvailability = () => {
        // Validation
        if (!startDate) {
            setError('validation.selectStartDate');
            return false;
        }

        if (!endDate) {
            setError('validation.selectEndDate');
            return false;
        }

        // Check that end date is after start date
        if (!isValidDateRange(startDate, endDate)) {
            setError('validation.dateRangeInvalid');
            return false;
        }

        // Check for overlapping periods
        if (isOverlapping(startDate, endDate, availability)) {
            setError('validation.dateOverlap');
            return false;
        }

        // Add availability period
        addAvailability({
            from_date: startDate,
            to_date: endDate,
        });

        // Reset form
        setStartDate('');
        setEndDate('');
        setError('');
        return true;
    };

    const clearError = () => setError('');

    return {
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        error,
        setError,
        availability,
        handleAddAvailability,
        removeAvailability,
        clearApplication,
        clearError
    };
};
