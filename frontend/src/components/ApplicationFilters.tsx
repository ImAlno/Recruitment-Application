import Card, { CardHeader, CardTitle, CardContent } from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';

interface ApplicationFiltersProps {
    filters: {
        name: string;
        competence: string;
        status: {
            unhandled: boolean;
            accepted: boolean;
            rejected: boolean;
        };
        sortBy: string;
        sortOrder: string;
    };
    onFilterChange: (key: string, value: any) => void;
    onReset: () => void;
}

const ApplicationFilters = ({ filters, onFilterChange, onReset }: ApplicationFiltersProps) => {
    const handleStatusChange = (status: 'unhandled' | 'accepted' | 'rejected') => {
        onFilterChange('status', {
            ...filters.status,
            [status]: !filters.status[status]
        });
    };

    return (
        <Card className="h-fit">
            <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Search
                    </label>
                    <Input
                        placeholder="Applicant Name..."
                        value={filters.name}
                        onChange={(e) => onFilterChange('name', e.target.value)}
                    />
                </div>

                <Select
                    label="Competence"
                    value={filters.competence}
                    onChange={(e) => onFilterChange('competence', e.target.value)}
                    options={[
                        { label: "All Competences", value: "" },
                        { label: "Ticket Sales", value: "ticket_sales" },
                        { label: "Lotteries", value: "lotteries" },
                        { label: "Roller Coaster Operation", value: "roller_coaster" },
                    ]}
                />

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Status</label>
                    <div className="space-y-1">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300"
                                checked={filters.status.unhandled}
                                onChange={() => handleStatusChange('unhandled')}
                            />
                            <span className="text-sm">Unhandled</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300"
                                checked={filters.status.accepted}
                                onChange={() => handleStatusChange('accepted')}
                            />
                            <span className="text-sm">Accepted</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300"
                                checked={filters.status.rejected}
                                onChange={() => handleStatusChange('rejected')}
                            />
                            <span className="text-sm">Rejected</span>
                        </label>
                    </div>
                </div>

                <Select
                    label="Sort By"
                    value={filters.sortBy}
                    onChange={(e) => onFilterChange('sortBy', e.target.value)}
                    options={[
                        { label: "Submission Date", value: "date" },
                        { label: "Applicant Name", value: "name" },
                        { label: "Status", value: "status" },
                    ]}
                />

                <Select
                    label="Order"
                    value={filters.sortOrder}
                    onChange={(e) => onFilterChange('sortOrder', e.target.value)}
                    options={[
                        { label: "A-Z", value: "asc" },
                        { label: "Z-A", value: "desc" },
                    ]}
                />

                <Button variant="outline" fullWidth onClick={onReset}>Reset Filters</Button>
            </CardContent>
        </Card>
    );
};

export default ApplicationFilters;
