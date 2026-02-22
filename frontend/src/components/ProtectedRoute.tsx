
import React, { useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Props for the ProtectedRoute component.
 */
interface ProtectedRouteProps {
    /** The content to render if access is granted. */
    children: React.ReactNode;
    /** Optional list of roles that are allowed to access this route. */
    allowedRoles?: ('applicant' | 'recruiter')[];
}

/**
 * Higher-order component for protecting routes from unauthorized access.
 * Redirects to the login/landing page if not authenticated.
 * Redirects to the appropriate dashboard if the user's role is not authorized for the specific route.
 * 
 * @param {ProtectedRouteProps} props - The component props.
 * @returns {JSX.Element | null} The children if authorized, otherwise a Navigate component or null.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/', { state: { from: location }, replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    if (!isAuthenticated) {
        return null;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to={user.role === 'recruiter' ? '/recruiter/dashboard' : '/applicant/dashboard'} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
