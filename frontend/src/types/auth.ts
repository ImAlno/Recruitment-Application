/**
 * Auth-related type definitions
 */

export interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    personNumber: string;
    username: string;
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

export interface LoginResponse {
    success: {
        token?: string;
        user: {
            id: number;
            username: string;
            role: 'applicant' | 'recruiter';
        };
    };
}
