import { apiClient } from './api';
import { API_ENDPOINTS } from '../types/api';
import type { RegisterData, AvailabilityCheckRequest, AvailabilityStatus, LoginResponse } from '../types/auth';
import { validateUsername } from '../utils/validation';

/**
 * Authentication service for handling auth-related operations
 */
export class AuthService {
    /**
     * Check if username or email is already taken
     */
    async checkAvailability(params: AvailabilityCheckRequest): Promise<AvailabilityStatus> {
        try {
            return await apiClient.get<AvailabilityStatus>(API_ENDPOINTS.CHECK_AVAILABILITY, params);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Register a new applicant
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
     * Login user
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
     * Logout user
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

// Export singleton instance
export const authService = new AuthService();

// Also export the named functions for backward compatibility
export const checkAvailability = (req: AvailabilityCheckRequest) => authService.checkAvailability(req);
export const registerApplicant = (data: RegisterData) => authService.register(data);
