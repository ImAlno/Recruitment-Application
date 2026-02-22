import type { ApplicationSubmission } from '../types/application';
import { apiClient } from './api';

/**
 * Application service for handling application-related operations
 */
export class ApplicationService {
    /**
     * Submit an application with competences and availability.
     * 
     * @param {ApplicationSubmission} data - The application data containing competences and availability.
     * @returns {Promise<any>} A promise that resolves with the response from the server.
     * @throws {Error} If the submission fails.
     */
    async submitApplication(data: ApplicationSubmission): Promise<any> {
        try {
            return await apiClient.post<any>('/application/submit', data);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Update the status of an application.
     * 
     * @param {number} id - The unique identifier of the application.
     * @param {string} status - The new status to set (e.g., 'accepted', 'rejected', 'unhandled').
     * @returns {Promise<any>} A promise that resolves with the updated application data.
     * @throws {Error} If the update fails.
     */
    async updateApplicationStatus(id: number, status: string): Promise<any> {
        try {
            // Note: Adjust payload structure based on backend requirements
            return await apiClient.put<any>(`/application/${id}`, { status });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get all applications for the current user.
     * 
     * @returns {Promise<any>} A promise that resolves with the user's applications.
     * @throws {Error} If fetching fails.
     */
    async getApplications(): Promise<any> {
        try {
            return await apiClient.get<any>('/admin/applications');
        } catch (error) {
            throw new Error(`Failed to fetch applications: ${(error as Error).message}`);
        }
    }

    /**
     * Get a specific application by ID.
     * 
     * @param {number} id - The unique identifier of the application.
     * @returns {Promise<any>} A promise that resolves with the application data.
     * @throws {Error} If fetching fails.
     */
    async getApplicationById(id: number): Promise<any> {
        try {
            return await apiClient.get<any>(`/admin/applications/${id}`);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get all applications for all users (Admin view).
     * 
     * @returns {Promise<any>} A promise that resolves with all applications.
     * @throws {Error} If fetching fails.
     */
    async getAllApplications(): Promise<any> {
        try {
            return await apiClient.get<any>('/admin/applications');
        } catch (error) {
            throw new Error(`Failed to fetch applications: ${(error as Error).message}`);
        }
    }
}

/**
 * Singleton instance of ApplicationService.
 */
export const applicationService = new ApplicationService();

/**
 * Convenience wrapper for submitting an application.
 * @param {ApplicationSubmission} data - The application data.
 * @returns {Promise<any>}
 */
export const submitApplication = (data: ApplicationSubmission) => applicationService.submitApplication(data);

/**
 * Convenience wrapper for getting current user's applications.
 * @returns {Promise<any>}
 */
export const getApplications = () => applicationService.getApplications();

/**
 * Convenience wrapper for updating application status.
 * @param {number} id - Application ID.
 * @param {string} status - New status.
 * @returns {Promise<any>}
 */
export const updateApplicationStatus = (id: number, status: string) => applicationService.updateApplicationStatus(id, status);
