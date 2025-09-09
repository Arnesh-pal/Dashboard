import axios from 'axios';

// This will use the Vercel URL in production and localhost in development
const baseURL = process.env.NODE_ENV === 'production'
    ? 'https://dashboard-henna-ten-79.vercel.app' // Your live Vercel backend URL
    : 'http://localhost:5001';                   // Your local backend URL

const axiosInstance = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});

// Add JWT token to every request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
