
import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface User {
    id: number;
    username: string;
    role: 'applicant' | 'recruiter';
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (user: User, token?: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = (userData: User, token?: string) => {
        setUser(userData);
        if (token) {
            localStorage.setItem('auth_token', token);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('auth_token');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
