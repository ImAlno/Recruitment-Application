
import Layout from '../components/Layout';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useRandomSubheader } from '../hooks';
import AnimatedPage from '../components/layout/AnimatedPage';
import { motion } from 'framer-motion';
import rogerImage from '../assets/roger.png';
import { useTranslation } from 'react-i18next';

/**
 * Public landing page for the application.
 * Features a hero section with animated headings, a randomized subheader, 
 * and call-to-action buttons for registration or login.
 * 
 * @returns {JSX.Element} The rendered landing page.
 */
const LandingPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const subheader = useRandomSubheader();

    return (
        <Layout>
            <AnimatedPage>
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 py-12 md:py-24">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="flex-1 text-center lg:text-left space-y-8"
                    >
                        <div className="space-y-4">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-blue-900 leading-tight"
                            >
                                {t('landing.title')} <br />
                                <span className="text-blue-600">{t('landing.highlight')}</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="max-w-[600px] text-gray-500 md:text-xl mx-auto lg:mx-0 min-h-[3.5em]"
                            >
                                {subheader}
                            </motion.p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                        >
                            {!isAuthenticated ? (
                                <>
                                    <Button size="lg" className="px-8" onClick={() => navigate('/register')}>{t('landing.getStarted')}</Button>
                                    <Button size="lg" variant="outline" className="px-8" onClick={() => navigate('/login')}>{t('common.login')}</Button>
                                </>
                            ) : (
                                <Button
                                    size="lg"
                                    className="px-8"
                                    onClick={() => navigate(user?.role === 'recruiter' ? '/recruiter/dashboard' : '/applicant/dashboard')}
                                >
                                    {t('landing.viewDashboard')}
                                </Button>
                            )}
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{
                            duration: 0.8,
                            delay: 0.2,
                            ease: [0, 0.71, 0.2, 1.01]
                        }}
                        className="flex-1 relative"
                    >
                        <div className="absolute inset-0 bg-blue-400/10 rounded-full blur-3xl" />
                        <img
                            src={rogerImage}
                            alt="Roger"
                            className="relative z-10 w-full max-w-[500px] mx-auto drop-shadow-2xl"
                        />
                    </motion.div>
                </div>
            </AnimatedPage>
        </Layout >
    );
};

export default LandingPage;
