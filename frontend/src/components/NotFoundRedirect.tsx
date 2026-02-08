import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

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
