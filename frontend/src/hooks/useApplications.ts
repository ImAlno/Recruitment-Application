import { useState, useEffect } from 'react';
import { applicationService } from '../services/applicationService';

/**
 * Custom hook for fetching and managing job applications.
 * Provides access to the list of applications, loading state, and error information.
 * 
 * @returns {Object} An object containing:
 * @property {any[]} applications - The list of fetched applications.
 * @property {boolean} loading - True if applications are currently being fetched.
 * @property {string | null} error - Error message key if the fetch failed, otherwise null.
 * @property {Function} refetch - Function to manually trigger a refetch of applications.
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
