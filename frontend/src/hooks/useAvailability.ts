import { useState, useEffect } from 'react';
import { checkAvailability } from '../services/authService';
import { validateEmail, validateUsername } from '../utils/validation';

/**
 * Props for the useAvailability hook.
 */
interface UseAvailabilityProps {
    /** The registration form data containing username and email. */
    formData: { username: string; email: string };
    /** State setter for the form's error object. */
    setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

/**
 * Custom hook for checking the availability of a username or email address.
 * Automatically triggers an API check when the input changes (debounced by 500ms).
 * Updates the shared form errors if the value is taken.
 * 
 * @param {UseAvailabilityProps} props - The hook props.
 * @returns {Object} An object containing checking states and previously checked values.
 * @property {boolean} isCheckingUsername - True if a username check is currently in progress.
 * @property {boolean} isCheckingEmail - True if an email check is currently in progress.
 * @property {Function} setIsCheckingUsername - External trigger to manually set username checking state.
 * @property {Function} setIsCheckingEmail - External trigger to manually set email checking state.
 * @property {Object} checkedValues - Cache of values that have already been checked to avoid redundant calls.
 */
export const useAvailability = ({ formData, setErrors }: UseAvailabilityProps) => {
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
    const [checkedValues, setCheckedValues] = useState<{ username?: string, email?: string }>({});

    useEffect(() => {
        const check = async () => {
            const { isValid: isUsernameFormatValid } = validateUsername(formData.username);

            const needsUsernameCheck = formData.username && isUsernameFormatValid && formData.username !== checkedValues.username;
            const needsEmailCheck = formData.email && formData.email !== checkedValues.email && validateEmail(formData.email);

            if (needsUsernameCheck || needsEmailCheck) {
                const { usernameTaken, emailTaken } = await checkAvailability({
                    username: needsUsernameCheck ? formData.username : undefined,
                    email: needsEmailCheck ? formData.email : undefined
                });

                setErrors(prev => {
                    const newErrors = { ...prev };
                    if (needsUsernameCheck) {
                        if (usernameTaken) newErrors.username = 'validation.usernameExists';
                        else delete newErrors.username;
                    } else if (formData.username) {
                        const { isValid: isFormatValid, error: formatError } = validateUsername(formData.username);
                        if (!isFormatValid && formatError !== 'validation.usernameInvalid') {
                            if (formatError === 'validation.usernameChars') {
                                newErrors.username = 'validation.usernameChars';
                            } else {
                                newErrors.username = 'validation.usernameInvalid';
                            }
                        } else {
                            delete newErrors.username;
                        }
                    }
                    if (needsEmailCheck) {
                        if (emailTaken) newErrors.email = 'validation.emailExists';
                        else delete newErrors.email;
                    }
                    return newErrors;
                });

                setCheckedValues(prev => ({
                    ...prev,
                    ...(needsUsernameCheck ? { username: formData.username } : {}),
                    ...(needsEmailCheck ? { email: formData.email } : {})
                }));

                if (needsUsernameCheck) setIsCheckingUsername(false);
                if (needsEmailCheck) setIsCheckingEmail(false);
            } else {
                // Clear loading states if checks aren't needed but were triggered by handleChange
                const { isValid: isUsernameFormatValid } = validateUsername(formData.username);
                if (formData.username && !isUsernameFormatValid) setIsCheckingUsername(false);
                if (formData.email && !validateEmail(formData.email)) setIsCheckingEmail(false);
            }
        };

        const timer = setTimeout(check, 500);
        return () => clearTimeout(timer);
    }, [formData.username, formData.email, checkedValues, setErrors]);

    return {
        isCheckingUsername,
        isCheckingEmail,
        setIsCheckingUsername,
        setIsCheckingEmail,
        checkedValues
    };
};
