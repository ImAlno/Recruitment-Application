/**
 * ApplicationService Unit Tests
 * This file tests the logic for submitting, fetching, and managing 
 * job applications for both applicants and recruiters.
 */
import { describe, it, expect } from 'vitest';
import { applicationService } from '../../../services/applicationService';
import type { ApplicationSubmission } from '../../../types/application';

describe('ApplicationService', () => {
    // Tests for submitting a new application
    describe('submitApplication', () => {
        it('should submit an application successfully', async () => {
            const data: ApplicationSubmission = {
                competences: [{ competence_id: 1, years_of_experience: 2 }],
                availability: [{ from_date: '2025-01-01', to_date: '2025-01-02' }],
                userId: 1
            };
            const response = await applicationService.submitApplication(data);
            expect(response).toBeDefined();
            expect(response.applicationId).toBe(101);
        });
    });

    // Tests for fetching applications submitted by the current user
    describe('getApplications', () => {
        it('should fetch all applications for current user', async () => {
            const response = await applicationService.getApplications();
            expect(Array.isArray(response)).toBe(true);
            expect(response).toHaveLength(2);
            expect(response[0].status).toBe('unhandled');
        });
    });

    describe('getApplicationById', () => {
        it('should fetch a specific application', async () => {
            const response = await applicationService.getApplicationById(1);
            expect(response).toBeDefined();
            expect(response.applicationId).toBe(1);
        });
    });

    describe('updateApplicationStatus', () => {
        it('should update application status', async () => {
            const response = await applicationService.updateApplicationStatus(1, 'accepted');
            expect(response).toBeDefined();
            expect(response.status).toBe('accepted');
        });
    });

    describe('getAllApplications', () => {
        it('should fetch all applications for recruiter', async () => {
            const response = await applicationService.getAllApplications();
            expect(Array.isArray(response)).toBe(true);
            expect(response).toHaveLength(2);
        });
    });
});
