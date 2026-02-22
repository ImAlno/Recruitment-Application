/**
 * AuthContext Unit Tests
 * This file tests the global authentication provider, ensuring it correctly
 * initializes from localStorage and manages login/logout states.
 */
import { act, renderHook } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../../contexts/AuthContext';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import type { User } from '../../../types/auth';

const testUser: User = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    personNumber: '19900101-1234',
    role: 'applicant',
    firstName: 'Test',
    lastName: 'User'
};

describe('AuthContext', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('should initialize with null user if nothing in localStorage', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthProvider>{children}</AuthProvider>
        );
        const { result } = renderHook(() => useAuth(), { wrapper });

        expect(result.current.user).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
    });

    it('should initialize with user from localStorage', () => {
        localStorage.setItem('user', JSON.stringify(testUser));

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthProvider>{children}</AuthProvider>
        );
        const { result } = renderHook(() => useAuth(), { wrapper });

        expect(result.current.user).toEqual(testUser);
        expect(result.current.isAuthenticated).toBe(true);
    });

    it('should update user on login', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthProvider>{children}</AuthProvider>
        );
        const { result } = renderHook(() => useAuth(), { wrapper });

        act(() => {
            result.current.login(testUser);
        });

        expect(result.current.user).toEqual(testUser);
        expect(localStorage.getItem('user')).toBe(JSON.stringify(testUser));
    });

    it('should clear user on logout', async () => {
        localStorage.setItem('user', JSON.stringify(testUser));

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthProvider>{children}</AuthProvider>
        );
        const { result } = renderHook(() => useAuth(), { wrapper });

        await act(async () => {
            await result.current.logout();
        });

        expect(result.current.user).toBeNull();
        expect(localStorage.getItem('user')).toBeNull();
    });

    it('should logout when auth:logout event is dispatched', () => {
        localStorage.setItem('user', JSON.stringify(testUser));

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthProvider>{children}</AuthProvider>
        );
        const { result } = renderHook(() => useAuth(), { wrapper });

        act(() => {
            window.dispatchEvent(new Event('auth:logout'));
        });

        expect(result.current.user).toBeNull();
    });

    it('should throw error if useAuth is used outside of AuthProvider', () => {
        // Suppress console.error for this test as it's expected
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        expect(() => renderHook(() => useAuth())).toThrow('useAuth must be used within an AuthProvider');

        consoleSpy.mockRestore();
    });
});
