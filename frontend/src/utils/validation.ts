export const validateEmail = (email: string): boolean => {
    return /\S+@\S+\.\S+/.test(email);
};

export const getPasswordErrors = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 6) errors.push('Minimum 6 characters');
    if (!/[A-Z]/.test(password)) errors.push('1 uppercase');
    if (!/[a-z]/.test(password)) errors.push('1 lowercase');
    if (!/\d/.test(password)) errors.push('1 number');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('1 special character');
    return errors;
};

export const formatPasswordErrorMessage = (errors: string[]): string => {
    if (errors.length === 0) return '';
    return `Password must include: ${errors.join(', ')}`;
};
