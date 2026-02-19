import { useState, useEffect } from 'react';
import { applicationService } from '../services/applicationService';

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

