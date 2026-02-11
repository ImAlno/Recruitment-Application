import React from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';
import Layout from '../components/Layout';
import Card, { CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import AnimatedPage from '../components/layout/AnimatedPage';
import { useTranslation } from 'react-i18next';

const ErrorPage = () => {
    const { t } = useTranslation();
    const error = useRouteError() as any;
    const navigate = useNavigate();

    return (
        <Layout>
            <AnimatedPage className="max-w-xl mx-auto flex items-center justify-center min-h-[60vh]">
                <Card className="w-full text-center py-8 border-red-100 bg-red-50/10">
                    <CardContent className="space-y-6">
                        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div className="space-y-2">
                            <CardTitle className="text-2xl font-bold text-red-900">{t('error.systemError')}</CardTitle>
                            <p className="text-gray-600">
                                {t('error.message')}
                            </p>
                        </div>
                        {error && (
                            <div className="bg-white p-3 rounded border border-red-100 shadow-sm inline-block">
                                <p className="text-xs font-mono text-red-500">
                                    {t('error.errorCode')} {error.statusText || error.message}
                                </p>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="justify-center gap-4">
                        <Button variant="outline" onClick={() => navigate(-1)}>
                            {t('error.back')}
                        </Button>
                        <Button onClick={() => window.location.reload()}>
                            {t('error.retry')}
                        </Button>
                    </CardFooter>
                </Card>
            </AnimatedPage>
        </Layout>
    );
};

export default ErrorPage;
