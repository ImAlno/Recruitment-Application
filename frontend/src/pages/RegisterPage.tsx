import Layout from '../components/Layout';
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import RequirementChecklist from '../components/ui/RequirementChecklist';
import { Eye, EyeOff } from '../components/ui/Icons';
import { passwordRequirements, usernameRequirements, validateEmail } from '../utils/validation';
import { useRegisterForm } from '../hooks/useRegisterForm';

const RegisterPage = () => {
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
        setShowPassword
    } = useRegisterForm();

    return (
        <Layout>
            <div className="max-w-md mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Create Account</CardTitle>
                        <CardDescription>Enter your details to register as an applicant.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {errors.submit && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
                                {errors.submit}
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="First Name"
                                name="firstName"
                                placeholder="Anita"
                                value={formData.firstName}
                                onChange={handleChange}
                                error={errors.firstName}
                            />
                            <Input
                                label="Last Name"
                                name="lastName"
                                placeholder="Drink"
                                value={formData.lastName}
                                onChange={handleChange}
                                error={errors.lastName}
                            />
                        </div>
                        <div className="relative">
                            <Input
                                label="Email Address"
                                name="email"
                                type="email"
                                placeholder="anita.drink@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                            />
                            {isCheckingEmail && formData.email && !errors.email && (
                                <div className="absolute right-3 top-[38px] text-[10px] text-blue-500 animate-pulse">Checking...</div>
                            )}
                            {!isCheckingEmail && formData.email && checkedValues.email === formData.email && !errors.email && validateEmail(formData.email) && (
                                <div className="absolute right-3 top-[38px] text-green-500 font-bold" title="Email is available">✓</div>
                            )}
                        </div>
                        <Input
                            label="Person Number"
                            name="personNumber"
                            placeholder="YYYYMMDD-XXXX"
                            value={formData.personNumber}
                            onChange={handleChange}
                            error={errors.personNumber}
                        />
                        <div className="relative">
                            <Input
                                label="Username"
                                name="username"
                                placeholder="anitadrink"
                                value={formData.username}
                                onChange={handleChange}
                                error={errors.username}
                            />
                            {isCheckingUsername && formData.username && !errors.username && (
                                <div className="absolute right-3 top-[38px] text-[10px] text-blue-500 animate-pulse">Checking...</div>
                            )}
                            {!isCheckingUsername && formData.username && checkedValues.username === formData.username && !errors.username && formData.username.length > 0 && (
                                <div className="absolute right-3 top-[38px] text-green-500 font-bold" title="Username is available">✓</div>
                            )}
                            <RequirementChecklist
                                title="Username requirements"
                                value={formData.username}
                                requirements={usernameRequirements}
                            />
                        </div>
                        <div className="space-y-1">
                            <Input
                                label="Password"
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
                                        title={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                }
                            />
                            <RequirementChecklist
                                title="Password requirements"
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
                            {isSubmitting ? 'Creating...' : 'Create Account'}
                        </Button>
                        <Link to="/" className="text-sm text-blue-600 hover:underline text-center">Cancel / Back to Landing</Link>
                    </CardFooter>
                </Card>
            </div>
        </Layout>
    );
};

export default RegisterPage;
