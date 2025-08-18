import { AUTH_REGISTER, AUTH_LOGIN, AUTH_LOGOUT, AUTH_REFRESH_TOKEN } from "@/utils/constants"
// Update the import path if "@/utils/axios" does not exist
import apiClient from "../utils/axios" // Import the configured axios instance

export const registerUser = async ({ name, email, password }) => {
    try {
        if (!name || !email || !password) {
            throw new Error('All fields are required')
        }
        
        if (!name.trim() || !email.trim() || !password.trim()) {
            throw new Error('All fields must contain valid data')
        }

        console.log("Making registration request to:", AUTH_REGISTER);
        console.log("Request payload:", { name, email, password: "***hidden***" });

        const response = await apiClient.post(AUTH_REGISTER, {
            name: name.trim(), 
            email: email.trim(), 
            password
        });

        console.log("Registration API response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Registration API error:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            url: AUTH_REGISTER
        });

        // Handle axios errors properly
        if (error.response) {
            // Server responded with error status
            const errorMessage = error.response.data?.message || `Registration failed (${error.response.status})`;
            throw new Error(errorMessage);
        } else if (error.request) {
            // Request made but no response
            throw new Error('Network error. Please check your connection and API URL.');
        } else {
            // Something else happened
            throw error;
        }
    }
}

export const loginUser = async ({ email, password }) => {
    try {
        if (!email.trim() || !password.trim()) {
            throw new Error('All fields are required')
        }
        const response = await apiClient.post(AUTH_LOGIN, {
            email, password
        })
        return response.data;
    } catch (error) {
        // Handle axios errors properly
        if (error.response) {
            // Server responded with error status
            throw new Error(error.response.data.message || 'Login failed');
        } else if (error.request) {
            // Request made but no response
            throw new Error('Network error. Please check your connection.');
        } else {
            // Something else happened
            throw error;
        }
    }
}

export const logoutUser = async () => {
    try {
        const token = localStorage.getItem('token');
        
        // Only call API if we have a token
        if (token && token !== 'undefined' && token !== 'null') {
            await apiClient.post(AUTH_LOGOUT, {});
        }
    } catch (error) {
        console.log("Logout API call failed, but proceeding with local cleanup:", error.message);
        // Don't throw error - we still want to clear local storage
    } finally {
        // Always clear local storage regardless of API call success/failure
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    }
}

export const authTokenRefresh = async () => {
    try {
        const response = await apiClient.post(AUTH_REFRESH_TOKEN, {})
        const data = response.data
        
        if (data.success && data.data && data.data.tokens) {
            localStorage.setItem('token', data.data.tokens.accessToken)
            localStorage.setItem('refreshToken', data.data.tokens.refreshToken)
            return data
        } else {
            throw new Error('Token refresh failed')
        }
    } catch (error) {
        // Clear tokens if refresh fails
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        
        if (error.response) {
            throw new Error(error.response.data.message || 'Token refresh failed');
        } else if (error.request) {
            throw new Error('Network error. Please check your connection.');
        } else {
            throw error;
        }
    }
}