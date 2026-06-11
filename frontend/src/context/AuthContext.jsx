import React, { createContext, useState, useContext, useEffect } from 'react';
import api, { setAccessToken } from '../api/axiosInstance';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we already have an active session
    const initializeAuth = async () => {
      try {
        const res = await api.post('/auth/refresh');
        if (res.data.accessToken) {
          setAccessToken(res.data.accessToken);
          setUser(res.data.user);
        }
      } catch (err) {
        // Ignore, user is just not logged in
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const handleUnauthorized = () => {
      setUser(null);
      setAccessToken(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setAccessToken(res.data.accessToken);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    // After registration, login automatically or redirect? 
    // Backend doesn't return token on register, only 201 status.
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
