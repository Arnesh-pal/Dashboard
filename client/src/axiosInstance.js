import axios from 'axios';

const instance = axios.create({
    baseURL: '', // relative URL works for production on Vercel/Netlify
    withCredentials: true, // important for session cookies
});

export default instance;
