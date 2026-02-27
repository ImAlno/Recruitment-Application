import { useState } from 'react';
import { useApplication } from '../contexts/ApplicationContext';

/**
 * Custom hook for managing the competence profile form state and logic.
 * Integrates with ApplicationContext to add and remove competence entries.
 * 
 * @returns {Object} An object containing form state, validation error, and handlers.
 * @property {number} selectedCompetenceId - The ID of the currently selected competence.
 * @property {Function} setSelectedCompetenceId - State setter for the competence ID.
 * @property {string} years - The number of years of experience entered (as a string).
 * @property {Function} setYears - State setter for the years of experience.
 * @property {string} error - Current validation error message key.
 * @property {Function} setError - State setter for the error message.
 * @property {Competence[]} competences - The list of currently added competence profiles.
 * @property {Function} handleAddCompetence - Validates and adds a new competence profile. Returns true if successful.
 * @property {Function} removeCompetence - Removes an existing competence profile by ID.
 * @property {Function} clearApplication - Clears all application data from context.
 * @property {Function} clearError - Resets the validation error state.
 */
export const useCompetenceForm = () => {
    const { competences, addCompetence, removeCompetence, clearApplication } = useApplication();
    const [selectedCompetenceId, setSelectedCompetenceId] = useState<number>(0);
    const [years, setYears] = useState<string>('0');
    const [error, setError] = useState<string>('');

    const handleAddCompetence = () => {
        // Validation
        if (!selectedCompetenceId || selectedCompetenceId === 0) {
            setError('validation.selectCompetence');
            return false;
        }

        const yearsNum = parseFloat(years);
        if (years === '' || isNaN(yearsNum) || yearsNum < 0) {
            setError('validation.invalidYears');
            return false;
        }

        // Check if competence already exists
        const exists = competences.some(c => c.competence_id === selectedCompetenceId);
        if (exists) {
            setError('validation.duplicateCompetence');
            return false;
        }

        // Add competence
        addCompetence({
            competence_id: selectedCompetenceId,
            years_of_experience: yearsNum,
        });

        // Reset form
        setSelectedCompetenceId(0);
        setYears('0');
        setError('');
        return true;
    };

    const clearError = () => setError('');

    return {
        selectedCompetenceId,
        setSelectedCompetenceId,
        years,
        setYears,
        error,
        setError,
        competences,
        handleAddCompetence,
        removeCompetence,
        clearApplication,
        clearError
    };
};
