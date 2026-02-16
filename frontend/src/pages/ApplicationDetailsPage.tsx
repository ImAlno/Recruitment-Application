import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import { useApplicationDetails } from '../hooks/useApplicationDetails';
import { getCompetenceLabel } from '../utils/applicationUtils';
import AnimatedPage from '../components/layout/AnimatedPage';
import { AnimatedList, AnimatedItem } from '../components/common/AnimatedList';
import { useTranslation } from 'react-i18next';
import Toast from '../components/ui/Toast';

const ApplicationDetailsPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const {
        application,
        status,
        isSaving,
        successMessage,
        errorMessage,
        loading: appsLoading,
        handleStatusChange,
        handleSaveStatus,
        clearMessages
    } = useApplicationDetails(id);

    if (appsLoading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-64">
                    <p className="text-gray-500">{t('applicationDetails.loading') || t('common.loading')}</p>
                </div>
            </Layout>
        );
    }

    if (!application) {
        return (
            <Layout>
                <AnimatedPage className="max-w-3xl mx-auto space-y-6">
                    <div className="flex items-center justify-between">
                        <Button variant="outline" onClick={() => navigate('/recruiter/dashboard')}>{t('applicationDetails.backToList')}</Button>
                    </div>
                    <Card>
                        <CardContent className="p-8 text-center">
                            <h2 className="text-xl font-bold text-gray-700">{t('applicationDetails.notFound')}</h2>
                            <p className="text-gray-500 mt-2">{t('applicationDetails.notFoundDesc')}</p>
                        </CardContent>
                    </Card>
                </AnimatedPage>
            </Layout>
        );
    }

    return (
        <Layout>
            <AnimatedPage className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-blue-900">{t('applicationDetails.title')}</h1>
                    <Button variant="outline" onClick={() => navigate('/recruiter/dashboard')}>{t('applicationDetails.backToList')}</Button>
                </div>

                <AnimatedList className="grid gap-6">
                    <AnimatedItem>
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('applicationDetails.applicantInfo')}</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-y-4 text-sm">
                                <span className="text-gray-500 font-medium">{t('apply.fullName') || t('applicationList.fullName')}:</span> <span>{application.first_name} {application.last_name}</span>
                                <span className="text-gray-500 font-medium">{t('apply.email')}:</span> <span>{application.first_name.toLowerCase()}.{application.last_name.toLowerCase()}@example.com <span className="text-xs text-gray-400">{t('applicationDetails.generated')}</span></span>
                                <span className="text-gray-500 font-medium">{t('apply.personNumber')}:</span> <span>19900101-1234 <span className="text-xs text-gray-400">{t('applicationDetails.mock')}</span></span>
                                <span className="text-gray-500 font-medium">{t('applicationDetails.applied')}:</span> <span>{new Date(application.created_at).toLocaleDateString()}</span>
                            </CardContent>
                        </Card>
                    </AnimatedItem>

                    <AnimatedItem>
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('apply.competenceProfile')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="text-sm space-y-2">
                                    {application.competence_profile && application.competence_profile.length > 0 ? (
                                        application.competence_profile.map((c: any, index: number) => (
                                            <li key={index} className="flex justify-between border-b pb-2 last:border-0 hover:bg-gray-50 rounded px-1 transition-colors">
                                                <span>{t(`common.competences.${getCompetenceLabel(c.competence_id).toLowerCase().replace(/ /g, '_')}`, { defaultValue: getCompetenceLabel(c.competence_id) })}</span>
                                                <span className="font-medium text-blue-700">{c.years_of_experience} {t('apply.yearsAbbr')}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-gray-500 italic">{t('applicationDetails.noCompetenceProvided')}</li>
                                    )}
                                </ul>
                                {errorMessage && (
                                    <div className="mb-6 p-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200">
                                        {errorMessage.includes('.') ? t(errorMessage) : errorMessage}
                                    </div>
                                )}</CardContent>
                        </Card>
                    </AnimatedItem>

                    <AnimatedItem>
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('apply.availability')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="text-sm space-y-2">
                                    <li className="flex justify-between border-b pb-2">
                                        <span>2024-06-01 {t('apply.to')} 2024-08-31</span>
                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">{t('apply.available')}</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </AnimatedItem>

                    <AnimatedItem>
                        <Card className="border-blue-200 bg-blue-50/30">
                            <CardHeader>
                                <CardTitle className="text-blue-900">{t('applicationDetails.statusManagement')}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col md:flex-row items-end gap-4">
                                <Select
                                    label={t('applicationDetails.updateStatus')}
                                    value={status}
                                    onChange={handleStatusChange}
                                    options={[
                                        { label: t('common.statuses.unhandled'), value: "unhandled" },
                                        { label: t('common.statuses.accepted'), value: "accepted" },
                                        { label: t('common.statuses.rejected'), value: "rejected" }
                                    ]}
                                />
                                <Button onClick={handleSaveStatus} disabled={isSaving}>
                                    {isSaving ? t('applicationDetails.saving') : t('applicationDetails.saveStatus')}
                                </Button>
                            </CardContent>
                            <CardFooter>
                                <p className="text-xs text-blue-600 font-medium italic">
                                    {t('applicationDetails.realtimeNotice')}
                                </p>
                            </CardFooter>
                        </Card>
                    </AnimatedItem>
                </AnimatedList>
            </AnimatedPage>

            {successMessage && (
                <Toast
                    message={
                        successMessage.startsWith('errors.statusUpdated:')
                            ? t('errors.statusUpdated', {
                                status: t(`common.statuses.${successMessage.split(':')[1]}`)
                            })
                            : (successMessage.includes('.') ? t(successMessage) : successMessage)
                    }
                    type="success"
                    onClose={clearMessages}
                />
            )}
            {errorMessage && (
                <Toast
                    message={errorMessage.includes('.') ? t(errorMessage) : errorMessage}
                    type="error"
                    onClose={clearMessages}
                />
            )}
        </Layout>
    );
};

export default ApplicationDetailsPage;
