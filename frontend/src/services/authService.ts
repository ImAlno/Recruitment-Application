import { apiClient } from './api';
import { API_ENDPOINTS } from '../types/api';
import type { RegisterData, AvailabilityCheckRequest, AvailabilityStatus, LoginResponse } from '../types/auth';
import { validateUsername } from '../utils/validation';

/**
 * Authentication service for handling auth-related operations
 */
export class AuthService {
    /**
     * Check if a username or email is already taken.
     * 
     * @param {AvailabilityCheckRequest} params - Object containing username or email to check.
     * @returns {Promise<AvailabilityStatus>} A promise resolving to the availability status.
     * @throws {Error} If the request fails.
     */
    async checkAvailability(params: AvailabilityCheckRequest): Promise<AvailabilityStatus> {
        try {
            return await apiClient.get<AvailabilityStatus>(API_ENDPOINTS.CHECK_AVAILABILITY, params);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Register a new applicant.
     * 
     * @param {RegisterData} data - The registration data for the new applicant.
     * @returns {Promise<void>} A promise that resolves when registration is successful.
     * @throws {Error} If validation or the registration request fails.
     */
    async register(data: RegisterData): Promise<void> {
        // Validate username before sending to backend
        const validation = validateUsername(data.username);
        if (!validation.isValid) {
            throw new Error(validation.error);
        }

        try {
            await apiClient.post<void>(API_ENDPOINTS.REGISTER, data);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Authenticate a user with username and password.
     * 
     * @param {string} username - The user's username.
     * @param {string} password - The user's password.
     * @returns {Promise<LoginResponse>} A promise resolving to the login response data (e.g., user info, token).
     * @throws {Error} If credentials are missing or the login request fails.
     */
    async login(username: string, password: string): Promise<LoginResponse> {
        // Validate credentials
        if (!username || !password) {
            throw new Error('validation.credentialsRequired');
        }

        try {
            const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.LOGIN, { username, password });
            return response;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Log out the current user and clear any authentication state.
     * 
     * @returns {Promise<void>} A promise that resolves when logout is complete.
     */
    async logout(): Promise<void> {
        try {
            await apiClient.post<void>(API_ENDPOINTS.LOGOUT, {});
        } catch (error) {
            console.error('Logout API call failed:', error);
            // Even if API fails, we usually want to clear local state
        }
    }
}

/**
 * Singleton instance of AuthService.
 */
export const authService = new AuthService();

/**
 * Convenience wrapper for checking availability of username or email.
 * @param {AvailabilityCheckRequest} req - Availability check request.
 * @returns {Promise<AvailabilityStatus>}
 */
export const checkAvailability = (req: AvailabilityCheckRequest) => authService.checkAvailability(req);

/**
 * Convenience wrapper for registering a new applicant.
 * @param {RegisterData} data - Registration data.
 * @returns {Promise<void>}
 */
export const registerApplicant = (data: RegisterData) => authService.register(data);
