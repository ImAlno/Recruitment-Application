/**
 * LoginPage Unit Tests
 * This file tests the full login flow, including form validation,
 * error messages for invalid credentials, and successful redirection.
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../../../pages/LoginPage';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../../contexts/AuthContext';

// Mock matchMedia for framer-motion if needed, but usually not required for basic rendering
// Mock resizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

const renderLoginPage = () => {
    return render(
        <MemoryRouter initialEntries={['/login']}>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/applicant/dashboard" element={<div>Applicant Dashboard</div>} />
                    <Route path="/recruiter/dashboard" element={<div>Recruiter Dashboard</div>} />
                </Routes>
            </AuthProvider>
        </MemoryRouter>
    );
};

describe('LoginPage', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('should render login form', async () => {
        renderLoginPage();
        // Specifically look for the heading in the card, not the link in the header
        expect(await screen.findByRole('heading', { name: /common\.login/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/login\.username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/login\.password/i)).toBeInTheDocument();
        // The button specifically
        expect(screen.getByRole('button', { name: /common\.login/i })).toBeInTheDocument();
    });

    it('should show error message on failed login', async () => {
        renderLoginPage();

        fireEvent.change(screen.getByLabelText('login.username'), { target: { value: 'wronguser' } });
        fireEvent.change(screen.getByLabelText('login.password'), { target: { value: 'wrongpass' } });
        fireEvent.click(screen.getByRole('button', { name: 'common.login' }));

        await waitFor(() => {
            // ApiClient throws an error which is handled in LoginPage
            // handlers.ts returns 401 for wrong credentials
            // ApiClient translates it to errors.serverError (mocked as errors.serverError)
            expect(screen.getByText('errors.serverError')).toBeInTheDocument();
        });
    });

    it('should redirect to applicant dashboard on successful applicant login', async () => {
        renderLoginPage();

        fireEvent.change(screen.getByLabelText('login.username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText('login.password'), { target: { value: 'Password123!' } });
        fireEvent.click(screen.getByRole('button', { name: 'common.login' }));

        await waitFor(() => {
            expect(screen.getByText('Applicant Dashboard')).toBeInTheDocument();
        });

        expect(localStorage.getItem('user')).toBeDefined();
    });
});
