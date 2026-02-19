import Layout from '../components/Layout';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AnimatedPage from '../components/layout/AnimatedPage';
import { useTranslation } from 'react-i18next';

const ApplicantDashboard = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <Layout>
            <AnimatedPage className="max-w-xl mx-auto py-12 px-4">
                <Card className="text-center shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-blue-900">
                            {t('applicantDashboard.welcome', { name: user?.firstName || t('common.applicant') })}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <p className="text-gray-600">
                            {t('applicantDashboard.description')}
                        </p>
                        <div className="pt-4">
                            <Button
                                className="w-full sm:w-auto px-8 py-3 font-semibold rounded-lg"
                                onClick={() => navigate('/applicant/apply')}
                            >
                                {t('applicantDashboard.applyButton')}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </AnimatedPage>
        </Layout>
    );
};

export default ApplicantDashboard;
