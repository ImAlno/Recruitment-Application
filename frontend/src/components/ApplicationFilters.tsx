import Card, { CardHeader, CardTitle, CardContent } from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import { useTranslation } from 'react-i18next';

/**
 * Props for the ApplicationFilters component.
 */
interface ApplicationFiltersProps {
    /** The current filter and sort settings. */
    filters: {
        /** Name search string. */
        name: string;
        /** Boolean flags for which statuses to include. */
        status: {
            unhandled: boolean;
            accepted: boolean;
            rejected: boolean;
        };
        /** The field to sort by (e.g., 'date', 'name', 'status'). */
        sortBy: string;
        /** The sort direction ('asc' or 'desc'). */
        sortOrder: string;
    };
    /** Callback function to handle changes to specific filters. */
    onFilterChange: (key: string, value: any) => void;
    /** Callback function to reset all filters to their defaults. */
    onReset: () => void;
}

/**
 * Component that provides a sidebar with filtering and sorting controls for the application list.
 * Includes search by name, status checkboxes, and sort field/order selection.
 * 
 * @param {ApplicationFiltersProps} props - The component props.
 * @returns {JSX.Element} The rendered filters component.
 */
const ApplicationFilters = ({ filters, onFilterChange, onReset }: ApplicationFiltersProps) => {
    const { t } = useTranslation();

    const handleStatusChange = (status: 'unhandled' | 'accepted' | 'rejected') => {
        onFilterChange('status', {
            ...filters.status,
            [status]: !filters.status[status]
        });
    };

    return (
        <Card className="h-fit">
            <CardHeader>
                <CardTitle className="text-lg">{t('filters.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {t('filters.search')}
                    </label>
                    <Input
                        placeholder={t('filters.searchPlaceholder')}
                        value={filters.name}
                        onChange={(e) => onFilterChange('name', e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">{t('filters.status')}</label>
                    <div className="space-y-1">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300"
                                checked={filters.status.unhandled}
                                onChange={() => handleStatusChange('unhandled')}
                            />
                            <span className="text-sm">{t('common.statuses.unhandled')}</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300"
                                checked={filters.status.accepted}
                                onChange={() => handleStatusChange('accepted')}
                            />
                            <span className="text-sm">{t('common.statuses.accepted')}</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300"
                                checked={filters.status.rejected}
                                onChange={() => handleStatusChange('rejected')}
                            />
                            <span className="text-sm">{t('common.statuses.rejected')}</span>
                        </label>
                    </div>
                </div>

                <Select
                    label={t('filters.sortBy')}
                    value={filters.sortBy}
                    onChange={(e) => onFilterChange('sortBy', e.target.value)}
                    options={[
                        { label: t('filters.submissionDate'), value: "date" },
                        { label: t('filters.applicantName'), value: "name" },
                        { label: t('common.status'), value: "status" },
                    ]}
                />

                <Select
                    label={t('filters.order')}
                    value={filters.sortOrder}
                    onChange={(e) => onFilterChange('sortOrder', e.target.value)}
                    options={[
                        { label: t('filters.orderAsc'), value: "asc" },
                        { label: t('filters.orderDesc'), value: "desc" },
                    ]}
                />

                <Button variant="outline" fullWidth onClick={onReset}>{t('filters.reset')}</Button>
            </CardContent>
        </Card>
    );
};

export default ApplicationFilters;
