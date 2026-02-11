import { useState } from 'react';
import { useApplication } from '../contexts/ApplicationContext';

/**
 * Hook for managing the competence profile form
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
