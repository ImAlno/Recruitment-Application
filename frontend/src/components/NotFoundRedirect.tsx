import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Component that redirects 404/not-found routes to the appropriate dashboard based on user role.
 * If the user is not authenticated, they are redirected to the landing page.
 * 
 * @returns {JSX.Element} A Navigate component for redirection.
 */
const NotFoundRedirect = () => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (user.role === 'recruiter') {
        return <Navigate to="/recruiter/dashboard" replace />;
    }

    if (user.role === 'applicant') {
        return <Navigate to="/applicant/dashboard" replace />;
    }

    return <Navigate to="/" replace />;
};

export default NotFoundRedirect;
