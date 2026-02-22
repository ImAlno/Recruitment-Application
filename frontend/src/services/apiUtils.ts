/**
 * Utility functions for API operations
 */

/**
 * API Error class for consistent error handling
 */
export class ApiError extends Error {
    public status?: number;
    public code?: string;

    /**
     * Creates an instance of ApiError.
     * @param {string} message - The error message.
     * @param {number} [status] - Optional HTTP status code.
     * @param {string} [code] - Optional error code.
     */
    constructor(message: string, status?: number, code?: string) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.code = code;
    }
}

/**
 * Parses an unknown error into a standardized ApiError object.
 * Handles Axios error responses and network errors.
 * 
 * @param {any} error - The error to parse.
 * @returns {ApiError} A standardized ApiError object.
 */
export function parseApiError(error: any): ApiError {
    if (error instanceof ApiError) {
        return error;
    }

    if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const data = error.response.data;

        let message = 'Unknown error';
        if (data?.error) {
            if (Array.isArray(data.error)) {
                // Validation errors array
                message = data.error.map((err: any) => err.msg || err.message).join(', ');
            } else if (typeof data.error === 'string') {
                message = data.error;
            }
        } else if (data?.message) {
            message = data.message;
        } else if (error.message) {
            message = error.message;
        }

        return new ApiError(message, status);
    }

    if (error.request) {
        // Request was made but no response received
        return new ApiError('Network error - unable to connect to server', 0, 'NETWORK_ERROR');
    }

    // Something else happened
    return new ApiError(error.message || 'Unknown error occurred', 0, 'UNKNOWN_ERROR');
}

/**
 * Checks if the given ApiError is related to authentication.
 * 
 * @param {ApiError} error - The error to check.
 * @returns {boolean} True if it is an authentication error.
 */
export function isAuthError(error: ApiError): boolean {
    return error.status === 401 || error.code === 'AUTH_ERROR';
}

/**
 * Checks if the given ApiError is related to validation.
 * 
 * @param {ApiError} error - The error to check.
 * @returns {boolean} True if it is a validation error.
 */
export function isValidationError(error: ApiError): boolean {
    return error.status === 400 || error.code === 'VALIDATION_ERROR';
}

/**
 * Checks if the given ApiError is related to network connectivity.
 * 
 * @param {ApiError} error - The error to check.
 * @returns {boolean} True if it is a network error.
 */
export function isNetworkError(error: ApiError): boolean {
    return error.status === 0 || error.code === 'NETWORK_ERROR';
}

/**
 * Formats an ApiError into a user-friendly display message.
 * 
 * @param {ApiError} error - The error to format.
 * @returns {string} A user-friendly error message.
 */
export function formatErrorMessage(error: ApiError): string {
    if (isNetworkError(error)) {
        return 'Unable to connect to the server. Please check your internet connection.';
    }

    if (isAuthError(error)) {
        return 'You need to be logged in to perform this action.';
    }

    if (isValidationError(error)) {
        return error.message || 'Invalid input provided.';
    }

    return error.message || 'An unexpected error occurred.';
}

/**
 * Retry configuration for API calls
 */
/**
 * Configuration options for retrying failed API calls.
 */
export interface RetryConfig {
    /** Maximum number of retry attempts. */
    maxRetries: number;
    /** Initial delay before retrying (in milliseconds). */
    retryDelay: number;
    /** Optional predicate to determine if a retry should be attempted based on the error. */
    retryCondition?: (error: ApiError) => boolean;
}

/**
 * Default retry configuration
 */
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
    maxRetries: 3,
    retryDelay: 1000,
    retryCondition: (error) => isNetworkError(error)
};

/**
 * Executes a function that returns a promise with retry logic.
 * Uses exponential backoff for retries.
 * 
 * @template T
 * @param {() => Promise<T>} fn - The function to execute.
 * @param {RetryConfig} [config=DEFAULT_RETRY_CONFIG] - Retry configuration.
 * @returns {Promise<T>} A promise resolving to the function's result.
 * @throws {ApiError} The last encountered error if all retries fail.
 */
export async function executeWithRetry<T>(
    fn: () => Promise<T>,
    config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<T> {
    let lastError: ApiError;

    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = parseApiError(error);

            // Don't retry on last attempt or if retry condition fails
            if (attempt === config.maxRetries ||
                (config.retryCondition && !config.retryCondition(lastError))) {
                throw lastError;
            }

            // Wait before retry with exponential backoff
            await new Promise(resolve =>
                setTimeout(resolve, config.retryDelay * Math.pow(2, attempt))
            );
        }
    }

    throw lastError!;
}

/**
 * Creates a debounced version of a function.
 * 
 * @template T
 * @param {T} func - The function to debounce.
 * @param {number} wait - The delay in milliseconds.
 * @returns {(...args: Parameters<T>) => void} A new debounced function.
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout>;

    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
