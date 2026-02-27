# Frontend Pages & Layout

This document provides detailed explanations of the page-level components and the global layout structure.

---

## 1. Global Layout Structure

### Layout Component
The [Layout.tsx](frontend/src/components/Layout.tsx) component wraps all pages to provide a consistent structure.

```tsx
// frontend/src/components/Layout.tsx
interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
                {children}
            </main>
            <Footer />
        </div>
    );
};
```

**How it works:**
- Uses flexbox to create a full-height layout (`min-h-screen`, `flex-col`).
- `Header` is sticky at the top.
- `main` expands to fill available space (`flex-1`).
- `Footer` stays at the bottom.
- All page content is passed as `children`.

---

## 2. Header (Navigation Bar)

The [Header.tsx](frontend/src/components/Header.tsx) is a dynamic navigation component that adapts to authentication state.

### Authentication-Aware Navigation

```tsx
// frontend/src/components/Header.tsx
const Header = () => {
    const { user, isAuthenticated } = useAuth();
    
    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur">
            <div className="container mx-auto flex h-14 items-center justify-between px-4">
                {/* Logo */}
                <Link to="/">
                    <span className="font-bold text-xl text-blue-600">RecruitApp</span>
                </Link>
                
                {/* Role-based navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    {isAuthenticated && user?.role === 'applicant' && (
                        <Link to="/applicant/dashboard">Applicant</Link>
                    )}
                    {isAuthenticated && user?.role === 'recruiter' && (
                        <Link to="/recruiter/dashboard">Recruiter</Link>
                    )}
                </nav>
                
                {/* User actions */}
                <div className="flex items-center gap-4">
                    <select className="bg-transparent">
                        <option>EN</option>
                        <option>SV</option>
                    </select>
                    {isAuthenticated ? <UserDropdown /> : <Link to="/login">Login</Link>}
                </div>
            </div>
        </header>
    );
};
```

**Key Features:**
1. **Sticky positioning**: Stays at top during scroll via Tailwind classes.
2. **Conditional rendering**: Shows different links based on `user.role` from `AuthContext`.
3. **Language selector**: Prepares for i18n support.
4. **UserDropdown**: Provides profile and logout options for authenticated users.

---

## 3. Landing Page

The [LandingPage.tsx](frontend/src/pages/LandingPage.tsx) serves as the public entry point.

### Dynamic Call-to-Action

```tsx
// frontend/src/pages/LandingPage.tsx
const LandingPage = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    return (
        <Layout>
            <div className="flex flex-col items-center justify-center space-y-8 text-center py-20">
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                        Welcome to RecruitApp
                    </h1>
                    <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                        Discover your next career opportunity with our seamless recruitment process.
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                    {!isAuthenticated ? (
                        <>
                            <Button size="lg" onClick={() => navigate('/register')}>
                                Create Account
                            </Button>
                            <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
                                Login
                            </Button>
                        </>
                    ) : (
                        <Button
                            size="lg"
                            onClick={() => navigate(
                                user?.role === 'recruiter' 
                                    ? '/recruiter/dashboard' 
                                    : '/applicant/dashboard'
                            )}
                        >
                            Go to Dashboard
                        </Button>
                    )}
                </div>
            </div>
        </Layout>
    );
};
```

**Flow Logic:**
1. **Check authentication**: Uses `useAuth()` hook to get current state.
2. **Guest users**: See "Create Account" and "Login" buttons.
3. **Authenticated users**: See single "Go to Dashboard" button.
4. **Role-based routing**: Navigates to appropriate dashboard based on `user.role` (recruiter vs applicant).

---

## 4. Routing Architecture

The [App.tsx](frontend/src/App.tsx) defines the complete routing structure using `react-router-dom`.

### Route Protection

```tsx
// frontend/src/App.tsx
<AuthProvider>
    <Router>
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected applicant routes */}
            <Route
                path="/applicant/dashboard"
                element={
                    <ProtectedRoute allowedRoles={['applicant']}>
                        <ApplicantDashboard />
                    </ProtectedRoute>
                }
            />

            {/* Protected recruiter routes */}
            <Route
                path="/recruiter/dashboard"
                element={
                    <ProtectedRoute allowedRoles={['recruiter']}>
                        <RecruiterDashboard />
                    </ProtectedRoute>
                }
            />
        </Routes>
    </Router>
</AuthProvider>
```

**Protection Mechanism:**
- `ProtectedRoute` component checks authentication status and user role.
- Redirects unauthorized users to `/login`.
- Prevents role escalation (e.g., applicants cannot access recruiter routes).
