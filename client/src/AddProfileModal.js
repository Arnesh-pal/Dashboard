import React, { useState, useEffect } from 'react';
// ✅ Changed this line to use your configured axios instance
import axios from './axiosInstance';

function AddProfileModal({ isOpen, onClose, onSuccess, profileToEdit }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [instagram, setInstagram] = useState('');
    const [youtube, setYoutube] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (profileToEdit) {
            setName(profileToEdit.name || '');
            setEmail(profileToEdit.email || '');
            setPhone(profileToEdit.phone || '');
            setInstagram(profileToEdit.instagram || '');
            setYoutube(profileToEdit.youtube || '');
        } else {
            // Reset form when adding a new profile
            setName(''); setEmail(''); setPhone(''); setInstagram(''); setYoutube('');
        }
        setError('');
    }, [profileToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const profileData = { name, email, phone, instagram, youtube };

        try {
            if (profileToEdit) {
                // This will now correctly PUT to http://localhost:5001/api/profiles/:id
                await axios.put(`/api/profiles/${profileToEdit.id}`, profileData);
            } else {
                // This will correctly POST to http://localhost:5001/api/profiles
                await axios.post('/api/profiles', profileData);
            }
            onSuccess();
            onClose();
        } catch (err) {
            setError('Failed to save profile. Please try again.');
            console.error("Profile save error:", err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">{profileToEdit ? 'Edit Profile' : 'Add New Profile'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Name*</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full border rounded p-2" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Email*</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full border rounded p-2" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Phone*</label>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full border rounded p-2" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Instagram Link (Optional)</label>
                        <input type="url" value={instagram} onChange={(e) => setInstagram(e.target.value)} className="mt-1 w-full border rounded p-2" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">YouTube Link (Optional)</label>
                        <input type="url" value={youtube} onChange={(e) => setYoutube(e.target.value)} className="mt-1 w-full border rounded p-2" />
                    </div>

                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddProfileModal;