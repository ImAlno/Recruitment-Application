import { useState, useEffect } from 'react';
import { useApplications } from './useApplications';
import { applicationService } from '../services/applicationService';

export const useApplicationDetails = (id: string | undefined) => {
    const { applications, loading: appsLoading } = useApplications();
    const [application, setApplication] = useState<any | null>(null);
    const [status, setStatus] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);

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
        try {
            await applicationService.updateApplicationStatus(application.application_id, status);

            setApplication({ ...application, status });
            alert(`Status updated to ${status}`);
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Failed to update status. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return {
        application,
        status,
        isSaving,
        loading: appsLoading,
        handleStatusChange,
        handleSaveStatus
    };
};
