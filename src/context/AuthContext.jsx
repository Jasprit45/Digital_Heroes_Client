import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { setAccessToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true);

  const updateAuth = (tokenVal, userVal) => {
    setTokenState(tokenVal);
    setAccessToken(tokenVal);
    if (userVal) {
      setUser(userVal);
    }
  };

  const fetchProfile = useCallback(async () => {
    try {
      // Attempt fetching profile via /auth/me or /user/profile
      const res = await api.get('/auth/me').catch(() => api.get('/user/profile'));
      const userData = res.data?.user || res.data?.data?.user || res.data?.data || res.data;
      setUser(userData);
      return userData;
    } catch (err) {
      console.error('Failed to fetch profile', err);
      return null;
    }
  }, []);

  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      // Try refresh endpoint to restore session on page reload
      const res = await api.post('/auth/refresh');
      const newToken = res.data?.access_token || res.data?.accessToken || res.data?.data?.access_token;
      if (newToken) {
        setTokenState(newToken);
        setAccessToken(newToken);
        const userData = res.data?.user || res.data?.data?.user;
        if (userData) {
          setUser(userData);
        } else {
          await fetchProfile();
        }
      }
    } catch (err) {
      setTokenState(null);
      setAccessToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [fetchProfile]);

  useEffect(() => {
    checkAuth();

    const handleSessionExpired = () => {
      setTokenState(null);
      setAccessToken(null);
      setUser(null);
    };

    window.addEventListener('auth:session_expired', handleSessionExpired);
    return () => window.removeEventListener('auth:session_expired', handleSessionExpired);
  }, [checkAuth]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const responseData = res.data?.data || res.data;
    const newToken = responseData?.access_token || responseData?.accessToken || responseData?.token;
    const userData = responseData?.user || responseData?.user_profile;

    if (newToken) {
      updateAuth(newToken, userData);
      if (!userData) {
        await fetchProfile();
      }
    }
    return res.data;
  };

  const register = async (fullName, email, password) => {
    const res = await api.post('/auth/register', {
      name: fullName,
      fullName: fullName,
      email,
      password,
    });
    
    // Auto-login or set token if backend returns token directly on register
    const responseData = res.data?.data || res.data;
    const newToken = responseData?.access_token || responseData?.accessToken || responseData?.token;
    const userData = responseData?.user;

    if (newToken) {
      updateAuth(newToken, userData);
    }
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setTokenState(null);
      setAccessToken(null);
      setUser(null);
    }
  };

  const refreshUserData = async () => {
    return await fetchProfile();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user || !!token,
        isSubscriber: user?.is_subscriber || user?.subscription_status === 'active' || user?.role === 'SUBSCRIBER' || user?.role === 'ADMIN',
        isAdmin: user?.role === 'ADMIN',
        login,
        register,
        logout,
        refreshUserData,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
