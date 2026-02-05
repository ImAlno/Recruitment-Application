# Frontend Features: Complete Pipeline Breakdown

This document provides an exhaustive, function-by-function explanation of the registration and login features.

---

## 1. Registration Feature - Complete Pipeline

The registration flow involves multiple layers working together: UI components, custom hooks, validation utilities, formatters, and API services.

### 1.1 Entry Point: RegisterPage Component

The [RegisterPage.tsx](frontend/src/pages/RegisterPage.tsx) is the UI layer that orchestrates the registration flow.

```tsx
// frontend/src/pages/RegisterPage.tsx
const RegisterPage = () => {
    const {
        formData,
        errors,
        isSubmitting,
        isCheckingUsername,
        isCheckingEmail,
        checkedValues,
        handleChange,
        handleSubmit,
        showPassword,
        setShowPassword,
        success,
        clearErrors
    } = useRegisterForm();

    return (
        <Layout>
            <Card>
                {!success ? (
                    // Registration form
                ) : (
                    // Success message with "Go to Login" button
                )}
            </Card>
        </Layout>
    );
};
```

**Responsibilities:**
- Renders form inputs
- Displays validation errors
- Shows loading states during async operations
- Handles success state transition

---

### 1.2 Core Logic: useRegisterForm Hook

The [useRegisterForm.ts](frontend/src/hooks/useRegisterForm.ts) hook manages all registration state and logic.

#### State Management

```typescript
// frontend/src/hooks/useRegisterForm.ts
const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    personNumber: '',
    username: '',
    password: ''
});
const [errors, setErrors] = useState<Record<string, string>>({});
const [isSubmitting, setIsSubmitting] = useState(false);
const [showPassword, setShowPassword] = useState(false);
const [success, setSuccess] = useState<string | null>(null);
```

**State Breakdown:**
- `formData`: Holds all input values
- `errors`: Maps field names to error messages
- `isSubmitting`: Prevents double-submission
- `showPassword`: Toggles password visibility
- `success`: Triggers success UI when registration completes

#### Input Handler with Auto-Formatting

```typescript
// frontend/src/hooks/useRegisterForm.ts
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    let { value } = e.target;

    // Auto-format person number as user types
    if (name === 'personNumber') {
        value = formatPersonNumber(value);
    }

    setFormData(prev => ({ ...prev, [name]: value }));

    // Trigger availability checks for username/email
    if (name === 'username' || name === 'email') {
        if (name === 'username') {
            const { isValid, error } = validateUsername(value);
            if (!isValid && error === 'Username contains invalid characters') {
                setErrors(prev => ({ ...prev, username: error }));
                setIsCheckingUsername(false);
            } else {
                setIsCheckingUsername(true);
                if (errors.username) {
                    setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.username;
                        return newErrors;
                    });
                }
            }
        }
        if (name === 'email') {
            if (validateEmail(value)) setIsCheckingEmail(true);
            else setIsCheckingEmail(false);

            if (errors.email) {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.email;
                    return newErrors;
                });
            }
        }
    } else if (errors[name]) {
        // Clear field error on change
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
        });
    }

    // Clear global submission errors
    if (errors.submit) {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.submit;
            return newErrors;
        });
    }
};
```

**Flow:**
1. Extract field name and value from event
2. Apply auto-formatting if field is `personNumber`
3. Update form data state
4. For username/email: trigger validation and set checking state
5. Clear existing errors for the changed field
6. Clear global submission errors

---

### 1.3 Auto-Formatting: formatPersonNumber

The [formatters.ts](frontend/src/utils/formatters.ts) utility formats the Swedish person number.

```typescript
// frontend/src/utils/formatters.ts
export const formatPersonNumber = (value: string): string => {
    // Remove all non-digits
    const raw = value.replace(/\D/g, '');
    // Limit to 12 digits (8 for date, 4 for number)
    const digits = raw.slice(0, 12);

    // Format as YYYYMMDD-XXXX
    if (digits.length > 8) {
        return `${digits.slice(0, 8)}-${digits.slice(8)}`;
    }
    return digits;
};
```

**Example:**
- Input: `19901225abcd1234`
- After removing non-digits: `199012251234`
- After formatting: `19901225-1234`

---

### 1.4 Real-time Availability: useAvailability Hook

The [useAvailability.ts](frontend/src/hooks/useAvailability.ts) hook checks if username/email are already taken.

```typescript
// frontend/src/hooks/useAvailability.ts
export const useAvailability = ({ formData, setErrors }: UseAvailabilityProps) => {
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
    const [checkedValues, setCheckedValues] = useState<{ username?: string, email?: string }>({});

    useEffect(() => {
        const check = async () => {
            const { isValid: isUsernameFormatValid } = validateUsername(formData.username);

            const needsUsernameCheck = formData.username && isUsernameFormatValid && formData.username !== checkedValues.username;
            const needsEmailCheck = formData.email && formData.email !== checkedValues.email && validateEmail(formData.email);

            if (needsUsernameCheck || needsEmailCheck) {
                const { usernameTaken, emailTaken } = await checkAvailability({
                    username: needsUsernameCheck ? formData.username : undefined,
                    email: needsEmailCheck ? formData.email : undefined
                });

                setErrors(prev => {
                    const newErrors = { ...prev };
                    if (needsUsernameCheck) {
                        if (usernameTaken) newErrors.username = 'Username already exists';
                        else delete newErrors.username;
                    }
                    if (needsEmailCheck) {
                        if (emailTaken) newErrors.email = 'Email already exists';
                        else delete newErrors.email;
                    }
                    return newErrors;
                });

                setCheckedValues(prev => ({
                    ...prev,
                    ...(needsUsernameCheck ? { username: formData.username } : {}),
                    ...(needsEmailCheck ? { email: formData.email } : {})
                }));

                if (needsUsernameCheck) setIsCheckingUsername(false);
                if (needsEmailCheck) setIsCheckingEmail(false);
            }
        };

        const timer = setTimeout(check, 500); // Debounce for 500ms
        return () => clearTimeout(timer);
    }, [formData.username, formData.email, checkedValues, setErrors]);

    return {
        isCheckingUsername,
        isCheckingEmail,
        setIsCheckingUsername,
        setIsCheckingEmail,
        checkedValues
    };
};
```

**Pipeline:**
1. **Debouncing**: Wait 500ms after user stops typing
2. **Format validation**: Check if username/email format is valid
3. **Deduplication**: Only check if value differs from last checked value
4. **API call**: Send request to backend via `checkAvailability`
5. **Error handling**: Update errors state with "already exists" message or clear error
6. **State update**: Mark values as checked, clear loading states

---

### 1.5 Validation Utilities

The [validation.ts](frontend/src/utils/validation.ts) file contains all validation logic.

#### Email Validation

```typescript
// frontend/src/utils/validation.ts
export const validateEmail = (email: string): boolean => {
    return /\S+@\S+\.\S+/.test(email);
};
```

#### Username Validation

```typescript
// frontend/src/utils/validation.ts
export const validateUsername = (username: string): { isValid: boolean; error?: string } => {
    if (/[^a-zA-Z0-9.,_-]/.test(username)) {
        return { isValid: false, error: 'Username contains invalid characters' };
    }
    const usernameRegex = /^[a-zA-Z0-9.,_-]{6,30}$/;
    if (!usernameRegex.test(username)) {
        return { isValid: false, error: 'Username format is invalid' };
    }
    return { isValid: true };
};
```

**Validation Rules:**
1. Only allows: letters, numbers, `.`, `,`, `_`, `-`
2. Length: 6-30 characters
3. Returns structured object with `isValid` and optional `error`

#### Password Validation

```typescript
// frontend/src/utils/validation.ts
export const passwordRequirements: Requirement[] = [
    { label: 'Minimum 6 characters', test: (p: string) => p.length >= 6, errorCode: 'min_length' },
    { label: 'At least 1 uppercase', test: (p: string) => /[A-Z]/.test(p), errorCode: 'uppercase' },
    { label: 'At least 1 lowercase', test: (p: string) => /[a-z]/.test(p), errorCode: 'lowercase' },
    { label: 'At least 1 number', test: (p: string) => /\d/.test(p), errorCode: 'number' },
    { label: 'At least 1 special character', test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p), errorCode: 'special' }
];

export const getPasswordErrors = (password: string): string[] => {
    return passwordRequirements
        .filter(req => !req.test(password))
        .map(req => req.label.replace('At least 1 ', '').toLowerCase());
};

export const formatPasswordErrorMessage = (errors: string[]): string => {
    if (errors.length === 0) return '';
    return `Password must include: ${errors.join(', ')}`;
};
```

**Usage:**
- `passwordRequirements`: Array of requirement objects for UI checklist
- `getPasswordErrors`: Returns array of failed requirements
- `formatPasswordErrorMessage`: Converts errors to user-friendly message

---

### 1.6 Form Validation

```typescript
// frontend/src/hooks/useRegisterForm.ts
const validate = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';

    if (!formData.email) {
        newErrors.email = 'Email address is required';
    } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Email is invalid';
    }

    if (!formData.personNumber) {
        newErrors.personNumber = 'Person number is required';
    }

    if (!formData.username) {
        newErrors.username = 'Username is required';
    } else {
        const { isValid, error } = validateUsername(formData.username);
        if (!isValid) {
            newErrors.username = error || 'Invalid username';
        }
    }

    if (!formData.password) {
        newErrors.password = 'Password is required';
    } else {
        const passwordReqs = getPasswordErrors(formData.password);
        if (passwordReqs.length > 0) {
            newErrors.password = formatPasswordErrorMessage(passwordReqs);
        }
    }

    setErrors(prev => {
        const fieldsToClear = ['firstName', 'lastName', 'email', 'personNumber', 'username', 'password'];
        const updated = { ...prev };

        fieldsToClear.forEach(field => {
            if (newErrors[field]) {
                updated[field] = newErrors[field];
            } else {
                const current = prev[field];
                const isAsyncError = current?.includes('already exists');
                if (!isAsyncError) {
                    delete updated[field];
                }
            }
        });

        return updated;
    });

    return newErrors;
};
```

**Logic:**
1. Check all required fields
2. Validate email format
3. Validate username format and requirements
4. Validate password requirements
5. Preserve async errors (from availability checks)
6. Return errors object

---

### 1.7 Form Submission

```typescript
// frontend/src/hooks/useRegisterForm.ts
const handleSubmit = async () => {
    const formatErrors = validate();
    const hasFormatErrors = Object.keys(formatErrors).length > 0;
    const hasAsyncErrors = errors.username?.includes('exists') || errors.email?.includes('exists');

    if (hasFormatErrors || hasAsyncErrors) return;

    setIsSubmitting(true);
    setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.submit;
        return newErrors;
    });

    try {
        await registerApplicant(formData);
        setSuccess('Account created successfully! You can now login.');
    } catch (error) {
        setErrors(prev => ({
            ...prev,
            submit: error instanceof Error ? error.message : 'Registration failed. Please try again.'
        }));
        setIsSubmitting(false);
    }
};
```

**Submission Flow:**
1. Run full validation
2. Check for async errors (username/email taken)
3. Exit if any errors exist
4. Set submitting state (disables button)
5. Clear previous submission errors
6. Call `registerApplicant` service
7. On success: Set success state (triggers success UI)
8. On error: Display error message, re-enable button

---

## 2. Login Feature - Complete Pipeline

### 2.1 Entry Point: LoginPage Component

The [LoginPage.tsx](frontend/src/pages/LoginPage.tsx) handles user authentication.

```typescript
// frontend/src/pages/LoginPage.tsx
const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const user = await authService.login(username, password);
            
            login(user);

            if (user.role === 'recruiter') {
                navigate('/recruiter/dashboard');
            } else {
                navigate('/applicant/dashboard');
            }
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Invalid credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <Card>
                <form onSubmit={handleSubmit}>
                    <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>
            </Card>
        </Layout>
    );
};
```

**Login Flow:**
1. User enters credentials
2. Form submission prevented from default behavior
3. Clear previous errors, set loading state
4. Call `authService.login()` with credentials
5. On success: Update global auth context, navigate to dashboard
6. On error: Display error message
7. Always: Clear loading state

---

### 2.2 Authentication Context

The [AuthContext.tsx](frontend/src/context/AuthContext.tsx) manages global authentication state.

#### Context Definition

```typescript
// frontend/src/context/AuthContext.tsx
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
```

#### Provider Implementation

```typescript
// frontend/src/context/AuthContext.tsx
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        // Restore user from localStorage on initial load
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    useEffect(() => {
        const handleLogout = () => {
            setUser(null);
            localStorage.removeItem('user');
        };

        window.addEventListener('auth:logout', handleLogout);

        return () => {
            window.removeEventListener('auth:logout', handleLogout);
        };
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = async () => {
        try {
            await authService.logout();
        } finally {
            setUser(null);
            localStorage.removeItem('user');
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
```

**Key Mechanisms:**

1. **Session Restoration:**
   - On app load, check `localStorage` for saved user
   - Parse and restore user object
   - Enables persistence across page refreshes

2. **Login Function:**
   - Updates context state with user object
   - Saves to `localStorage` for persistence
   - Triggers re-render of all consuming components

3. **Logout Function:**
   - Calls backend logout endpoint
   - Clears context state
   - Removes from `localStorage`
   - Uses `finally` to ensure cleanup even if API fails

4. **Event Listener:**
   - Listens for `auth:logout` custom event
   - Triggered by API interceptor on 401 errors
   - Enables automatic logout on session expiration

#### useAuth Hook

```typescript
// frontend/src/context/AuthContext.tsx
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
```

**Usage in Components:**
```typescript
const { user, isAuthenticated, login, logout } = useAuth();
```

---

## 3. Protected Routes

Protected routes ensure only authenticated users with correct roles can access certain pages.

```typescript
// frontend/src/components/ProtectedRoute.tsx
interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        } else if (user && !allowedRoles.includes(user.role)) {
            navigate('/error');
        }
    }, [isAuthenticated, user, allowedRoles, navigate]);

    if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
        return null;
    }

    return <>{children}</>;
};
```

**Protection Logic:**
1. Check if user is authenticated
2. If not: Redirect to login
3. If authenticated: Check if user's role is in `allowedRoles`
4. If role not allowed: Redirect to error page
5. If all checks pass: Render protected content
