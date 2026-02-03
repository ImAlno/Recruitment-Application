
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';

const Header = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto flex h-14 items-center justify-between px-4">
                <div className="flex items-center gap-6">
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="inline-block font-bold text-xl text-blue-600">RecruitApp</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        {isAuthenticated && user?.role === 'applicant' && (
                            <Link to="/applicant/dashboard" className="transition-colors hover:text-blue-600">Applicant</Link>
                        )}
                        {isAuthenticated && user?.role === 'recruiter' && (
                            <Link to="/recruiter/dashboard" className="transition-colors hover:text-blue-600">Recruiter</Link>
                        )}
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <select className="bg-transparent text-sm border-none focus:ring-0 cursor-pointer">
                        <option>EN</option>
                        <option>SV</option>
                    </select>
                    {isAuthenticated ? (
                        <Button variant="outline" size="sm" onClick={handleLogout}>
                            Logout
                        </Button>
                    ) : (
                        <Link to="/login" className="text-sm font-medium hover:underline underline-offset-4">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
