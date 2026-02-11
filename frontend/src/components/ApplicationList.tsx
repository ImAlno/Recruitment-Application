import Card, { CardHeader, CardTitle, CardContent } from './ui/Card';
import Button from './ui/Button';
import { useTranslation } from 'react-i18next';

interface Application {
    application_id: number;
    first_name: string;
    last_name: string;
    status: string;
    competence_profile: any[];
    created_at: string;
}

interface ApplicationListProps {
    applications: Application[];
    onViewDetails: (id: number) => void;
}

const ApplicationList = ({ applications, onViewDetails }: ApplicationListProps) => {
    const { t } = useTranslation();

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            unhandled: "bg-yellow-100 text-yellow-800",
            accepted: "bg-green-100 text-green-800",
            rejected: "bg-red-100 text-red-800",
        };
        const defaultStyle = "bg-gray-100 text-gray-800";

        return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status] || defaultStyle}`}>
                {t(`common.statuses.${status.toLowerCase()}`, { defaultValue: status.charAt(0).toUpperCase() + status.slice(1) })}
            </span>
        );
    };

    const getCompetenceName = (id: number) => {
        const map: Record<number, string> = {
            1: t('common.competences.ticket_sales'),
            2: t('common.competences.lotteries'),
            3: t('common.competences.roller_coaster')
        };
        return map[id] || t('common.competences.unknown');
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('applicationList.title')}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="border rounded-md overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3 font-medium">{t('applicationList.fullName')}</th>
                                <th className="px-4 py-3 font-medium">{t('applicationList.competence')}</th>
                                <th className="px-4 py-3 font-medium">{t('common.status')}</th>
                                <th className="px-4 py-3 text-right">{t('applicationList.action')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {applications.length > 0 ? (
                                applications.map((app) => (
                                    <tr key={app.application_id}>
                                        <td className="px-4 py-3">{app.first_name} {app.last_name}</td>
                                        <td className="px-4 py-3">
                                            {app.competence_profile?.map((c: any) => (
                                                <div key={c.competence_id} className="text-xs text-gray-600">
                                                    {getCompetenceName(c.competence_id)}
                                                </div>
                                            )) || <span className="text-gray-400">-</span>}
                                        </td>
                                        <td className="px-4 py-3">
                                            {getStatusBadge(app.status)}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Button size="sm" variant="outline" onClick={() => onViewDetails(app.application_id)}>
                                                {t('applicationList.viewDetails')}
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                                        {t('applicationList.noResults')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};

export default ApplicationList;
