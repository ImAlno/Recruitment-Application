/**
 * useLoginForm Hook Tests
 * Tests login form logic: field management, successful login with redirection,
 * and error handling for various failure scenarios.
 */
import { renderHook, act, waitFor } from '@testing-library/react';
import { useLoginForm } from '../../../hooks/useLoginForm';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as authServiceModule from '../../../services/authService';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../../contexts/AuthContext';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock authService
vi.mock('../../../services/authService', () => ({
    authService: {
        login: vi.fn(),
    },
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>
        <AuthProvider>
            {children}
        </AuthProvider>
    </MemoryRouter>
);

describe('useLoginForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('should initialize with empty values', () => {
        const { result } = renderHook(() => useLoginForm(), { wrapper });

        expect(result.current.username).toBe('');
        expect(result.current.password).toBe('');
        expect(result.current.error).toBe('');
        expect(result.current.isLoading).toBe(false);
    });

    it('should update username and password fields', () => {
        const { result } = renderHook(() => useLoginForm(), { wrapper });

        act(() => {
            result.current.setUsername('testuser');
            result.current.setPassword('password123');
        });

        expect(result.current.username).toBe('testuser');
        expect(result.current.password).toBe('password123');
    });

    it('should handle successful applicant login', async () => {
        const mockUser: any = {
            id: 1,
            username: 'testuser',
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            personNumber: '199001011234',
            role: 'applicant'
        };
        vi.mocked(authServiceModule.authService.login).mockResolvedValueOnce(mockUser);

        const { result } = renderHook(() => useLoginForm(), { wrapper });

        act(() => {
            result.current.setUsername('testuser');
            result.current.setPassword('password123');
        });

        await act(async () => {
            await result.current.handleSubmit({ preventDefault: vi.fn() } as any);
        });

        expect(authServiceModule.authService.login).toHaveBeenCalledWith('testuser', 'password123');
        expect(mockNavigate).toHaveBeenCalledWith('/applicant/dashboard');
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe('');
    });

    it('should handle successful recruiter login', async () => {
        const mockUser: any = {
            id: 2,
            username: 'admin',
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@example.com',
            personNumber: '198001011234',
            role: 'recruiter'
        };
        vi.mocked(authServiceModule.authService.login).mockResolvedValueOnce(mockUser);

        const { result } = renderHook(() => useLoginForm(), { wrapper });

        act(() => {
            result.current.setUsername('admin');
            result.current.setPassword('admin123');
        });

        await act(async () => {
            await result.current.handleSubmit({ preventDefault: vi.fn() } as any);
        });

        expect(mockNavigate).toHaveBeenCalledWith('/recruiter/dashboard');
    });

    it('should handle 401 invalid credentials error', async () => {
        vi.mocked(authServiceModule.authService.login).mockRejectedValueOnce({ status: 401 });

        const { result } = renderHook(() => useLoginForm(), { wrapper });

        await act(async () => {
            await result.current.handleSubmit({ preventDefault: vi.fn() } as any);
        });

        expect(result.current.error).toBe('login.invalidCredentials');
        expect(result.current.isLoading).toBe(false);
    });

    it('should handle 500 server error', async () => {
        vi.mocked(authServiceModule.authService.login).mockRejectedValueOnce({ status: 500 });

        const { result } = renderHook(() => useLoginForm(), { wrapper });

        await act(async () => {
            await result.current.handleSubmit({ preventDefault: vi.fn() } as any);
        });

        expect(result.current.error).toBe('login.error500');
    });

    it('should handle generic error message', async () => {
        vi.mocked(authServiceModule.authService.login).mockRejectedValueOnce(new Error('Custom error'));

        const { result } = renderHook(() => useLoginForm(), { wrapper });

        await act(async () => {
            await result.current.handleSubmit({ preventDefault: vi.fn() } as any);
        });

        expect(result.current.error).toBe('Custom error');
    });
});
