import axios from 'axios';

const axiosInstance = axios.create({
    // This points all API requests to your live Vercel backend
    baseURL: 'https://dashboard-henna-ten-79.vercel.app',
    withCredentials: true, // This sends cookies for session authentication
});

export default axiosInstance;