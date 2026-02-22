import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import ApplicationList from '../components/ApplicationList';
import ApplicationFilters from '../components/ApplicationFilters';
import { useApplications } from '../hooks/useApplications';
import { useApplicationFilters } from '../hooks/useApplicationFilters';
import AnimatedPage from '../components/layout/AnimatedPage';
import { AnimatedList, AnimatedItem } from '../components/common/AnimatedList';
import { useTranslation } from 'react-i18next';

const RecruiterDashboard = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { applications, loading, error } = useApplications();

    const {
        filters,
        handleFilterChange,
        handleReset,
        filteredApplications,
        stats
    } = useApplicationFilters(applications);

    const handleViewDetails = (id: number) => {
        navigate(`/recruiter/applications/${id}`);
    };

    return (
        <Layout>
            <AnimatedPage className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 items-start">
                <aside className="sticky top-4">
                    <ApplicationFilters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onReset={handleReset}
                    />
                </aside>
                <main className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('recruiterDashboard.overview')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AnimatedList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <AnimatedItem className="p-4 bg-blue-50 rounded-lg shadow-sm border border-blue-100">
                                    <p className="text-sm text-blue-600 font-medium">{t('recruiterDashboard.unhandled')}</p>
                                    <p className="text-2xl font-bold text-blue-900">{stats.unhandled}</p>
                                </AnimatedItem>
                                <AnimatedItem className="p-4 bg-green-50 rounded-lg shadow-sm border border-green-100">
                                    <p className="text-sm text-green-600 font-medium">{t('recruiterDashboard.accepted')}</p>
                                    <p className="text-2xl font-bold text-green-900">{stats.accepted}</p>
                                </AnimatedItem>
                                <AnimatedItem className="p-4 bg-red-50 rounded-lg shadow-sm border border-red-100">
                                    <p className="text-sm text-red-600 font-medium">{t('recruiterDashboard.rejected')}</p>
                                    <p className="text-2xl font-bold text-red-900">{stats.rejected}</p>
                                </AnimatedItem>
                            </AnimatedList>
                        </CardContent>
                    </Card>

                    {loading ? (
                        <div className="text-center py-8">{t('common.loadingApplications')}</div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-500">{error.includes('.') ? t(error) : error}</div>
                    ) : (
                        <ApplicationList
                            applications={filteredApplications}
                            onViewDetails={handleViewDetails}
                        />
                    )}
                </main>
            </AnimatedPage>
        </Layout>
    );
};

export default RecruiterDashboard;
