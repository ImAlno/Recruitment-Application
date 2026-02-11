import { useState, useEffect } from 'react';
import { applicationService } from '../services/applicationService';

/**
 * Hook for managing application data
 */
export const useApplications = () => {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await applicationService.getApplications();

            if (Array.isArray(data)) {
                setApplications(data);
            } else if (data && typeof data === 'object') {
                // Handle case where response might be wrapped or single object
                // If the backend returns { applications: [...] } or just [...]
                if (Array.isArray(data.applications)) {
                    setApplications(data.applications);
                } else {
                    setApplications([data]);
                }
            } else {
                setApplications([]);
            }
        } catch (err) {
            console.error('Failed to fetch applications:', err);
            setError('errors.loadApplicationsFailed');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    return {
        applications,
        loading,
        error,
        refetch: fetchApplications
    };
};
