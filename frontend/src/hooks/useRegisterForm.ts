import { useState } from 'react';
import { registerApplicant } from '../services/authService';
import { validateEmail, getPasswordErrors, formatPasswordErrorMessage, validateUsername } from '../utils/validation';
import { formatPersonNumber } from '../utils/formatters';
import { useAvailability } from './useAvailability';

export const useRegisterForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        personNumber: '',
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [success, setSuccess] = useState<string | null>(null);

    const {
        isCheckingUsername,
        isCheckingEmail,
        setIsCheckingUsername,
        setIsCheckingEmail,
        checkedValues
    } = useAvailability({ formData, setErrors });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name } = e.target;
        let { value } = e.target;

        if (name === 'personNumber') {
            value = formatPersonNumber(value);
        }

        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error and set loading when user types
        if (name === 'username' || name === 'email') {
            if (name === 'username') {
                const { isValid, error } = validateUsername(value);
                if (!isValid && error === 'Username contains invalid characters') {
                    setErrors(prev => ({ ...prev, username: error }));
                    setIsCheckingUsername(false);
                } else {
                    setIsCheckingUsername(true);
                    if (errors.username) {
                        setErrors(prev => {
                            const newErrors = { ...prev };
                            delete newErrors.username;
                            return newErrors;
                        });
                    }
                }
            }
            if (name === 'email') {
                if (validateEmail(value)) setIsCheckingEmail(true);
                else setIsCheckingEmail(false);

                if (errors.email) {
                    setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.email;
                        return newErrors;
                    });
                }
            }
        } else if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }

        // Clear global errors on any change
        if (errors.submit) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.submit;
                return newErrors;
            });
        }
    };

    const validate = (): Record<string, string> => {
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

        if (!formData.username) {
            newErrors.username = 'Username is required';
        } else {
            const { isValid, error } = validateUsername(formData.username);
            if (!isValid) {
                newErrors.username = error || 'Invalid username';
            }
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else {
            const passwordReqs = getPasswordErrors(formData.password);
            if (passwordReqs.length > 0) {
                newErrors.password = formatPasswordErrorMessage(passwordReqs);
            }
        }

        setErrors(prev => {
            const fieldsToClear = ['firstName', 'lastName', 'email', 'personNumber', 'username', 'password'];
            const updated = { ...prev };

            fieldsToClear.forEach(field => {
                if (newErrors[field]) {
                    updated[field] = newErrors[field];
                } else {
                    const current = prev[field];
                    const isAsyncError = current?.includes('already exists');
                    if (!isAsyncError) {
                        delete updated[field];
                    }
                }
            });

            return updated;
        });

        return newErrors;
    };

    const clearErrors = (key?: string) => {
        if (key) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[key];
                return newErrors;
            });
        } else {
            setErrors({});
        }
    };

    const handleSubmit = async () => {
        const formatErrors = validate();
        const hasFormatErrors = Object.keys(formatErrors).length > 0;
        const hasAsyncErrors = errors.username?.includes('exists') || errors.email?.includes('exists');

        if (hasFormatErrors || hasAsyncErrors) return;

        setIsSubmitting(true);
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.submit;
            return newErrors;
        });

        try {
            await registerApplicant(formData);
            setSuccess('Account created successfully! You can now login.');
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                submit: error instanceof Error ? error.message : 'Registration failed. Please try again.'
            }));
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        errors,
        isSubmitting,
        isCheckingUsername,
        isCheckingEmail,
        checkedValues,
        handleChange,
        handleSubmit,
        setErrors,
        showPassword,
        setShowPassword,
        success,
        clearErrors,
    };
};
