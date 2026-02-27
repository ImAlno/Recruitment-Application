import { useState, useEffect } from 'react';
import { applicationService } from '../services/applicationService';

/**
 * Custom hook for managing the details of a specific job application.
 * Handles fetching application data, updating its status, and managing success/error messages.
 * 
 * @param {string | undefined} id - The ID of the application to manage.
 * @returns {Object} An object containing application data, status management state, and handlers.
 * @property {any | null} application - The fetched application data or null if not yet loaded.
 * @property {string} status - The current status of the application being viewed/edited.
 * @property {boolean} isSaving - True if a status update is currently in progress.
 * @property {string | null} successMessage - Current success message key or null.
 * @property {string | null} errorMessage - Current error message key or null.
 * @property {boolean} loading - True if the application data is currently being fetched.
 * @property {Function} handleStatusChange - Event handler for updating the status state from a select element.
 * @property {Function} handleSaveStatus - Async function to persist the status update to the server.
 * @property {Function} clearMessages - Function to clear both success and error messages.
 */
export const useApplicationDetails = (id: string | undefined) => {
    const [application, setApplication] = useState<any | null>(null);
    const [status, setStatus] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        applicationService.getApplicationById(Number(id))
            .then((data) => {
                setApplication(data);
                setStatus(data?.status ?? '');
            })
            .catch(() => {
                setErrorMessage('errors.loadApplicationsFailed');
            })
            .finally(() => setLoading(false));
    }, [id]);

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatus(e.target.value);
    };

    const handleSaveStatus = async () => {
        if (!application) return;

        setIsSaving(true);
        setSuccessMessage(null);
        setErrorMessage(null);
        try {
            await applicationService.updateApplicationStatus(application.applicationId, status);
            setApplication({ ...application, status });
            setSuccessMessage(`errors.statusUpdated:${status}`);
        } catch (error) {
            console.error('Failed to update status:', error);
            setErrorMessage('errors.updateStatusFailed');
        } finally {
            setIsSaving(false);
        }
    };

    return {
        application,
        status,
        isSaving,
        successMessage,
        errorMessage,
        loading,
        handleStatusChange,
        handleSaveStatus,
        clearMessages: () => {
            setSuccessMessage(null);
            setErrorMessage(null);
        }
    };
};

