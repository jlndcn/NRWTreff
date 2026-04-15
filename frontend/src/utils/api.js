import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

export const API_BASE = `${BACKEND_URL}/api`;

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // Enable cookies
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear any local user state - actual token is in httpOnly cookie
      localStorage.removeItem('admin_user');
      // Optionally redirect to login
      if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export const UPLOADS_URL = `${BACKEND_URL}/api/uploads`;

export const getImageUrl = (photo) => {
  if (!photo) return null;
  if (photo.url) return `${BACKEND_URL}${photo.url}`;
  return null;
};

export default api;
