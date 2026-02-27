import Card, { CardHeader, CardTitle, CardContent } from './ui/Card';
import Button from './ui/Button';
import { useTranslation } from 'react-i18next';

/**
 * Represents a simplified application object for display in the list.
 */
interface Application {
    /** Unique identifier for the application. */
    applicationId: number;
    /** Applicant's first name. */
    firstName: string;
    /** Applicant's last name. */
    lastName: string;
    /** Current status of the application. */
    status: string;
    /** ISO date string representing when the application was submitted. */
    createdAt: string;
}

/**
 * Props for the ApplicationList component.
 */
interface ApplicationListProps {
    /** The list of applications to display. */
    applications: Application[];
    /** Callback triggered when the "View Details" button is clicked. */
    onViewDetails: (id: number) => void;
}

/**
 * Component that displays a table of job applications.
 * Features a formatted list with status badges and action buttons.
 * 
 * @param {ApplicationListProps} props - The component props.
 * @returns {JSX.Element} The rendered table.
 */
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
                                <th className="px-4 py-3 font-medium">{t('applicationList.dateApplied') || 'Date Applied'}</th>
                                <th className="px-4 py-3 font-medium">{t('common.status')}</th>
                                <th className="px-4 py-3 text-right">{t('applicationList.action')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {applications.length > 0 ? (
                                applications.map((app) => (
                                    <tr key={app.applicationId}>
                                        <td className="px-4 py-3">{app.firstName} {app.lastName}</td>
                                        <td className="px-4 py-3 text-gray-600 text-sm">{app.createdAt ? new Date(app.createdAt).toLocaleDateString() : '-'}</td>
                                        <td className="px-4 py-3">
                                            {getStatusBadge(app.status)}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Button size="sm" variant="outline" onClick={() => onViewDetails(app.applicationId)}>
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
