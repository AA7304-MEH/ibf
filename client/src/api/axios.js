import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Credentials (cookies) are handled automatically by withCredentials: true
// Interceptors can be used for global error handling (e.g., 401 logout)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Optional: handle auto-logout or redirect
        }
        return Promise.reject(error);
    }
);

export default api;
