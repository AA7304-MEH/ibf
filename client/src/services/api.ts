import axios, { AxiosInstance } from 'axios';

// Define extended interface
interface ExtendedAxiosInstance extends AxiosInstance {
    calculateEquity: (data: any) => Promise<any>;
    calculateCulture: (data: any) => Promise<any>;
    predictValue: (data: any) => Promise<any>;
    createPaymentIntent: (amount: number, currency?: string) => Promise<any>;
}

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
}) as ExtendedAxiosInstance;

// Symbiosis Engine
api.calculateEquity = (data: any) => api.post('/symbiosis/equity', data);
api.calculateCulture = (data: any) => api.post('/symbiosis/culture', data);
api.predictValue = (data: any) => api.post('/symbiosis/value', data);

// Payments
api.createPaymentIntent = (amount: number, currency = 'usd') => api.post('/payments/create-payment-intent', { amount, currency });

// Add a request interceptor to attach the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
