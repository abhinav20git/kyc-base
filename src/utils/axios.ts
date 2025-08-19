import axios from 'axios';
import { API_BASE, AUTH_REFRESH_TOKEN } from '@/utils/constants';


const apiClient = axios.create({
  baseURL: API_BASE, 
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});


apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && token !== 'undefined' && token !== 'null') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

  
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken && refreshToken !== 'undefined' && refreshToken !== 'null') {
          
          const response = await axios.post(AUTH_REFRESH_TOKEN, {}, {
            withCredentials: true,
            headers: {
              'Authorization': `Bearer ${refreshToken}`
            }
          });

          if (response.data.success && response.data.data.tokens) {
            
            localStorage.setItem('token', response.data.data.tokens.accessToken);
            localStorage.setItem('refreshToken', response.data.data.tokens.refreshToken);
            
            originalRequest.headers.Authorization = `Bearer ${response.data.data.tokens.accessToken}`;
            
            
            return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
    
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        
        window.dispatchEvent(new Event('authStateChanged'));
        
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;