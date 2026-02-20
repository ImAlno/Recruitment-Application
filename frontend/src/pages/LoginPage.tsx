import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import AnimatedPage from '../components/layout/AnimatedPage';
import { useTranslation } from 'react-i18next';
import { useLoginForm } from '../hooks';

const LoginPage = () => {
    const { t } = useTranslation();
    const {
        username,
        setUsername,
        password,
        setPassword,
        error,
        isLoading,
        handleSubmit
    } = useLoginForm();

    return (
        <Layout>
            <AnimatedPage className="max-w-md mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('common.login')}</CardTitle>
                        <CardDescription>{t('login.description')}</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            {error && (
                                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                                    {error.includes('.') ? t(error) : error}
                                </div>
                            )}
                            <Input
                                label={t('login.username')}
                                placeholder="johndoe"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <Input
                                label={t('login.password')}
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button fullWidth type="submit" disabled={isLoading}>
                                {isLoading ? t('login.loggingIn') : t('common.login')}
                            </Button>
                            <Link to="/" className="text-sm text-blue-600 hover:underline text-center">{t('common.backToLanding') || 'Back to Landing'}</Link>
                        </CardFooter>
                    </form>
                </Card>
            </AnimatedPage>
        </Layout>
    );
};

export default LoginPage;
