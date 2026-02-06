
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: ('applicant' | 'recruiter')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard if role doesn't match
        return <Navigate to={user.role === 'recruiter' ? '/recruiter/dashboard' : '/applicant/dashboard'} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
