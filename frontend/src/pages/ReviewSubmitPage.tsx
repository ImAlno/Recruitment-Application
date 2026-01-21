
import Layout from '../components/Layout';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const ReviewSubmitPage = () => {
    const navigate = useNavigate();

    return (
        <Layout>
            <div className="max-w-2xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold">Review & Submit</h1>

                <div className="space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-y-2 text-sm">
                                <span className="text-gray-500">First Name:</span> <span>John</span>
                                <span className="text-gray-500">Last Name:</span> <span>Doe</span>
                                <span className="text-gray-500">Email:</span> <span>john.doe@example.com</span>
                                <span className="text-gray-500">Person Number:</span> <span>19900101-1234</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Competence Summary</CardTitle>
                            <Button size="sm" variant="outline" onClick={() => navigate('/applicant/apply/competence')}>Edit</Button>
                        </CardHeader>
                        <CardContent>
                            <ul className="text-sm space-y-1">
                                <li>Ticket sales: 2 years</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Availability Summary</CardTitle>
                            <Button size="sm" variant="outline" onClick={() => navigate('/applicant/apply/availability')}>Edit</Button>
                        </CardHeader>
                        <CardContent>
                            <ul className="text-sm space-y-1">
                                <li>2024-06-01 to 2024-08-31</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => navigate('/applicant/dashboard')}>Cancel Application</Button>
                    <Button size="lg" onClick={() => navigate('/applicant/apply/confirmation')}>Submit Application</Button>
                </div>
            </div>
        </Layout>
    );
};

export default ReviewSubmitPage;
