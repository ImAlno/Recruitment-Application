
import Layout from '../components/Layout';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const ConfirmationPage = () => {
    const navigate = useNavigate();

    return (
        <Layout>
            <div className="max-w-md mx-auto py-20">
                <Card className="text-center">
                    <CardHeader>
                        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <CardTitle>Application Submitted!</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-500">
                            Thank you for applying. We have received your application and will review it shortly.
                        </p>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                        <Button fullWidth onClick={() => navigate('/applicant/dashboard')}>Return to Dashboard</Button>
                        <Button fullWidth variant="outline" onClick={() => navigate('/login')}>Logout</Button>
                    </CardFooter>
                </Card>
            </div>
        </Layout>
    );
};

export default ConfirmationPage;
