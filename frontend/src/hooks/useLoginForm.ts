import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';

/**
 * Custom hook for managing login form state and submission logic.
 * Handles input state, loading indicators, error mapping, and navigation after successful login.
 * 
 * @returns {Object} An object containing form state and the submit handler.
 * @property {string} username - The current username input value.
 * @property {Function} setUsername - State setter for the username.
 * @property {string} password - The current password input value.
 * @property {Function} setPassword - State setter for the password.
 * @property {string} error - Current error message key or raw message.
 * @property {boolean} isLoading - True if the login request is in progress.
 * @property {Function} handleSubmit - Form submission handler that performs the login and redirects.
 */
export const useLoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const user = await authService.login(username, password);

            login(user);

            if (user.role === 'recruiter') {
                navigate('/recruiter/dashboard');
            } else {
                navigate('/applicant/dashboard');
            }
        } catch (err: any) {
            console.error('Login error:', err);
            const errorMessage = err?.message || '';
            const status = err?.status;

            if (status === 401 || errorMessage.includes('401')) {
                setError('login.invalidCredentials');
            } else if (status === 500 || errorMessage.includes('500')) {
                setError('login.error500');
            } else {
                setError(err instanceof Error ? err.message : 'login.invalidCredentials');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return {
        username,
        setUsername,
        password,
        setPassword,
        error,
        isLoading,
        handleSubmit
    };
};
