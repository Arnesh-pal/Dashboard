// src/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: '',           // relative URL = same domain in production
    withCredentials: true, // send cookies for session auth
});

export default axiosInstance;
