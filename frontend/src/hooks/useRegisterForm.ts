import { useState } from 'react';
import { registerApplicant } from '../services/authService';
import { validateEmail, getPasswordErrors, validateUsername } from '../utils/validation';
import { formatPersonNumber } from '../utils/formatters';
import { useAvailability } from './useAvailability';
import { useTranslation } from 'react-i18next';

/**
 * Custom hook for managing the registration form state, validation, and submission.
 * Handles complex multi-field state, real-time availability checks (via useAvailability),
 * formatting (person number), and error mapping.
 * 
 * @returns {Object} An object containing form state, validation state, and handlers.
 * @property {Object} formData - The current values of all registration fields.
 * @property {Record<string, string>} errors - Map of field names to error message keys or raw messages.
 * @property {boolean} isSubmitting - True if the registration request is currently in progress.
 * @property {boolean} isCheckingUsername - True if an asynchronous username availability check is running.
 * @property {boolean} isCheckingEmail - True if an asynchronous email availability check is running.
 * @property {Object} checkedValues - Cache of previously checked values to avoid redundant API calls.
 * @property {Function} handleChange - Event handler for updating form fields with validation and formatting logic.
 * @property {Function} handleSubmit - Asynchronous handler that validates the entire form and performs registration.
 * @property {Function} setErrors - Direct state setter for the errors object.
 * @property {boolean} showPassword - True if the password should be visible in the UI.
 * @property {Function} setShowPassword - State setter for password visibility.
 * @property {string | null} success - Success message key or raw message if registration was successful.
 * @property {Function} clearErrors - Utility to clear a specific error or all errors.
 */
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

    const { t } = useTranslation();
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
                if (!isValid && error === 'validation.usernameChars') {
                    setErrors(prev => ({ ...prev, username: 'validation.usernameChars' }));
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
        if (!formData.firstName) newErrors.firstName = 'validation.firstNameRequired';
        if (!formData.lastName) newErrors.lastName = 'validation.lastNameRequired';

        if (!formData.email) {
            newErrors.email = 'validation.emailRequired';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'validation.emailInvalid';
        }

        if (!formData.personNumber) {
            newErrors.personNumber = 'validation.personNumberRequired';
        }

        if (!formData.username) {
            newErrors.username = 'validation.usernameRequired';
        } else {
            const { isValid, error } = validateUsername(formData.username);
            if (!isValid) {
                if (!isValid) {
                    if (error === 'validation.usernameChars') {
                        newErrors.username = 'validation.usernameChars';
                    } else {
                        newErrors.username = 'validation.usernameInvalid';
                    }
                }
            }
        }

        if (!formData.password) {
            newErrors.password = 'validation.passwordRequired';
        } else {
            const passwordReqs = getPasswordErrors(formData.password);
            if (passwordReqs.length > 0) {
                // Store password errors as a special object/string that the UI can parse
                // For now, we'll store a prefix so the UI knows it's a password-titles-reqs type
                newErrors.password = `PASSWORD_ERROR:${passwordReqs.join(',')}`;
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
                    // Check if it's an async error key
                    const isAsyncError = current === 'validation.usernameExists' || current === 'validation.emailExists';
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

        // Key-based check for async errors
        const hasAsyncErrors = errors.username === 'validation.usernameExists' || errors.email === 'validation.emailExists';

        if (hasFormatErrors || hasAsyncErrors) return;

        setIsSubmitting(true);
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.submit;
            return newErrors;
        });

        try {
            await registerApplicant(formData);
            setSuccess(t('common.success.registration'));
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                submit: error instanceof Error ? error.message : 'errors.registrationFailed'
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
