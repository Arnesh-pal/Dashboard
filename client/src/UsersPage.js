import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AddProfileModal from './AddProfileModal'; // We need the modal here now

const InstagramIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.585-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.585-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.07-1.645-.07-4.85s.012-3.585.07-4.85c.148-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.441 1.441 1.441 1.441-.645 1.441-1.441-.645-1.44-1.441-1.44z" /></svg>;
const YouTubeIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>;

function UsersPage({ dataVersion, onDataChange }) {
    const [profiles, setProfiles] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [profileToEdit, setProfileToEdit] = useState(null);

    const fetchProfiles = useCallback(async () => {
        try {
            const res = await axios.get('/api/users');
            setProfiles(res.data);
        } catch (error) {
            console.error("Failed to fetch profiles", error);
        }
    }, []);

    useEffect(() => {
        fetchProfiles();
    }, [fetchProfiles, dataVersion]);

    const handleAddProfile = () => {
        setProfileToEdit(null);
        setIsModalOpen(true);
    };

    const handleEditProfile = (profile) => {
        setProfileToEdit(profile);
        setIsModalOpen(true);
    };

    const handleDeleteProfile = async (id) => {
        if (window.confirm('Are you sure you want to delete this profile?')) {
            await axios.delete(`/api/profiles/${id}`);
            fetchProfiles();
            onDataChange(); // Refresh dashboard stats
        }
    };

    const handleSuccess = () => {
        fetchProfiles();
        onDataChange();
    };

    return (
        <>
            <div className="p-4 md:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">User Profiles</h1>
                    <button onClick={handleAddProfile} className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600">
                        + Add Profile
                    </button>
                </div>
                {profiles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {profiles.map(p => (
                            <div key={p.id} className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold text-xl text-gray-800 truncate">{p.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{p.phone}</p>
                                    <p className="text-sm text-blue-500 truncate">{p.email}</p>
                                </div>
                                <div className="flex items-center mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex-grow flex space-x-4">
                                        {p.instagram && <a href={p.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500"><InstagramIcon /></a>}
                                        {p.youtube && <a href={p.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-600"><YouTubeIcon /></a>}
                                    </div>
                                    <div className="flex space-x-4">
                                        <button onClick={() => handleEditProfile(p)} className="text-sm text-blue-600 font-semibold">Edit</button>
                                        <button onClick={() => handleDeleteProfile(p.id)} className="text-sm text-red-600 font-semibold">Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 mt-4">No profiles added yet. Click "Add Profile" to get started.</p>
                )}
            </div>
            <AddProfileModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccess}
                profileToEdit={profileToEdit}
            />
        </>
    );
}

export default UsersPage;