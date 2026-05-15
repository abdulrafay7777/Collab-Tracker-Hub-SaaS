import axios from 'axios';
import { useAuth } from '../context/AuthContext';

/**
 * Setup axios interceptors for authentication
 * Adds Bearer token to all API requests
 */
export const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(
    (config) => {
      // Get mock token from localStorage or create one
      let token = localStorage.getItem('mockAuthToken');
      
      if (!token) {
        // Create a simple mock JWT-like token for demo purposes
        token = btoa(JSON.stringify({
          id: 'mock-user-id',
          role: 'manager',
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 86400
        }));
        localStorage.setItem('mockAuthToken', token);
      }
      
      // Add Bearer token to Authorization header
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle 401 errors
      if (error.response?.status === 401) {
        console.error('Unauthorized - clearing token');
        localStorage.removeItem('mockAuthToken');
      }
      return Promise.reject(error);
    }
  );
};

export default axios;
