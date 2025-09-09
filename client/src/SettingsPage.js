import React from 'react';
import { useState, useEffect } from 'react';
// ✅ Changed this line to use your configured axios instance
import axios from './axiosInstance';

function SettingsPage() {
    const [user, setUser] = useState({ displayName: '', email: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // This request will now correctly go to http://localhost:5001/api/profile
                const res = await axios.get('/api/profile');
                setUser(res.data);
            } catch (error) {
                console.error("Failed to fetch profile", error);
                setError('Could not load your profile data.');
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            await axios.post('/api/profile', {
                displayName: user.displayName,
                email: user.email
            });
            setMessage('Profile updated successfully!');
        } catch (error) {
            setError('Failed to update profile.');
            console.error('Failed to update profile', error);
        }
    };

    return (
        <div className="p-4 md:p-8">
            <div className="max-w-md mx-auto">
                <h2 className="text-xl font-bold mb-4">Your Settings</h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Display Name</label>
                            <input type="text" name="displayName" value={user.displayName || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input type="email" name="email" value={user.email || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                        </div>

                        {message && <p className="text-sm text-green-600 mb-4">{message}</p>}
                        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

                        <button type="submit" className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600">
                            Save Changes
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SettingsPage;
