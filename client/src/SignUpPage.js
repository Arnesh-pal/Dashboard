import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post('/auth/register', { email, password, displayName });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen font-sans text-gray-800 bg-gray-50 flex">
            {/* Decorative Left Side */}
            <div className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-tr from-purple-500 to-blue-500 relative p-12">
                <div className="absolute inset-0 bg-white opacity-10"></div>
                <h1 className="text-6xl font-black text-white z-10 animate-fade-in-down">Board.</h1>
            </div>

            {/* Form Right Side */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md">
                    <div className="text-center lg:text-left mb-10">
                        <h1 className="text-4xl font-bold">Create an Account</h1>
                        <p className="text-gray-500 mt-2">Join us and start managing your dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="text-sm font-medium text-gray-600">Display Name</label>
                            <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                                className="mt-2 block w-full text-lg px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-purple-500 focus:border-purple-500 transition-all duration-300" placeholder="e.g., John Doe" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Email address*</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                className="mt-2 block w-full text-lg px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-purple-500 focus:border-purple-500 transition-all duration-300" required />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Password*</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                className="mt-2 block w-full text-lg px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-purple-500 focus:border-purple-500 transition-all duration-300" required />
                        </div>

                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                        <button type="submit"
                            className="w-full py-4 px-4 border border-transparent rounded-xl shadow-lg text-md font-semibold text-white bg-purple-500 hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform hover:-translate-y-1 transition-all duration-300">
                            Create Account
                        </button>
                    </form>
                    <p className="mt-8 text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-purple-500 hover:text-purple-700">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignUpPage;