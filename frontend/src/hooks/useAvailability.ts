import { useState, useEffect } from 'react';
import { checkAvailability } from '../services/authService';
import { validateEmail, validateUsername } from '../utils/validation';

interface UseAvailabilityProps {
    formData: { username: string; email: string };
    setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

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
                        if (!isFormatValid && formatError !== 'Username format is invalid') {
                            if (formatError === 'Username contains invalid characters') {
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
