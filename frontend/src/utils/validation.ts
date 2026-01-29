export interface Requirement {
    label: string;
    test: (value: string) => boolean;
    errorCode?: string;
}

export const validateEmail = (email: string): boolean => {
    return /\S+@\S+\.\S+/.test(email);
};

export const passwordRequirements: Requirement[] = [
    { label: 'Minimum 6 characters', test: (p: string) => p.length >= 6, errorCode: 'min_length' },
    { label: 'At least 1 uppercase', test: (p: string) => /[A-Z]/.test(p), errorCode: 'uppercase' },
    { label: 'At least 1 lowercase', test: (p: string) => /[a-z]/.test(p), errorCode: 'lowercase' },
    { label: 'At least 1 number', test: (p: string) => /\d/.test(p), errorCode: 'number' },
    { label: 'At least 1 special character', test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p), errorCode: 'special' }
];

export const usernameRequirements: Requirement[] = [
    { label: '6-30 characters', test: (u: string) => u.length >= 6 && u.length <= 30 }
];

export const validateUsername = (username: string): { isValid: boolean; error?: string } => {
    if (/[^a-zA-Z0-9.,_-]/.test(username)) {
        return { isValid: false, error: 'Username contains invalid characters' };
    }
    const usernameRegex = /^[a-zA-Z0-9.,_-]{6,30}$/;
    if (!usernameRegex.test(username)) {
        return { isValid: false, error: 'Username format is invalid' };
    }
    return { isValid: true };
};

export const getPasswordErrors = (password: string): string[] => {
    return passwordRequirements
        .filter(req => !req.test(password))
        .map(req => req.label.replace('At least 1 ', '').toLowerCase());
};

export const formatPasswordErrorMessage = (errors: string[]): string => {
    if (errors.length === 0) return '';
    return `Password must include: ${errors.join(', ')}`;
};
