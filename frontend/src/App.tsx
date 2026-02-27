import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import { ApplicationProvider } from './contexts/ApplicationContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import ApplicantDashboard from './pages/ApplicantDashboard';
import ConfirmationPage from './pages/ConfirmationPage';
import ApplyPage from './pages/ApplyPage';
import RecruiterDashboard from './pages/RecruiterDashboard';

import ApplicationDetailsPage from './pages/ApplicationDetailsPage';
import ErrorPage from './pages/ErrorPage';
import NotFoundRedirect from './components/NotFoundRedirect';

/**
 * Component that defines the application's routes with entry/exit animations.
 * Uses framer-motion's AnimatePresence to handle transitions between pages.
 * 
 * @returns {JSX.Element} The rendered animated routes.
 */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Applicant Routes */}
        <Route
          path="/applicant/dashboard"
          element={
            <ProtectedRoute allowedRoles={['applicant']}>
              <ApplicantDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applicant/apply"
          element={
            <ProtectedRoute allowedRoles={['applicant']}>
              <ApplyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applicant/apply/confirmation"
          element={
            <ProtectedRoute allowedRoles={['applicant']}>
              <ConfirmationPage />
            </ProtectedRoute>
          }
        />

        {/* Recruiter Routes */}
        <Route
          path="/recruiter/dashboard"
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/applications/:id"
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <ApplicationDetailsPage />
            </ProtectedRoute>
          }
        />

        {/* Common Protected Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['applicant', 'recruiter']}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Error Route */}
        <Route path="/error" element={<ErrorPage />} />
        <Route path="*" element={<NotFoundRedirect />} />
      </Routes>
    </AnimatePresence>
  );
}

/**
 * Main application component.
 * Sets up global context providers (Auth, Application) and the router.
 * 
 * @returns {JSX.Element} The rendered root application component.
 */
function App() {
  return (
    <AuthProvider>
      <ApplicationProvider>
        <Router>
          <AnimatedRoutes />
        </Router>
      </ApplicationProvider>
    </AuthProvider>
  );
}

export default App;
