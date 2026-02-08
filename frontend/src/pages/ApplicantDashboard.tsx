import Layout from '../components/Layout';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApplications } from '../hooks';
import { getStatusColor } from '../utils/applicationUtils';
import AnimatedPage from '../components/layout/AnimatedPage';
import { AnimatedList, AnimatedItem } from '../components/common/AnimatedList';

const ApplicantDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { applications, loading, error } = useApplications();

    return (
        <Layout>
            <AnimatedPage className="max-w-4xl mx-auto space-y-6">
                {/* Welcome Card */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Welcome back, {user?.firstName || 'Applicant'}</CardTitle>
                            <Button onClick={() => navigate('/applicant/apply')}>
                                Apply for Position
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600">
                            Manage your applications and track your application status here.
                        </p>
                    </CardContent>
                </Card>

                {/* Applications Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Your Applications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200" role="alert">
                                {error}
                            </div>
                        )}
                        {loading ? (
                            <div className="text-center py-8 text-gray-500">
                                Loading applications...
                            </div>
                        ) : applications.length > 0 ? (
                            <AnimatedList className="space-y-3">
                                {applications.map((app) => (
                                    <AnimatedItem key={app.id}>
                                        <div
                                            className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 transition-colors shadow-sm"
                                        >
                                            <div>
                                                <p className="font-medium text-blue-900">Application #{app.id}</p>
                                                <p className="text-sm text-gray-500">
                                                    Submitted: {new Date(app.submittedDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500">Status</p>
                                                <p className={`font-semibold ${getStatusColor(app.status)}`}>
                                                    {app.status}
                                                </p>
                                            </div>
                                        </div>
                                    </AnimatedItem>
                                ))}
                            </AnimatedList>
                        ) : (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                                <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 border border-gray-200">
                                    <svg
                                        className="w-6 h-6 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    No applications yet
                                </h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    Start your journey by applying for a position!
                                </p>
                                <Button
                                    size="sm"
                                    onClick={() => navigate('/applicant/apply')}
                                >
                                    Apply for Position
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </AnimatedPage>
        </Layout>
    );
};

export default ApplicantDashboard;
