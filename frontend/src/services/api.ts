import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type { ApiResponse } from '../types/api';
import { DEFAULT_API_CONFIG, HttpStatus } from '../types/api';

/**
 * API Client for interacting with the recruitment backend
 */
class ApiClient {
    private axiosInstance: AxiosInstance;

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
     * Setup axios interceptors for error handling
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
     * Handle API errors consistently
     */
    private handleApiError(error: any): never {
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;
            const message = data?.error || data?.message || `HTTP ${status} error`;
            throw new Error(`${status}: ${message}`);
        } else if (error.request) {
            // Request was made but no response received
            throw new Error('Network error - no response from server');
        } else {
            // Something else happened
            throw new Error(`Request error: ${error.message}`);
        }
    }

    /**
     * Extract success data from API response
     */
    private extractSuccessData<T>(response: AxiosResponse<ApiResponse<T>>): T {
        if (response.data && 'success' in response.data && response.data.success) {
            return response.data.success;
        }
        throw new Error('Invalid API response format');
    }

    /**
     * GET request
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
     * POST request
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
     * PUT request
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
     * PATCH request
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
     * DELETE request
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
     * Test API connectivity
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

// Export singleton instance
export const apiClient = new ApiClient();
