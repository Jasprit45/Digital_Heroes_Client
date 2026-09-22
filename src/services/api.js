import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://digital-heroes-backend-nine.vercel.app/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let accessToken = null;
let refreshTokenPromise = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

// Request Interceptor: Attach Access Token
api.interceptors.request.use(
  (config) => {
    if (accessToken && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: 401 Refresh Handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Avoid infinite refresh loops for auth endpoints
    const isAuthEndpoint = originalRequest.url?.includes('/auth/login') ||
                           originalRequest.url?.includes('/auth/register') ||
                           originalRequest.url?.includes('/auth/refresh');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      if (!refreshTokenPromise) {
        refreshTokenPromise = api.post('/auth/refresh')
          .then((res) => {
            // Adapt token property depending on backend response shape
            const newToken = res.data?.access_token || res.data?.accessToken || res.data?.data?.access_token;
            if (newToken) {
              setAccessToken(newToken);
              return newToken;
            }
            throw new Error('Failed to extract access token');
          })
          .catch((refreshError) => {
            setAccessToken(null);
            return Promise.reject(refreshError);
          })
          .finally(() => {
            refreshTokenPromise = null;
          });
      }

      try {
        const newToken = await refreshTokenPromise;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshErr) {
        // Broadcast session expiry if needed
        window.dispatchEvent(new CustomEvent('auth:session_expired'));
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
