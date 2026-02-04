
import Layout from '../components/Layout';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const RecruiterDashboard = () => {
    const navigate = useNavigate();

    return (
        <Layout>
            <div className="grid gap-6 md:grid-cols-[240px_1fr]">
                <aside className="flex flex-col gap-2">
                    <Button variant="outline" fullWidth className="justify-start" onClick={() => navigate('/recruiter/applications')}>List Applications</Button>

                </aside>
                <main className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Welcome back, Recruiter Name</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-600 font-medium">Unhandled Applications</p>
                                    <p className="text-2xl font-bold">12</p>
                                </div>
                                <div className="p-4 bg-green-50 rounded-lg">
                                    <p className="text-sm text-green-600 font-medium">Accepted</p>
                                    <p className="text-2xl font-bold">45</p>
                                </div>
                                <div className="p-4 bg-red-50 rounded-lg">
                                    <p className="text-sm text-red-600 font-medium">Rejected</p>
                                    <p className="text-2xl font-bold">8</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </Layout>
    );
};

export default RecruiterDashboard;
