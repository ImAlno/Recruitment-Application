import Card, { CardHeader, CardTitle, CardContent } from './ui/Card';
import Button from './ui/Button';

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
    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            unhandled: "bg-yellow-100 text-yellow-800",
            accepted: "bg-green-100 text-green-800",
            rejected: "bg-red-100 text-red-800",
        };
        const defaultStyle = "bg-gray-100 text-gray-800";

        return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status] || defaultStyle}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const getCompetenceName = (id: number) => {
        const map: Record<number, string> = {
            1: 'Ticket Sales',
            2: 'Lotteries',
            3: 'Roller Coaster Operation'
        };
        return map[id] || 'Unknown';
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="border rounded-md overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3 font-medium">Applicant Full Name</th>
                                <th className="px-4 py-3 font-medium">Competence</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 text-right">Action</th>
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
                                            <Button size="sm" variant="outline" onClick={() => onViewDetails(app.application_id)}>View Details</Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                                        No applications found matching your criteria.
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
