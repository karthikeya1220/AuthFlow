import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true, // Important for sending/receiving HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Variable to store the access token in memory
let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

// Request interceptor to attach access token
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401s and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token. 
        // The refresh token is in the HttpOnly cookie, so it's sent automatically.
        const res = await axios.post(
          'http://localhost:5000/api/v1/auth/refresh',
          {},
          { withCredentials: true }
        );

        if (res.status === 200) {
          const newAccessToken = res.data.accessToken;
          setAccessToken(newAccessToken);
          
          // Retry the original request with the new token
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (err) {
        // If refresh fails, user needs to log in again
        setAccessToken(null);
        // We will trigger a custom event or let AuthContext handle the redirect
        window.dispatchEvent(new Event('auth:unauthorized'));
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
