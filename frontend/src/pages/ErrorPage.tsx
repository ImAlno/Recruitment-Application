
import Layout from '../components/Layout';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
    const navigate = useNavigate();

    return (
        <Layout>
            <div className="max-w-md mx-auto py-20 text-center">
                <Card className="border-red-200">
                    <CardHeader>
                        <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <CardTitle className="text-red-900">System Error</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-gray-600">
                            Something went wrong. The application encountered an unexpected error.
                        </p>
                        <p className="text-sm font-mono bg-gray-100 p-2 rounded text-red-700">
                            Error code: 500_INTERNAL_SERVER_ERROR
                        </p>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                        <Button fullWidth variant="danger">Retry</Button>
                        <Button fullWidth variant="outline" onClick={() => navigate(-1)}>Back to Previous Page</Button>
                    </CardFooter>
                </Card>
            </div>
        </Layout>
    );
};

export default ErrorPage;
