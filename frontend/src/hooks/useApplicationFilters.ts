import { useState, useMemo } from 'react';

export const useApplicationFilters = (applications: any[]) => {
    // Filter State
    const [filters, setFilters] = useState({
        name: '',
        competence: '',
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
            competence: '',
            status: {
                unhandled: true,
                accepted: true,
                rejected: true
            },
            sortBy: 'date',
            sortOrder: 'asc'
        });
    };

    // Filter and Sort Logic
    const filteredApplications = useMemo(() => {
        if (!applications) return [];

        let result = [...applications];

        // 1. Filter by Name
        if (filters.name) {
            const search = filters.name.toLowerCase();
            result = result.filter(app =>
                app.first_name.toLowerCase().includes(search) ||
                app.last_name.toLowerCase().includes(search)
            );
        }

        // 2. Filter by Competence
        if (filters.competence) {
            const competenceMap: Record<string, number> = {
                'ticket_sales': 1,
                'lotteries': 2,
                'roller_coaster': 3
            };
            const targetId = competenceMap[filters.competence];
            if (targetId) {
                result = result.filter(app =>
                    app.competence_profile?.some((c: any) => c.competence_id === targetId)
                );
            }
        }

        // 3. Filter by Status
        result = result.filter(app =>
            (app.status === 'unhandled' && filters.status.unhandled) ||
            (app.status === 'accepted' && filters.status.accepted) ||
            (app.status === 'rejected' && filters.status.rejected)
        );

        // 4. Sorting
        result.sort((a, b) => {
            let valA, valB;

            switch (filters.sortBy) {
                case 'name':
                    valA = `${a.first_name} ${a.last_name}`.toLowerCase();
                    valB = `${b.first_name} ${b.last_name}`.toLowerCase();
                    break;
                case 'status':
                    valA = a.status;
                    valB = b.status;
                    break;
                case 'date':
                default:
                    valA = new Date(a.created_at).getTime();
                    valB = new Date(b.created_at).getTime();
                    break;
            }

            if (valA < valB) return filters.sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return filters.sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [applications, filters]);

    // Statistics Calculation
    const stats = useMemo(() => {
        if (!applications) return { unhandled: 0, accepted: 0, rejected: 0 };
        return applications.reduce((acc, app) => {
            if (acc[app.status] !== undefined) {
                acc[app.status]++;
            }
            return acc;
        }, { unhandled: 0, accepted: 0, rejected: 0 } as Record<string, number>);
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
