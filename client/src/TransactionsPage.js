import React, { useState, useEffect, useCallback } from 'react';
import axios from './axiosInstance';

function TransactionsPage({ onDataChange }) {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({ monthlyIncome: 0, monthlyExpense: 0, net: 0 });
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('expense');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [editingId, setEditingId] = useState(null);
    const [editedData, setEditedData] = useState({});

    const fetchData = useCallback(async () => {
        try {
            const [transRes, summaryRes] = await Promise.all([
                axios.get('/api/transactions'),
                axios.get('/api/transactions/summary')
            ]);
            setTransactions(Array.isArray(transRes?.data) ? transRes.data : []);
            setSummary(summaryRes?.data || { monthlyIncome: 0, monthlyExpense: 0, net: 0 });
        } catch (error) {
            console.error("Failed to fetch transaction data", error);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const refreshSummary = async () => {
        const summaryRes = await axios.get('/api/transactions/summary');
        setSummary(summaryRes.data);
        onDataChange(); // This tells the main dashboard to refresh its own stats
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/transactions', { description, amount: parseFloat(amount || 0), type, date });
            setTransactions(prev => [res.data, ...prev]); // Add new transaction to the top of the list
            setDescription(''); setAmount(''); setType('expense'); setDate(new Date().toISOString().split('T')[0]);
            await refreshSummary();
        } catch (error) {
            console.error("Failed to add transaction", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            await axios.delete(`/api/transactions/${id}`);
            setTransactions(prev => prev.filter(t => t.id !== id));
            await refreshSummary();
        }
    };

    const handleEdit = (transaction) => {
        setEditingId(transaction.id);
        setEditedData({
            ...transaction,
            date: transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : '',
        });
    };

    const handleCancelEdit = () => setEditingId(null);

    const handleSaveEdit = async (id) => {
        try {
            const res = await axios.put(`/api/transactions/${id}`, { ...editedData, amount: parseFloat(editedData.amount || 0) });
            setTransactions(prev => prev.map(t => (t.id === id ? res.data : t)));
            setEditingId(null);
            await refreshSummary();
        } catch (error) {
            console.error("Failed to save transaction", error);
        }
    };

    const handleEditChange = (e) => {
        setEditedData({ ...editedData, [e.target.name]: e.target.value });
    };

    return (
        <div className="p-4 md:p-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-green-100 p-4 rounded-lg shadow">
                    <h3 className="text-sm text-green-800">This Month's Income</h3>
                    <p className="text-2xl font-bold text-green-600">₹{(summary.monthlyIncome || 0).toLocaleString()}</p>
                </div>
                <div className="bg-red-100 p-4 rounded-lg shadow">
                    <h3 className="text-sm text-red-800">This Month's Expense</h3>
                    <p className="text-2xl font-bold text-red-600">₹{(summary.monthlyExpense || 0).toLocaleString()}</p>
                </div>
                <div className="bg-blue-100 p-4 rounded-lg shadow">
                    <h3 className="text-sm text-blue-800">This Month's Net</h3>
                    <p className="text-2xl font-bold text-blue-600">₹{(summary.net || 0).toLocaleString()}</p>
                </div>
            </div>

            {/* Transactions Table & Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold mb-4">Your Transactions</h2>
                    <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                        <table className="w-full text-left min-w-[600px]">
                            <thead><tr><th className="pb-2">Description</th><th className="pb-2">Date</th><th className="pb-2">Type</th><th className="pb-2 text-right">Amount</th><th className="pb-2 text-right">Actions</th></tr></thead>
                            <tbody>
                                {transactions.map(t => (
                                    <tr key={t.id} className="border-t">
                                        {editingId === t.id ? (
                                            <>
                                                <td><input name="description" value={editedData.description || ''} onChange={handleEditChange} className="border rounded py-1 px-2 w-full" /></td>
                                                <td><input name="date" type="date" value={editedData.date || ''} onChange={handleEditChange} className="border rounded py-1 px-2 w-full" /></td>
                                                <td>
                                                    <select name="type" value={editedData.type || 'expense'} onChange={handleEditChange} className="border rounded py-1 px-2 w-full">
                                                        <option value="expense">Expense</option><option value="income">Income</option>
                                                    </select>
                                                </td>
                                                <td><input name="amount" type="number" value={editedData.amount || 0} onChange={handleEditChange} className="border rounded py-1 px-2 w-full text-right" /></td>
                                                <td className="text-right space-x-2"><button onClick={() => handleSaveEdit(t.id)} className="text-sm text-green-600">Save</button><button onClick={handleCancelEdit} className="text-sm text-gray-600">Cancel</button></td>
                                            </>
                                        ) : (
                                            <>
                                                <td>{t.description || '-'}</td>
                                                <td>{t.date ? new Date(t.date).toLocaleDateString() : '-'}</td>
                                                <td><span className={`px-2 py-1 rounded-full text-xs font-semibold ${t.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{t.type || '-'}</span></td>
                                                <td className={`text-right font-semibold ${t.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>{t.type === 'income' ? '+' : '-'}₹{parseFloat(t.amount || 0).toLocaleString()}</td>
                                                <td className="text-right space-x-4"><button onClick={() => handleEdit(t)} className="text-sm text-blue-600">Edit</button><button onClick={() => handleDelete(t.id)} className="text-sm text-red-600">Delete</button></td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <h2 className="text-xl font-bold mb-4">Add New Transaction</h2>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4"><label>Description</label><input type="text" value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full border rounded-md py-2 px-3" required /></div>
                            <div className="mb-4"><label>Amount</label><input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1 block w-full border rounded-md py-2 px-3" required /></div>
                            <div className="mb-4"><label>Date</label><input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full border rounded-md py-2 px-3" required /></div>
                            <div className="mb-4"><label>Type</label><select value={type} onChange={e => setType(e.target.value)} className="mt-1 block w-full border rounded-md py-2 px-3"><option value="expense">Expense</option><option value="income">Income</option></select></div>
                            <button type="submit" className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg">Add Transaction</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TransactionsPage;

