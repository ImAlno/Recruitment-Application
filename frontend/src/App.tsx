import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Applicant Routes */}
        <Route path="/applicant/dashboard" element={<ApplicantDashboard />} />
        <Route path="/applicant/apply/competence" element={<CompetenceProfilePage />} />
        <Route path="/applicant/apply/availability" element={<AvailabilityPage />} />
        <Route path="/applicant/apply/review" element={<ReviewSubmitPage />} />
        <Route path="/applicant/apply/confirmation" element={<ConfirmationPage />} />

        {/* Recruiter Routes */}
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        <Route path="/recruiter/applications" element={<ApplicationListPage />} />
        <Route path="/recruiter/applications/:id" element={<ApplicationDetailsPage />} />

        {/* Error Route */}
        <Route path="/error" element={<ErrorPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
