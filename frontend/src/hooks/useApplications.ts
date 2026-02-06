import { useState, useEffect } from 'react';
import { applicationService } from '../services';

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
            } else if (data) {
                setApplications([data]);
            } else {
                setApplications([]);
            }
        } catch (err) {
            console.error('Failed to fetch applications:', err);
            setError('Could not load applications. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // fetchApplications(); // until backend is ready
        setLoading(false);
    }, []);

    return {
        applications,
        loading,
        error,
        refetch: fetchApplications
    };
};
