import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const env = import.meta.env as Record<string, string | undefined>;
const rawApi = env.VITE_API_URL ;
let resolvedBase = '/api';
if (rawApi) {
  const r = rawApi.replace(/\/+$/u, '');
  resolvedBase = r.endsWith('/api') ? r : `${r}/api`;
}

const apiClient = axios.create({
  baseURL: resolvedBase,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor: attach JWT token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 (token expired)
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
