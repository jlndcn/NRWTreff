import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated via httpOnly cookie
    const savedUser = localStorage.getItem('admin_user');
    if (savedUser) {
      // Verify cookie-based session is still valid
      api.get('/auth/verify')
        .then(() => {
          setUser(savedUser);
        })
        .catch(() => {
          localStorage.removeItem('admin_user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    // Token is now in httpOnly cookie, we just store username for UI
    localStorage.setItem('admin_user', username);
    setUser(username);
    return response.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // Silently handle logout error
    }
    localStorage.removeItem('admin_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;
