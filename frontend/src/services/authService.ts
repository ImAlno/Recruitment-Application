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

export const checkAvailability = async (req: AvailabilityCheckRequest): Promise<AvailabilityStatus> => {
    // Will call the backend in the future
    console.log('Checking availability for:', req);

    // Current mock test
    const takenUsernames = ['admin123', 'user123', 'test123'];
    const takenEmails = ['admin@example.com', 'user@example.com', 'test@example.com'];

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                usernameTaken: req.username ? takenUsernames.includes(req.username.toLowerCase()) : false,
                emailTaken: req.email ? takenEmails.includes(req.email.toLowerCase()) : false
            });
        }, 500);
    });
};

export const registerApplicant = async (data: RegisterData) => {
    console.log('Registering applicant:', data);
};
