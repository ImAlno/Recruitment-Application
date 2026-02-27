import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Card, { CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';
import AnimatedPage from '../components/layout/AnimatedPage';
import { useTranslation } from 'react-i18next';

/**
 * Simple confirmation page displayed after a successful application submission.
 * Includes a success animation and a link back to the dashboard.
 * 
 * @returns {JSX.Element} The rendered confirmation page.
 */
const ConfirmationPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <Layout>
            <AnimatedPage className="max-w-xl mx-auto flex items-center justify-center min-h-[60vh]">
                <Card className="w-full text-center py-8">
                    <CardContent className="space-y-6">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20
                            }}
                            className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
                        >
                            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                        </motion.div>

                        <div className="space-y-2">
                            <CardTitle className="text-3xl font-bold text-gray-900">{t('confirmation.title')}</CardTitle>
                            <p className="text-lg text-gray-600 italic">
                                "{t('confirmation.message')}"
                            </p>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <p className="text-sm text-blue-800">
                                {t('confirmation.statusCheck')}
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter className="justify-center pt-8">
                        <Button
                            size="lg"
                            className="px-8 shadow-md hover:shadow-lg transition-shadow"
                            onClick={() => navigate('/applicant/dashboard')}
                        >
                            {t('confirmation.returnDashboard')}
                        </Button>
                    </CardFooter>
                </Card>
            </AnimatedPage>
        </Layout>
    );
};

export default ConfirmationPage;
