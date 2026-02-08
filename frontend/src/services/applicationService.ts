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
     * Update the status of an application
     */
    async updateApplicationStatus(id: number, status: string): Promise<any> {
        try {
            // Note: Adjust payload structure based on backend requirements
            return await apiClient.put<any>(`/application/${id}`, { status });
        } catch (error) {
            throw new Error(`Failed to update application status: ${(error as Error).message}`);
        }
    }

    /**
     * Get all applications for the current user
     */
    async getApplications(): Promise<any> {
        try {
            return await apiClient.get<any>('/application');
        } catch (error) {
            throw new Error(`Failed to fetch applications: ${(error as Error).message}`);
        }
    }

    /**
     * Get a specific application by ID
     */
    async getApplicationById(id: number): Promise<any> {
        try {
            return await apiClient.get<any>(`/application/${id}`);
        } catch (error) {
            throw new Error(`Failed to fetch application: ${(error as Error).message}`);
        }
    }

    /**
         * Get all applications for all users
         */
    async getAllApplications(): Promise<any> {
        try {
            return await apiClient.get<any>('/application');
        } catch (error) {
            throw new Error(`Failed to fetch applications: ${(error as Error).message}`);
        }
    }
}

// Export singleton instance
export const applicationService = new ApplicationService();

export const submitApplication = (data: ApplicationSubmission) => applicationService.submitApplication(data);
export const getApplications = () => applicationService.getApplications();
export const updateApplicationStatus = (id: number, status: string) => applicationService.updateApplicationStatus(id, status);
