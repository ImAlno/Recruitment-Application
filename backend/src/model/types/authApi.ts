/**
 * Represents the request payload for user registration.
 */
export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    personNumber: string;
    username: string;
    password: string;
}

/**
 * Represents the response indicating if a selected username or email is already taken.
 */
export interface AvailabilityResponse {
    usernameTaken: boolean,
    emailTaken: boolean,
}
