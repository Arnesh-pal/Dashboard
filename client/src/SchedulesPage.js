import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function SchedulesPage() {
    const [schedules, setSchedules] = useState([]);
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [time, setTime] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editedData, setEditedData] = useState({});

    const fetchSchedules = useCallback(async () => {
        const res = await axios.get('/api/schedules');
        setSchedules(res.data);
    }, []);

    useEffect(() => {
        fetchSchedules();
    }, [fetchSchedules]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('/api/schedules', { title, location, time });
        setTitle('');
        setLocation('');
        setTime('');
        fetchSchedules();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this schedule?')) {
            await axios.delete(`/api/schedules/${id}`);
            fetchSchedules();
        }
    };

    const handleEdit = (schedule) => {
        setEditingId(schedule.id);
        setEditedData({ title: schedule.title, location: schedule.location, time: schedule.time });
    };

    const handleCancelEdit = () => setEditingId(null);

    const handleSaveEdit = async (id) => {
        await axios.put(`/api/schedules/${id}`, editedData);
        setEditingId(null);
        fetchSchedules();
    };

    const handleEditChange = (e) => {
        setEditedData({ ...editedData, [e.target.name]: e.target.value });
    };

    return (
        <div className="p-4 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold mb-4">Your Schedules</h2>
                    <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                        <table className="w-full text-left min-w-[600px]">
                            <thead><tr><th className="pb-2">Title</th><th className="pb-2">Location</th><th className="pb-2">Time</th><th className="pb-2 text-right">Actions</th></tr></thead>
                            <tbody>
                                {schedules.map((s) => (
                                    <tr key={s.id} className="border-t">
                                        {editingId === s.id ? (
                                            <>
                                                <td><input name="title" value={editedData.title} onChange={handleEditChange} className="border rounded py-1 px-2 w-full" /></td>
                                                <td><input name="location" value={editedData.location} onChange={handleEditChange} className="border rounded py-1 px-2 w-full" /></td>
                                                <td><input name="time" value={editedData.time} onChange={handleEditChange} className="border rounded py-1 px-2 w-full" /></td>
                                                <td className="text-right space-x-2">
                                                    <button onClick={() => handleSaveEdit(s.id)} className="text-sm text-green-600 font-semibold">Save</button>
                                                    <button onClick={handleCancelEdit} className="text-sm text-gray-600">Cancel</button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="py-2 font-bold">{s.title}</td>
                                                <td className="py-2 text-gray-600">{s.location}</td>
                                                <td className="py-2 text-gray-600">{s.time}</td>
                                                <td className="text-right space-x-4">
                                                    <button onClick={() => handleEdit(s)} className="text-sm text-blue-600 font-semibold">Edit</button>
                                                    <button onClick={() => handleDelete(s.id)} className="text-sm text-red-600 font-semibold">Delete</button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <h2 className="text-xl font-bold mb-4">Add New Schedule</h2>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4"><label>Title</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full border rounded-md py-2 px-3" required /></div>
                            <div className="mb-4"><label>Location</label><input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 block w-full border rounded-md py-2 px-3" required /></div>
                            <div className="mb-4"><label>Time</label><input type="text" value={time} onChange={(e) => setTime(e.target.value)} className="mt-1 block w-full border rounded-md py-2 px-3" required /></div>
                            <button type="submit" className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg">Add Schedule</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SchedulesPage;