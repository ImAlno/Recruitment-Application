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
            setError('validation.minOneCompetence');
            return false;
        }

        if (availability.length === 0) {
            setError('validation.minOneAvailability');
            return false;
        }

        const success = await submitApplication();
        if (success) {
            navigate('/applicant/apply/confirmation');
            return true;
        } else {
            setError('errors.submissionFailed');
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
