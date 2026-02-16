/**
 * AuthService Unit Tests
 * This file tests the authentication logic, including login, registration,
 * session management, and availability checks.
 */
import { describe, it, expect } from 'vitest';
import { authService } from '../../../services/authService';
import type { RegisterData } from '../../../types/auth';

describe('AuthService', () => {
    // Tests for user login functionality
    describe('login', () => {
        it('should login successfully with correct credentials', async () => {
            const response = await authService.login('testuser', 'Password123!');
            expect(response).toBeDefined();
            expect(response.username).toBe('testuser');
        });

        it('should throw error with incorrect credentials', async () => {
            await expect(authService.login('wronguser', 'wrongpass'))
                .rejects.toThrow();
        });

        it('should throw error if credentials are missing', async () => {
            await expect(authService.login('', ''))
                .rejects.toThrow('validation.credentialsRequired');
        });
    });

    // Tests for new user registration
    describe('register', () => {
        it('should register successfully with valid data', async () => {
            const data: RegisterData = {
                username: 'newuser123',
                password: 'Password123!',
                email: 'new@example.com',
                personNumber: '19900101-1234',
                firstName: 'New',
                lastName: 'User'
            };
            await expect(authService.register(data)).resolves.not.toThrow();
        });

        it('should throw error if username is too short', async () => {
            const data: RegisterData = {
                username: 'abc',
                password: 'Password123!',
                email: 'new@example.com',
                personNumber: '19900101-1234',
                firstName: 'New',
                lastName: 'User'
            };
            await expect(authService.register(data))
                .rejects.toThrow('validation.usernameInvalid');
        });
    });

    // Tests for checking if a username or email is already taken
    describe('checkAvailability', () => {
        it('should return available if name is not taken', async () => {
            const status = await authService.checkAvailability({ username: 'available' });
            expect(status.usernameTaken).toBe(false);
        });

        it('should return not available if name is taken', async () => {
            const status = await authService.checkAvailability({ username: 'taken' });
            expect(status.usernameTaken).toBe(true);
        });
    });

    // Tests for user logout
    describe('logout', () => {
        it('should call logout successfully', async () => {
            await expect(authService.logout()).resolves.not.toThrow();
        });
    });
});
