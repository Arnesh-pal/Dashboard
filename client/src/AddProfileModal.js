import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddProfileModal({ isOpen, onClose, onSuccess, profileToEdit }) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', instagram: '', youtube: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (profileToEdit) {
            setIsEditMode(true);
            setFormData(profileToEdit);
        } else {
            setIsEditMode(false);
            setFormData({ name: '', email: '', phone: '', instagram: '', youtube: '' });
        }
    }, [profileToEdit, isOpen]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleClose = () => {
        setFormData({ name: '', email: '', phone: '', instagram: '', youtube: '' });
        setStep(1);
        setError('');
        setIsLoading(false);
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            if (isEditMode) {
                await axios.put(`/api/profiles/${profileToEdit.id}`, formData);
            } else {
                await axios.post('/api/profiles', formData);
            }
            onSuccess();
            handleClose();
        } catch (err) {
            setError('Failed to save profile. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-lg relative">
                <button onClick={handleClose} className="absolute top-4 right-4 text-2xl font-light">&times;</button>
                <h2 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit Profile' : 'Add New Profile'}</h2>
                <div className="flex mb-6">
                    <div className="w-1/2 text-center cursor-pointer" onClick={() => setStep(1)}><h3 className={`font-bold ${step === 1 ? 'text-black' : 'text-gray-400'}`}>Basic</h3><div className={`h-1 mt-2 mx-auto rounded-full ${step === 1 ? 'bg-blue-500' : 'bg-gray-200'}`} style={{ width: '80%' }}></div></div>
                    <div className="w-1/2 text-center cursor-pointer" onClick={() => setStep(2)}><h3 className={`font-bold ${step === 2 ? 'text-black' : 'text-gray-400'}`}>Social</h3><div className={`h-1 mt-2 mx-auto rounded-full ${step === 2 ? 'bg-blue-500' : 'bg-gray-200'}`} style={{ width: '80%' }}></div></div>
                </div>
                <form onSubmit={handleSubmit}>
                    {step === 1 ? (
                        <div>
                            <div className="mb-4"><label className="block text-sm font-medium">Enter Name*</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border rounded-md py-2 px-3" required /></div>
                            <div className="mb-4"><label className="block text-sm font-medium">Enter Email*</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full border rounded-md py-2 px-3" required /></div>
                            <div className="mb-4"><label className="block text-sm font-medium">Enter Phone*</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full border rounded-md py-2 px-3" required /></div>
                            <div className="flex justify-end mt-8"><button type="button" onClick={() => setStep(2)} className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg">Next</button></div>
                        </div>
                    ) : (
                        <div>
                            <div className="mb-4"><label className="block text-sm font-medium">Instagram Link <span className="text-gray-400">(Optional)</span></label><input type="text" name="instagram" value={formData.instagram || ''} onChange={handleChange} className="mt-1 block w-full border rounded-md py-2 px-3" /></div>
                            <div className="mb-4"><label className="block text-sm font-medium">Youtube Link <span className="text-gray-400">(Optional)</span></label><input type="text" name="youtube" value={formData.youtube || ''} onChange={handleChange} className="mt-1 block w-full border rounded-md py-2 px-3" /></div>
                            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                            <div className="flex justify-end mt-8">
                                <button type="button" onClick={() => setStep(1)} className="bg-gray-200 font-bold py-2 px-6 rounded-lg mr-4" disabled={isLoading}>Back</button>
                                <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg" disabled={isLoading}>{isLoading ? 'Saving...' : 'Done'}</button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
export default AddProfileModal;