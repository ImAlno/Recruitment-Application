import { useState } from 'react';
import { useApplication } from '../contexts/ApplicationContext';
import { isOverlapping, isValidDateRange } from '../utils/applicationUtils';

/**
 * Hook for managing the availability form state
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
