import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { useTranslation } from 'react-i18next';

const ProfilePage: React.FC = () => {
    const { t } = useTranslation();
    const { user } = useAuth();

    if (!user) {
        return null;
    }

    return (
        <Layout>
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('profile.title')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">{t('profile.username')}</label>
                                <p className="text-lg font-medium">{user.username}</p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">{t('profile.firstName')}</label>
                                <p className="text-lg font-medium">{user.firstName}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">{t('profile.lastName')}</label>
                                <p className="text-lg font-medium">{user.lastName}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">{t('profile.email')}</label>
                                <p className="text-lg font-medium">{user.email}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">{t('profile.personNumber')}</label>
                                <p className="text-lg font-medium">{user.personNumber}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default ProfilePage;
