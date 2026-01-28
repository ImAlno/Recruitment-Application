export interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    personNumber: string;
    username: string;
    password?: string;
}

export const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    // Will call the backend in the future
    console.log('Checking availability for username:', username);

    // Current mock test
    const takenUsernames = ['admin', 'user', 'test'];
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(!takenUsernames.includes(username.toLowerCase()));
        }, 500);
    });
};

export const registerApplicant = async (data: RegisterData) => {
    console.log('Registering applicant:', data);
};
