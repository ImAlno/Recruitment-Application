import Layout from '../components/Layout';
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import RequirementChecklist from '../components/ui/RequirementChecklist';
import { Eye, EyeOff } from '../components/ui/Icons';
import { passwordRequirements, usernameRequirements, validateEmail } from '../utils/validation';
import { useRegisterForm } from '../hooks/useRegisterForm';
import Toast from '../components/ui/Toast';
import { Check } from '../components/ui/Check';
import AnimatedPage from '../components/layout/AnimatedPage';
import { useTranslation } from 'react-i18next';

const RegisterPage = () => {
    const { t } = useTranslation();
    const {
        formData,
        errors,
        isSubmitting,
        isCheckingUsername,
        isCheckingEmail,
        checkedValues,
        handleChange,
        handleSubmit,
        showPassword,
        setShowPassword,
        success,
        clearErrors
    } = useRegisterForm();

    return (
        <Layout>
            <AnimatedPage className="max-w-md mx-auto">
                <Card>
                    <CardHeader>
                        {!success ? (
                            <>
                                <CardTitle>{t('register.title')}</CardTitle>
                                <CardDescription>{t('register.description')}</CardDescription>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 animate-in fade-in zoom-in-95 duration-500">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                                    <Check size={32} className="animate-in zoom-in spin-in-12 duration-700" />
                                </div>
                                <CardTitle className="text-center text-2xl text-green-700 mb-2">{t('register.successTitle')}</CardTitle>
                                <CardDescription className="text-center text-gray-600">
                                    {t('register.successDescription')}
                                    <br />
                                    {t('register.clickToLogin')}
                                </CardDescription>
                                <div className="mt-8 w-full max-w-xs">
                                    <Link to="/login">
                                        <Button fullWidth variant="primary">
                                            {t('register.goToLogin')}
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </CardHeader>
                    {!success && (
                        <>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label={t('register.firstName')}
                                        name="firstName"
                                        placeholder="Anita"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        error={errors.firstName}
                                    />
                                    <Input
                                        label={t('register.lastName')}
                                        name="lastName"
                                        placeholder="Drink"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        error={errors.lastName}
                                    />
                                </div>
                                <div className="relative">
                                    <Input
                                        label={t('register.email')}
                                        name="email"
                                        type="email"
                                        placeholder="anita.drink@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        error={errors.email}
                                    />
                                    {isCheckingEmail && formData.email && !errors.email && (
                                        <div className="absolute right-3 top-[38px] text-[10px] text-blue-500 animate-pulse">{t('common.checking')}</div>
                                    )}
                                    {!isCheckingEmail && formData.email && checkedValues.email === formData.email && !errors.email && validateEmail(formData.email) && (
                                        <div className="absolute right-3 top-[38px] text-green-500 font-bold" title={t('register.emailAvailable') || 'Email Available'}>✓</div>
                                    )}
                                </div>
                                <Input
                                    label={t('register.personNumber')}
                                    name="personNumber"
                                    placeholder="YYYYMMDD-XXXX"
                                    value={formData.personNumber}
                                    onChange={handleChange}
                                    error={errors.personNumber}
                                />
                                <div className="relative">
                                    <Input
                                        label={t('register.username')}
                                        name="username"
                                        placeholder="anitadrink"
                                        value={formData.username}
                                        onChange={handleChange}
                                        error={errors.username}
                                    />
                                    {isCheckingUsername && formData.username && !errors.username && (
                                        <div className="absolute right-3 top-[38px] text-[10px] text-blue-500 animate-pulse">{t('common.checking')}</div>
                                    )}
                                    {!isCheckingUsername && formData.username && checkedValues.username === formData.username && !errors.username && formData.username.length > 0 && (
                                        <div className="absolute right-3 top-[38px] text-green-500 font-bold" title={t('register.usernameAvailable') || 'Username Available'}>✓</div>
                                    )}
                                    <RequirementChecklist
                                        title={t('register.usernameRequirements')}
                                        value={formData.username}
                                        requirements={usernameRequirements}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Input
                                        label={t('register.password')}
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        error={errors.password}
                                        rightElement={
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-blue-600 transition-colors p-1"
                                                title={showPassword ? t('register.hidePassword') : t('register.showPassword')}
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        }
                                    />
                                    <RequirementChecklist
                                        title={t('register.passwordRequirements')}
                                        value={formData.password}
                                        requirements={passwordRequirements}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-4">
                                <Button
                                    fullWidth
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || isCheckingUsername || isCheckingEmail}
                                >
                                    {isSubmitting ? t('register.creating') : t('register.createAccount')}
                                </Button>
                                <Link to="/" className="text-sm text-blue-600 hover:underline text-center">{t('register.cancelBack') || 'Cancel / Back to Home'}</Link>
                            </CardFooter>
                        </>
                    )}
                </Card>
            </AnimatedPage>

            {/* Error Toast */}
            {errors.submit && (
                <Toast
                    message={errors.submit}
                    type="error"
                    onClose={() => clearErrors('submit')}
                />
            )}
        </Layout>
    );
};

export default RegisterPage;
