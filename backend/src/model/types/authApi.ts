export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    personNumber: string;
    username: string;
    password: string;
}

export interface AvailabilityResponse {
    usernameTaken: boolean, 
    emailTaken: boolean,
}
