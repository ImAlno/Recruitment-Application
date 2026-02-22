import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type { ApiResponse } from '../types/api';
import { DEFAULT_API_CONFIG, HttpStatus } from '../types/api';
import i18n from '../i18n';

/**
 * API Client for interacting with the recruitment backend
 */
class ApiClient {
    private axiosInstance: AxiosInstance;

    /**
     * Initializes the Axios instance with base configuration.
     */
    constructor() {
        this.axiosInstance = axios.create({
            baseURL: DEFAULT_API_CONFIG.baseURL,
            timeout: DEFAULT_API_CONFIG.timeout,
            withCredentials: true, // Important for cookies/sessions
            headers: {
                'Content-Type': 'application/json'
            }
        });

        this.setupInterceptors();
    }

    /**
     * Sets up Axios interceptors for handling requests and responses globally.
     * Includes a response interceptor to handle 401 Unauthorized errors by clearing local session.
     */
    private setupInterceptors(): void {
        // Request interceptor
        this.axiosInstance.interceptors.request.use(
            (config) => {
                // Could add auth tokens here if needed
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor for global error handling
        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => {
                return response;
            },
            (error) => {
                if (error.response?.status === HttpStatus.UNAUTHORIZED) {
                    // Force logout on 401
                    localStorage.removeItem('user');
                    window.dispatchEvent(new Event('auth:logout'));
                    console.warn('Session expired - User logged out');
                }
                return Promise.reject(error);
            }
        );
    }

    /**
     * Handles API errors by translating them into user-friendly error messages using i18next.
     * 
     * @param {any} error - The error object from Axios.
     * @returns {never} Always throws an error.
     * @throws {Error} An error object containing the translated message and status code.
     */
    private handleApiError(error: any): never {
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;
            const message = data?.error || data?.message || i18n.t('common.error');
            const err: any = new Error(i18n.t('errors.serverError', { status, message }));
            err.status = status;
            throw err;
        } else if (error.request) {
            // Request was made but no response received
            const err: any = new Error(i18n.t('errors.networkError'));
            err.status = 0;
            throw err;
        } else {
            // Something else happened
            throw new Error(i18n.t('errors.requestError', { message: error.message }));
        }
    }

    /**
     * Extracts the success data from a standard API response envelope.
     * 
     * @template T
     * @param {AxiosResponse<ApiResponse<T>>} response - The Axios response object.
     * @returns {T} The unwrapped data from the response.
     * @throws {Error} If the response does not indicate success.
     */
    private extractSuccessData<T>(response: AxiosResponse<ApiResponse<T>>): T {
        if (response.data && 'success' in response.data && response.data.success) {
            return response.data.success;
        }
        throw new Error(i18n.t('errors.invalidResponse'));
    }

    /**
     * Performs a GET request to the specified URL.
     * 
     * @template T
     * @param {string} url - The endpoint URL.
     * @param {any} [params] - Optional query parameters.
     * @returns {Promise<T>} A promise resolving to the response data.
     * @throws {Error} If the request fails.
     */
    async get<T>(url: string, params?: any): Promise<T> {
        try {
            const response = await this.axiosInstance.get<ApiResponse<T>>(url, { params });
            return this.extractSuccessData(response);
        } catch (error) {
            this.handleApiError(error);
        }
    }

    /**
     * Performs a POST request to the specified URL.
     * 
     * @template T
     * @param {string} url - The endpoint URL.
     * @param {any} [data] - The request body data.
     * @returns {Promise<T>} A promise resolving to the response data.
     * @throws {Error} If the request fails.
     */
    async post<T>(url: string, data?: any): Promise<T> {
        try {
            const response = await this.axiosInstance.post<ApiResponse<T>>(url, data);
            return this.extractSuccessData(response);
        } catch (error) {
            this.handleApiError(error);
        }
    }

    /**
     * Performs a PUT request to the specified URL.
     * 
     * @template T
     * @param {string} url - The endpoint URL.
     * @param {any} [data] - The request body data.
     * @returns {Promise<T>} A promise resolving to the response data.
     * @throws {Error} If the request fails.
     */
    async put<T>(url: string, data?: any): Promise<T> {
        try {
            const response = await this.axiosInstance.put<ApiResponse<T>>(url, data);
            return this.extractSuccessData(response);
        } catch (error) {
            this.handleApiError(error);
        }
    }

    /**
     * Performs a PATCH request to the specified URL.
     * 
     * @template T
     * @param {string} url - The endpoint URL.
     * @param {any} [data] - The request body data.
     * @returns {Promise<T>} A promise resolving to the response data.
     * @throws {Error} If the request fails.
     */
    async patch<T>(url: string, data?: any): Promise<T> {
        try {
            const response = await this.axiosInstance.patch<ApiResponse<T>>(url, data);
            return this.extractSuccessData(response);
        } catch (error) {
            this.handleApiError(error);
        }
    }

    /**
     * Performs a DELETE request to the specified URL.
     * 
     * @template T
     * @param {string} url - The endpoint URL.
     * @returns {Promise<T>} A promise resolving to the response data.
     * @throws {Error} If the request fails.
     */
    async delete<T>(url: string): Promise<T> {
        try {
            const response = await this.axiosInstance.delete<ApiResponse<T>>(url);
            return this.extractSuccessData(response);
        } catch (error) {
            this.handleApiError(error);
        }
    }

    /**
     * Tests the connectivity to the API root.
     * 
     * @returns {Promise<string>} A promise resolving to a success message.
     */
    async testConnection(): Promise<string> {
        try {
            const response = await this.axiosInstance.get('/');
            return response.data || 'API is reachable';
        } catch (error) {
            this.handleApiError(error);
        }
    }
}

/**
 * Singleton instance of ApiClient.
 */
export const apiClient = new ApiClient();
