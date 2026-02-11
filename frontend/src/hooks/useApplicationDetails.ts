import { useState, useEffect } from 'react';
import { useApplications } from './useApplications';
import { applicationService } from '../services/applicationService';
export const useApplicationDetails = (id: string | undefined) => {
    const { applications, loading: appsLoading } = useApplications();
    const [application, setApplication] = useState<any | null>(null);
    const [status, setStatus] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!appsLoading && applications.length > 0 && id) {
            const foundApp = applications.find(app => app.application_id === parseInt(id));
            if (foundApp) {
                setApplication(foundApp);
                setStatus(foundApp.status);
            }
        }
    }, [appsLoading, applications, id]);

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatus(e.target.value);
    };

    const handleSaveStatus = async () => {
        if (!application) return;

        setIsSaving(true);
        setSuccessMessage(null);
        setErrorMessage(null);
        try {
            await applicationService.updateApplicationStatus(application.application_id, status);

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
        loading: appsLoading,
        handleStatusChange,
        handleSaveStatus,
        clearMessages: () => {
            setSuccessMessage(null);
            setErrorMessage(null);
        }
    };
};
