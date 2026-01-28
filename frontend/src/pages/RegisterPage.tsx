import React, { useState } from 'react';
import Layout from '../components/Layout';
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { registerApplicant, checkUsernameAvailability } from '../services/authService';
import { validateEmail, getPasswordErrors, formatPasswordErrorMessage } from '../utils/validation';
import { formatPersonNumber } from '../utils/formatters';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        personNumber: '',
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Person number formatting
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let { name, value } = e.target;

        if (name === 'personNumber') {
            value = formatPersonNumber(value);
        }

        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    // Validation of input fields
    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.email) {
            newErrors.email = 'Email address is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.personNumber) {
            newErrors.personNumber = 'Person number is required';
        }

        if (!formData.username) newErrors.username = 'Username is required';

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else {
            const passwordReqs = getPasswordErrors(formData.password);
            if (passwordReqs.length > 0) {
                newErrors.password = formatPasswordErrorMessage(passwordReqs);
            }
        }

        if (formData.password !== formData.confirmPassword) {
            const mismatchError = 'Passwords do not match';
            newErrors.password = newErrors.password ? `${newErrors.password}. ${mismatchError}` : mismatchError;
            newErrors.confirmPassword = mismatchError;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Submit handler
    const handleSubmit = async () => {
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            // Check username availability
            const isAvailable = await checkUsernameAvailability(formData.username);
            if (!isAvailable) {
                setErrors(prev => ({ ...prev, username: 'Username already exists' }));
                setIsSubmitting(false);
                return;
            }

            // Sends the password, not the confirmPassword
            const { confirmPassword, ...registerData } = formData;
            await registerApplicant(registerData);
            // On success, redirect to landing page (currently)
            navigate('/');
        } catch (error) {
            setErrors({ submit: 'Failed to register. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

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
                                placeholder="John"
                                value={formData.firstName}
                                onChange={handleChange}
                                error={errors.firstName}
                            />
                            <Input
                                label="Last Name"
                                name="lastName"
                                placeholder="Doe"
                                value={formData.lastName}
                                onChange={handleChange}
                                error={errors.lastName}
                            />
                        </div>
                        <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            placeholder="john.doe@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                        />
                        <Input
                            label="Person Number"
                            name="personNumber"
                            placeholder="YYYYMMDD-XXXX"
                            value={formData.personNumber}
                            onChange={handleChange}
                            error={errors.personNumber}
                        />
                        <Input
                            label="Username"
                            name="username"
                            placeholder="johndoe"
                            value={formData.username}
                            onChange={handleChange}
                            error={errors.username}
                        />
                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                        />
                        <Input
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={errors.confirmPassword}
                        />
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button
                            fullWidth
                            onClick={handleSubmit}
                            disabled={isSubmitting}
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
