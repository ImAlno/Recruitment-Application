/**
 * Represents a validation requirement with a translation key and a test function.
 */
export interface Requirement {
    /** Translation key for the requirement description. */
    key: string;
    /** Function that returns true if the value meets the requirement. */
    test: (value: string) => boolean;
}

/**
 * Checks if a string is a valid email address using a simple regex.
 * 
 * @param {string} email - The email string to validate.
 * @returns {boolean} True if the email is valid.
 */
export const validateEmail = (email: string): boolean => {
    return /\S+@\S+\.\S+/.test(email);
};

/**
 * Predefined list of password security requirements.
 */
export const passwordRequirements: Requirement[] = [
    { key: 'validation.password.minLength', test: (p: string) => p.length >= 6 },
    { key: 'validation.password.uppercase', test: (p: string) => /[A-Z]/.test(p) },
    { key: 'validation.password.lowercase', test: (p: string) => /[a-z]/.test(p) },
    { key: 'validation.password.number', test: (p: string) => /\d/.test(p) },
    { key: 'validation.password.special', test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) }
];

/**
 * Predefined list of username requirements.
 */
export const usernameRequirements: Requirement[] = [
    { key: 'validation.usernameRange', test: (u: string) => u.length >= 6 && u.length <= 30 }
];

/**
 * Validates a username against allowed characters and length constraints.
 * 
 * @param {string} username - The username to validate.
 * @returns {Object} An object indicating if valid and an optional error translation key.
 */
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

/**
 * Identifies which password requirements are currently not met by a given password.
 * 
 * @param {password} password - The password string to check.
 * @returns {string[]} An array of translation keys for the failed requirements.
 */
export const getPasswordErrors = (password: string): string[] => {
    return passwordRequirements
        .filter(req => !req.test(password))
        .map(req => req.key);
};

