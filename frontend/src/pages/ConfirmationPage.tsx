import Layout from '../components/Layout';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useApplication } from '../contexts/ApplicationContext';
import { useEffect } from 'react';
import AnimatedPage from '../components/layout/AnimatedPage';
import { motion } from 'framer-motion';

const ConfirmationPage = () => {
    const navigate = useNavigate();
    const { clearApplication } = useApplication();

    // Clear the application context when the confirmation page loads
    useEffect(() => {
        clearApplication();
    }, []);

    return (
        <Layout>
            <AnimatedPage className="max-w-md mx-auto py-20">
                <Card className="text-center shadow-lg border-green-100">
                    <CardHeader>
                        <motion.div
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
                            className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
                        >
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                        </motion.div>
                        <CardTitle className="text-2xl text-green-800">Application Submitted!</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600">
                            Thank you for applying. We have received your application and will review it shortly.
                        </p>
                        <p className="text-sm text-gray-400 mt-4 italic">
                            You can check your application status from your dashboard.
                        </p>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                        <Button fullWidth size="lg" onClick={() => navigate('/applicant/dashboard')}>Return to Dashboard</Button>
                    </CardFooter>
                </Card>
            </AnimatedPage>
        </Layout>
    );
};

export default ConfirmationPage;
