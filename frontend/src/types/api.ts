/**
 * API Response wrapper type
 */
export interface ApiResponse<T> {
    success: T;
}

/**
 * HTTP Status codes
 */
export const HttpStatus = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
} as const;

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
    // Auth endpoints
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    CHECK_AVAILABILITY: '/auth/availability',
    LOGOUT: '/auth/logout',

    // Application endpoints
    SUBMIT_APPLICATION: '/application/submit',
    GET_APPLICATIONS: '/admin/applications',
    GET_APPLICATION: (id: number) => `/admin/applications/${id}`,
    UPDATE_APPLICATION_STATUS: (id: number) => `/application/${id}/status`,
};

/**
 * Default API configuration
 */
export const DEFAULT_API_CONFIG = {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    timeout: 10000,
};
