import { useState, useMemo } from 'react';

export const useApplicationFilters = (applications: any[]) => {
    const [filters, setFilters] = useState({
        name: '',
        status: {
            unhandled: true,
            accepted: true,
            rejected: true
        },
        sortBy: 'date',
        sortOrder: 'asc'
    });

    const handleFilterChange = (key: string, value: any) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleReset = () => {
        setFilters({
            name: '',
            status: {
                unhandled: true,
                accepted: true,
                rejected: true
            },
            sortBy: 'date',
            sortOrder: 'asc'
        });
    };

    const filteredApplications = useMemo(() => {
        if (!applications) return [];

        let result = [...applications];

        // 1. Filter by Name
        if (filters.name) {
            const search = filters.name.toLowerCase();
            result = result.filter(app =>
                app.firstName?.toLowerCase().includes(search) ||
                app.lastName?.toLowerCase().includes(search)
            );
        }

        // 2. Filter by Status
        result = result.filter(app =>
            (app.status === 'unhandled' && filters.status.unhandled) ||
            (app.status === 'accepted' && filters.status.accepted) ||
            (app.status === 'rejected' && filters.status.rejected)
        );

        // 3. Sorting
        result.sort((a, b) => {
            let valA: any, valB: any;

            switch (filters.sortBy) {
                case 'name':
                    valA = `${a.firstName} ${a.lastName}`.toLowerCase();
                    valB = `${b.firstName} ${b.lastName}`.toLowerCase();
                    break;
                case 'status':
                    valA = a.status;
                    valB = b.status;
                    break;
                case 'date':
                default:
                    valA = new Date(a.createdAt).getTime();
                    valB = new Date(b.createdAt).getTime();
                    break;
            }

            if (valA < valB) return filters.sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return filters.sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [applications, filters]);

    const stats = useMemo(() => {
        if (!applications) return { unhandled: 0, accepted: 0, rejected: 0 };
        return applications.reduce((acc: Record<string, number>, app: any) => {
            if (acc[app.status] !== undefined) {
                acc[app.status]++;
            }
            return acc;
        }, { unhandled: 0, accepted: 0, rejected: 0 });
    }, [applications]);

    return {
        filters,
        setFilters,
        handleFilterChange,
        handleReset,
        filteredApplications,
        stats
    };
};
