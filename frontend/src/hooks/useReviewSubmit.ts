import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplication } from '../contexts/ApplicationContext';

/**
 * Hook for managing the review and submission phase of an application
 */
export const useReviewSubmit = () => {
    const navigate = useNavigate();
    const { competences, availability, submitApplication, isSubmitting, clearApplication } = useApplication();
    const [error, setError] = useState<string | null>(null);

    const handleFinalSubmit = async () => {
        setError(null);

        if (competences.length === 0) {
            setError('Please add at least one competence');
            return false;
        }

        if (availability.length === 0) {
            setError('Please add at least one availability period');
            return false;
        }

        const success = await submitApplication();
        if (success) {
            navigate('/applicant/apply/confirmation');
            return true;
        } else {
            setError('Failed to submit application. Please try again.');
            return false;
        }
    };

    const clearError = () => setError(null);

    return {
        competences,
        availability,
        isSubmitting,
        error,
        setError,
        handleFinalSubmit,
        clearApplication,
        clearError
    };
};
