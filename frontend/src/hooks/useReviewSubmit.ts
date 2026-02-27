import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplication } from '../contexts/ApplicationContext';

/**
 * Custom hook for managing the review and submission phase of a job application.
 * Ensures the application meets minimum requirements before calling the submission service.
 * 
 * @returns {Object} An object containing application data, submission state, and handlers.
 * @property {Competence[]} competences - The list of added competence profiles.
 * @property {Availability[]} availability - The list of added availability periods.
 * @property {boolean} isSubmitting - True if the submission request is in progress.
 * @property {string | null} error - Current submission error message key or null.
 * @property {Function} setError - State setter for the error message.
 * @property {Function} handleFinalSubmit - Validates requirements and performs the final application submission.
 * @property {Function} clearApplication - Clears all application data from context.
 * @property {Function} clearError - Resets the submission error state.
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
