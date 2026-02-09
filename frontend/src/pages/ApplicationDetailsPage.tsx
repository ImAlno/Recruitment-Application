import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import { useApplicationDetails } from '../hooks/useApplicationDetails';
import { getCompetenceLabel } from '../utils/applicationUtils';
import AnimatedPage from '../components/layout/AnimatedPage';
import { AnimatedList, AnimatedItem } from '../components/common/AnimatedList';

const ApplicationDetailsPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const {
        application,
        status,
        isSaving,
        loading: appsLoading,
        handleStatusChange,
        handleSaveStatus
    } = useApplicationDetails(id);



    if (appsLoading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-64">
                    <p className="text-gray-500">Loading application details...</p>
                </div>
            </Layout>
        );
    }

    if (!application) {
        return (
            <Layout>
                <AnimatedPage className="max-w-3xl mx-auto space-y-6">
                    <div className="flex items-center justify-between">
                        <Button variant="outline" onClick={() => navigate('/recruiter/dashboard')}>Back to List</Button>
                    </div>
                    <Card>
                        <CardContent className="p-8 text-center">
                            <h2 className="text-xl font-bold text-gray-700">Application not found</h2>
                            <p className="text-gray-500 mt-2">The application you are looking for does not exist or has been removed.</p>
                        </CardContent>
                    </Card>
                </AnimatedPage>
            </Layout>
        );
    }

    return (
        <Layout>
            <AnimatedPage className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-blue-900">Manage Application</h1>
                    <Button variant="outline" onClick={() => navigate('/recruiter/dashboard')}>Back to List</Button>
                </div>

                <AnimatedList className="grid gap-6">
                    <AnimatedItem>
                        <Card>
                            <CardHeader>
                                <CardTitle>Applicant Information</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-y-4 text-sm">
                                <span className="text-gray-500 font-medium">Full Name:</span> <span>{application.first_name} {application.last_name}</span>
                                <span className="text-gray-500 font-medium">Email:</span> <span>{application.first_name.toLowerCase()}.{application.last_name.toLowerCase()}@example.com <span className="text-xs text-gray-400">(generated)</span></span>
                                <span className="text-gray-500 font-medium">Person Number:</span> <span>19900101-1234 <span className="text-xs text-gray-400">(mock)</span></span>
                                <span className="text-gray-500 font-medium">Applied:</span> <span>{new Date(application.created_at).toLocaleDateString()}</span>
                            </CardContent>
                        </Card>
                    </AnimatedItem>

                    <AnimatedItem>
                        <Card>
                            <CardHeader>
                                <CardTitle>Competence Profile</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="text-sm space-y-2">
                                    {application.competence_profile && application.competence_profile.length > 0 ? (
                                        application.competence_profile.map((c: any, index: number) => (
                                            <li key={index} className="flex justify-between border-b pb-2 last:border-0 hover:bg-gray-50 rounded px-1 transition-colors">
                                                <span>{getCompetenceLabel(c.competence_id)}</span>
                                                <span className="font-medium text-blue-700">{c.years_of_experience} years</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-gray-500 italic">No competence profile provided.</li>
                                    )}
                                </ul>
                            </CardContent>
                        </Card>
                    </AnimatedItem>

                    <AnimatedItem>
                        <Card>
                            <CardHeader>
                                <CardTitle>Availability</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="text-sm space-y-2">
                                    {/* Mock availability data since it's not in the main list hook yet */}
                                    <li className="flex justify-between border-b pb-2">
                                        <span>2024-06-01 to 2024-08-31</span>
                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Available</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </AnimatedItem>

                    <AnimatedItem>
                        <Card className="border-blue-200 bg-blue-50/30">
                            <CardHeader>
                                <CardTitle className="text-blue-900">Status Management</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col md:flex-row items-end gap-4">
                                <Select
                                    label="Update Status"
                                    value={status}
                                    onChange={handleStatusChange}
                                    options={[
                                        { label: "Unhandled", value: "unhandled" },
                                        { label: "Accepted", value: "accepted" },
                                        { label: "Rejected", value: "rejected" }
                                    ]}
                                />
                                <Button onClick={handleSaveStatus} disabled={isSaving}>
                                    {isSaving ? 'Saving...' : 'Save Status'}
                                </Button>
                            </CardContent>
                            <CardFooter>
                                <p className="text-xs text-blue-600 font-medium italic">
                                    * View is updated in real-time.
                                </p>
                            </CardFooter>
                        </Card>
                    </AnimatedItem>
                </AnimatedList>
            </AnimatedPage>
        </Layout>
    );
};

export default ApplicationDetailsPage;
