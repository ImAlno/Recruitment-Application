
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

import type { User } from '../types/auth';
import { authService } from '../services/authService';

/**
 * Type definition for the Authentication Context state and actions.
 */
interface AuthContextType {
    /** The currently logged-in user or null. */
    user: User | null;
    /** True if there is a logged-in user. */
    isAuthenticated: boolean;
    /** Function to log in a user and persist their data. */
    login: (user: User) => void;
    /** Function to log out the current user and clear their session. */
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Context Provider component that manages the authentication state.
 * Restores user session from localStorage on mount.
 * 
 * @param {{ children: ReactNode }} props - The component props.
 * @returns {JSX.Element} The rendered provider.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        // Restore user from localStorage on initial load
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    useEffect(() => {
        const handleLogout = () => {
            setUser(null);
            localStorage.removeItem('user');
        };

        window.addEventListener('auth:logout', handleLogout);

        return () => {
            window.removeEventListener('auth:logout', handleLogout);
        };
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = async () => {
        try {
            await authService.logout();
        } finally {
            setUser(null);
            localStorage.removeItem('user');
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Custom hook to access the Authentication Context.
 * Must be used within an AuthProvider.
 * 
 * @returns {AuthContextType} The state and actions of the authentication context.
 * @throws {Error} If called outside of an AuthProvider.
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
