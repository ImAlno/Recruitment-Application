/**
 * Auth-related type definitions
 */

/**
 * Data required to register a new user in the system.
 */
export interface RegisterData {
    /** User's first name. */
    firstName: string;
    /** User's last name. */
    lastName: string;
    /** User's email address. */
    email: string;
    /** User's social security / person number. */
    personNumber: string;
    /** Unique username for the account. */
    username: string;
    /** Password for the account (optional in some contexts like partial updates). */
    password?: string;
}

export interface AvailabilityCheckRequest {
    username?: string;
    email?: string;
}

export interface AvailabilityStatus {
    usernameTaken: boolean;
    emailTaken: boolean;
}

export interface LoginRequest {
    username: string;
    password: string;
}

/**
 * Represents an authenticated user in the system.
 */
export interface User {
    /** Unique database identifier for the user. */
    id: number;
    /** Unique username. */
    username: string;
    /** User's first name. */
    firstName: string;
    /** User's last name. */
    lastName: string;
    /** User's email address. */
    email: string;
    /** User's social security / person number. */
    personNumber: string;
    /** Access level role of the user. */
    role: 'applicant' | 'recruiter';
}


export type LoginResponse = User;

