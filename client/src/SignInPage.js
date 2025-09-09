import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from './axiosInstance'; // axios with baseURL + token interceptor

const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 9.92C34.553 6.184 29.654 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039L38.802 9.92C34.553 6.184 29.654 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.222 0-9.519-3.317-11.284-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path>
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 36.426 44 30.836 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
    </svg>
);

function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axiosInstance.post('/api/login', { email, password });

            if (res.data && res.data.token) {
                localStorage.setItem('token', res.data.token);
                navigate('/dashboard');
            } else {
                setError("Login succeeded, but no token was received.");
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="min-h-screen font-sans text-gray-800 bg-gray-50 flex">
            {/* Left side */}
            <div className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-tr from-blue-500 to-purple-500 relative p-12">
                <div className="absolute inset-0 bg-white opacity-10"></div>
                <h1 className="text-6xl font-black text-white z-10">Board.</h1>
            </div>

            {/* Form side */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md">
                    <div className="text-center lg:text-left mb-10">
                        <h1 className="text-4xl font-bold">Sign In</h1>
                        <p className="text-gray-500 mt-2">Sign in to continue</p>
                    </div>

                    <a
                        href={`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001'}/auth/google`}
                        className="w-full flex items-center justify-center py-3 px-4 border border-gray-200 rounded-xl shadow-sm text-md font-medium text-gray-700 bg-white hover:bg-gray-100"
                    >
                        <GoogleIcon />
                        Sign in with Google
                    </a>

                    <div className="my-6 flex items-center">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink mx-4 text-gray-400 text-sm">or</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="text-sm font-medium text-gray-600">Email address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-2 block w-full text-lg px-4 py-3 border border-gray-200 rounded-xl"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-2 block w-full text-lg px-4 py-3 border border-gray-200 rounded-xl"
                                required
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm text-center font-bold">{error}</p>}

                        <button
                            type="submit"
                            className="w-full py-4 px-4 border border-transparent rounded-xl text-md font-semibold text-white bg-blue-500 hover:bg-blue-600">
                            Sign In
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/signup" className="font-semibold text-blue-500 hover:text-blue-700">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignInPage;