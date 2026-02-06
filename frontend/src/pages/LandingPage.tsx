
import Layout from '../components/Layout';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LandingPage = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    return (
        <Layout>
            <div className="flex flex-col items-center justify-center space-y-8 text-center py-20">
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                        Welcome to RecruitApp
                    </h1>
                    <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                        Discover your next career opportunity with our seamless recruitment process.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    {!isAuthenticated ? (
                        <>
                            <Button size="lg" onClick={() => navigate('/register')}>Create Account</Button>
                            <Button size="lg" variant="outline" onClick={() => navigate('/login')}>Login</Button>
                        </>
                    ) : (
                        <Button
                            size="lg"
                            onClick={() => navigate(user?.role === 'recruiter' ? '/recruiter/dashboard' : '/applicant/dashboard')}
                        >
                            Go to Dashboard
                        </Button>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default LandingPage;
