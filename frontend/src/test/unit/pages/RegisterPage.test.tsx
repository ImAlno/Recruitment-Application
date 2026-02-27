/**
 * RegisterPage Unit Tests
 * This file tests the registration process, covering form input,
 * asynchronous availability checks (debounced), and success state.
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterPage from '../../../pages/RegisterPage';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../../contexts/AuthContext';

// Mock ResizeObserver
declare const global: any;
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

const renderRegisterPage = () => {
    return render(
        <MemoryRouter>
            <AuthProvider>
                <RegisterPage />
            </AuthProvider>
        </MemoryRouter>
    );
};

describe('RegisterPage', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('should render registration form', async () => {
        renderRegisterPage();
        expect(await screen.findByRole('heading', { name: /register\.title/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/register\.firstName/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/register\.lastName/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/register\.email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/register\.username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/register\.password/i)).toBeInTheDocument();
    });

    it('should show success message on successful registration', async () => {
        renderRegisterPage();

        fireEvent.change(screen.getByLabelText(/register\.firstName/i), { target: { value: 'Test', name: 'firstName' } });
        fireEvent.change(screen.getByLabelText(/register\.lastName/i), { target: { value: 'User', name: 'lastName' } });
        fireEvent.change(screen.getByLabelText(/register\.email/i), { target: { value: 'test@example.com', name: 'email' } });
        fireEvent.change(screen.getByLabelText(/register\.personNumber/i), { target: { value: '19900101-1234', name: 'personNumber' } });
        fireEvent.change(screen.getByLabelText(/register\.username/i), { target: { value: 'newuser123', name: 'username' } });
        fireEvent.change(screen.getByLabelText(/register\.password/i), { target: { value: 'Password123!', name: 'password' } });

        // Wait for the debounce (500ms) and button to be enabled
        const submitBtn = screen.getByRole('button', { name: /register\.createAccount/i });
        await waitFor(() => {
            expect(submitBtn).not.toBeDisabled();
        }, { timeout: 3000 });

        fireEvent.click(submitBtn);

        // Success message should appear.
        await waitFor(() => {
            expect(screen.getByText(/register\.successTitle/i)).toBeInTheDocument();
        }, { timeout: 3000 });
    });
});
