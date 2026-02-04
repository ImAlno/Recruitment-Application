
import Layout from '../components/Layout';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const ApplicantDashboard = () => {
    const navigate = useNavigate();

    return (
        <Layout>
            <div className="grid gap-6 md:grid-cols-[240px_1fr]">
                <aside className="flex flex-col gap-2">
                    <Button variant="outline" fullWidth className="justify-start" onClick={() => navigate('/applicant/apply/competence')}>Apply for Position</Button>
                    <Button variant="outline" fullWidth className="justify-start">View Submitted Application</Button>

                </aside>
                <main className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Welcome back, Applicant Name</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-500">Your application status: <span className="font-semibold text-blue-600">Unhandled</span></p>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </Layout>
    );
};

export default ApplicantDashboard;
