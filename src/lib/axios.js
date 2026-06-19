import axios from 'axios';
import { logout, setToken } from '@/redux/features/authSlice';
import store from '@/redux/store';

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: Attach access token to all outgoing requests
axiosInstance.interceptors.request.use(
  (config) => {
    const raw = localStorage.getItem('unimanagement');
    const token = raw ? JSON.parse(raw) : null;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Prevent multiple simultaneous refresh calls with a queue
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/refreshToken`,
      {},
      { withCredentials: true } // sends the refresh token cookie
    );

    const accessToken = response?.data?.data?.accessToken;

    if (accessToken) {
      localStorage.setItem('unimanagement', JSON.stringify(accessToken));
      store.dispatch(setToken(accessToken)); // keep Redux in sync
      return accessToken;
    }

    return null;
  } catch {
    // Refresh failed — clear everything and force logout
    localStorage.removeItem('unimanagement');
    store.dispatch(logout()); // plain action, clears Redux state immediately
    return null;
  }
};

// Response interceptor: Handle expired access token and retry original request
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isTokenExpired =
      error.response?.status === 401 &&
      error.response?.data?.message === 'JWT Expired';

    if (isTokenExpired && !originalRequest._retry) {
      // If already refreshing, queue this request until refresh completes
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const newToken = await refreshAccessToken();
      isRefreshing = false;

      if (newToken) {
        processQueue(null, newToken);
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } else {
        processQueue(error, null);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;