import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';

const ProfilePage: React.FC = () => {
    const { user } = useAuth();

    if (!user) {
        return null;
    }

    return (
        <Layout>
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>My Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">Username</label>
                                <p className="text-lg font-medium">{user.username}</p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">First Name</label>
                                <p className="text-lg font-medium">{user.firstName}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">Last Name</label>
                                <p className="text-lg font-medium">{user.lastName}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">Email</label>
                                <p className="text-lg font-medium">{user.email}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">Person Number</label>
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
