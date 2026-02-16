import Card, { CardHeader, CardTitle, CardContent } from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import { useTranslation } from 'react-i18next';

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

                <Select
                    label={t('filters.competence')}
                    value={filters.competence}
                    onChange={(e) => onFilterChange('competence', e.target.value)}
                    options={[
                        { label: t('filters.allCompetences'), value: "" },
                        { label: t('common.competences.ticket_sales'), value: "ticket_sales" },
                        { label: t('common.competences.lotteries'), value: "lotteries" },
                        { label: t('common.competences.roller_coaster_operation'), value: "roller_coaster" },
                    ]}
                />

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
