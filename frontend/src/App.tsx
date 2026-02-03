import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ApplicantDashboard from './pages/ApplicantDashboard';
import CompetenceProfilePage from './pages/CompetenceProfilePage';
import AvailabilityPage from './pages/AvailabilityPage';
import ReviewSubmitPage from './pages/ReviewSubmitPage';
import ConfirmationPage from './pages/ConfirmationPage';
import RecruiterDashboard from './pages/RecruiterDashboard';
import ApplicationListPage from './pages/ApplicationListPage';
import ApplicationDetailsPage from './pages/ApplicationDetailsPage';
import ErrorPage from './pages/ErrorPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
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
            path="/applicant/apply/competence"
            element={
              <ProtectedRoute allowedRoles={['applicant']}>
                <CompetenceProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applicant/apply/availability"
            element={
              <ProtectedRoute allowedRoles={['applicant']}>
                <AvailabilityPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applicant/apply/review"
            element={
              <ProtectedRoute allowedRoles={['applicant']}>
                <ReviewSubmitPage />
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
            path="/recruiter/applications"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <ApplicationListPage />
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

          {/* Error Route */}
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
