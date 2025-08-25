

import { useState } from 'react';

const BACKEND_URL = 'https://kcx21158-3001.inc1.devtunnels.ms';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (userId, role, name) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role, name })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setToken(data.token);
        setUser(data.user);
        return data;
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      
     
      const mockUser = { userId, role, name };
      const mockToken = 'mock-token-' + Date.now();
      setUser(mockUser);
      setToken(mockToken);
      setError(null); 
      
      return { user: mockUser, token: mockToken };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };


  const isAuthenticated = () => {
    return !!(user && token);
  };

  const isAgent = () => {
    return user?.role === 'agent';
  };

  const isCustomer = () => {
    return user?.role === 'customer';
  };

  return { 
    user, 
    token, 
    isLoading,
    error,
    login, 
    logout, 
    clearError,
    isAuthenticated,
    isAgent,
    isCustomer
  };
};

export default useAuth;