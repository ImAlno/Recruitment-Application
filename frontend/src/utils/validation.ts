export interface Requirement {
    key: string;
    test: (value: string) => boolean;
}

export const validateEmail = (email: string): boolean => {
    return /\S+@\S+\.\S+/.test(email);
};

export const passwordRequirements: Requirement[] = [
    { key: 'validation.password.minLength', test: (p: string) => p.length >= 6 },
    { key: 'validation.password.uppercase', test: (p: string) => /[A-Z]/.test(p) },
    { key: 'validation.password.lowercase', test: (p: string) => /[a-z]/.test(p) },
    { key: 'validation.password.number', test: (p: string) => /\d/.test(p) },
    { key: 'validation.password.special', test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) }
];

export const usernameRequirements: Requirement[] = [
    { key: 'validation.usernameRange', test: (u: string) => u.length >= 6 && u.length <= 30 }
];

export const validateUsername = (username: string): { isValid: boolean; error?: string } => {
    if (/[^a-zA-Z0-9.,_-]/.test(username)) {
        return { isValid: false, error: 'validation.usernameChars' };
    }
    const usernameRegex = /^[a-zA-Z0-9.,_-]{6,30}$/;
    if (!usernameRegex.test(username)) {
        return { isValid: false, error: 'validation.usernameInvalid' };
    }
    return { isValid: true };
};

export const getPasswordErrors = (password: string): string[] => {
    return passwordRequirements
        .filter(req => !req.test(password))
        .map(req => req.key);
};

