import axios from 'axios';

// API Base URL - Change this for different environments
const API_BASE_URL = 'http://crmapi.vizon-x.com/api/v1';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
    (config) => {
        // const token = localStorage.getItem('accessToken');
        // if (token) {
            config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzNDUwZGFhNy0xZTQzLTQ1YzMtYjMyZS00YjM2ODg3MjJhNWYiLCJlbWFpbCI6ImNybWFwaUBleGFtcGxlLmNvbSIsInRlbmFudElkIjoiYjIyNDllMWQtZDUyZS00YzZiLTk1MzAtODEzNzg0NDNkNzJiIiwicm9sZUlkIjoiMTAyODUwZTEtOWY2ZS00OTUwLTgwM2QtZGVlYWIzNWY0NjA2Iiwicm9sZU5hbWUiOiJBZG1pbiIsImlzUGxhdGZvcm1BZG1pbiI6ZmFsc2UsImlhdCI6MTc2ODQwNDk5MSwiZXhwIjoxNzY4NDkxMzkxfQ.2CYAj1KC4XTs-vzuZfcovn7DRS_w7x0dVen3FrI7jtA`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized - redirect to login
        if (error.response?.status === 401) {
            localStorage.removeItem('accessToken');
            // Optionally redirect to login page
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
