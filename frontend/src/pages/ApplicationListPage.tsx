
import Layout from '../components/Layout';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import { useNavigate } from 'react-router-dom';

const ApplicationListPage = () => {
    const navigate = useNavigate();

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Applications</h1>
                    <Button variant="outline" onClick={() => navigate('/recruiter/dashboard')}>Back to Dashboard</Button>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row gap-4 items-end">
                            <Select
                                label="Sort by"
                                options={[
                                    { label: "Submission Date", value: "date" },
                                    { label: "Applicant Name", value: "name" },
                                    { label: "Status", value: "status" }
                                ]}
                            />
                            <Button variant="secondary">Apply Filters</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-md overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Applicant Full Name</th>
                                        <th className="px-4 py-3 font-medium">Status</th>
                                        <th className="px-4 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    <tr>
                                        <td className="px-4 py-3">John Doe</td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-800">
                                                Unhandled
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Button size="sm" variant="outline" onClick={() => navigate('/recruiter/applications/1')}>View Details</Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3">Jane Smith</td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
                                                Accepted
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Button size="sm" variant="outline" onClick={() => navigate('/recruiter/applications/2')}>View Details</Button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default ApplicationListPage;
