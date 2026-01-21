
import Layout from '../components/Layout';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import { useNavigate } from 'react-router-dom';

const ApplicationDetailsPage = () => {
    const navigate = useNavigate();

    return (
        <Layout>
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Manage Application</h1>
                    <Button variant="outline" onClick={() => navigate('/recruiter/applications')}>Back to List</Button>
                </div>

                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Applicant Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-y-4 text-sm">
                            <span className="text-gray-500 font-medium">Full Name:</span> <span>John Doe</span>
                            <span className="text-gray-500 font-medium">Email:</span> <span>john.doe@example.com</span>
                            <span className="text-gray-500 font-medium">Person Number:</span> <span>19900101-1234</span>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Competence Profile</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="text-sm space-y-2">
                                <li className="flex justify-between border-b pb-2">
                                    <span>Ticket sales</span>
                                    <span className="font-medium">2 years</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Availability</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="text-sm space-y-2">
                                <li className="flex justify-between border-b pb-2">
                                    <span>2024-06-01 to 2024-08-31</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="border-blue-200 bg-blue-50/30">
                        <CardHeader>
                            <CardTitle className="text-blue-900">Status Management</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col md:flex-row items-end gap-4">
                            <Select
                                label="Update Status"
                                options={[
                                    { label: "Unhandled", value: "unhandled" },
                                    { label: "Accepted", value: "accepted" },
                                    { label: "Rejected", value: "rejected" }
                                ]}
                            />
                            <Button>Save Status</Button>
                        </CardContent>
                        <CardFooter>
                            <p className="text-xs text-blue-600 font-medium italic">
                                * View is updated in real-time. If another recruiter modifies this application, a warning will appear.
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default ApplicationDetailsPage;
