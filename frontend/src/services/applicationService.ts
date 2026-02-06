import type { ApplicationSubmission } from '../types/application';
import { apiClient } from './api';

/**
 * Application service for handling application-related operations
 */
export class ApplicationService {
    /**
     * Submit an application with competences and availability
     */
    async submitApplication(data: ApplicationSubmission): Promise<any> {
        try {
            return await apiClient.post<any>('/application/submit', data);
        } catch (error) {
            throw new Error(`Application submission failed: ${(error as Error).message}`);
        }
    }

    /**
     * Get all applications for the current user
     * TODO: Implement when backend endpoint is available
     */
    async getApplications(): Promise<any> {
        try {
            return await apiClient.get<any>('/applications');
        } catch (error) {
            throw new Error(`Failed to fetch applications: ${(error as Error).message}`);
        }
    }

    /**
     * Get a specific application by ID
     * TODO: Implement when backend endpoint is available
     */
    async getApplicationById(id: number): Promise<any> {
        try {
            return await apiClient.get<any>(`/applications/${id}`);
        } catch (error) {
            throw new Error(`Failed to fetch application: ${(error as Error).message}`);
        }
    }

    /**
         * Get all applications for all users
         * TODO: Implement when backend endpoint is available
         */
    async getAllApplications(): Promise<any> {
        try {
            return await apiClient.get<any>('/applications');
        } catch (error) {
            throw new Error(`Failed to fetch applications: ${(error as Error).message}`);
        }
    }
}

// Export singleton instance
export const applicationService = new ApplicationService();

// Also export the named function for backward compatibility
export const submitApplication = (data: ApplicationSubmission) => applicationService.submitApplication(data);
