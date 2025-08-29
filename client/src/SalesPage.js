import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function SalesPage({ onDataChange }) {
    const [sales, setSales] = useState([]);
    const [productName, setProductName] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [editingSaleId, setEditingSaleId] = useState(null);
    const [editedData, setEditedData] = useState({ productName: '', quantity: 0 });

    const fetchSales = useCallback(async () => {
        const res = await axios.get('/api/sales');
        setSales(res.data);
    }, []);

    useEffect(() => {
        fetchSales();
    }, [fetchSales]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('/api/sales', { productName, quantity: parseInt(quantity) });
        setProductName('');
        setQuantity(1);
        fetchSales();
        onDataChange();
    };

    const handleDelete = async (saleId) => {
        if (window.confirm('Are you sure you want to delete this sale?')) {
            await axios.delete(`/api/sales/${saleId}`);
            fetchSales();
            onDataChange();
        }
    };

    const handleEdit = (sale) => {
        setEditingSaleId(sale.id);
        setEditedData({ productName: sale.productName, quantity: sale.quantity });
    };

    const handleCancelEdit = () => setEditingSaleId(null);

    const handleSaveEdit = async (saleId) => {
        await axios.put(`/api/sales/${saleId}`, editedData);
        setEditingSaleId(null);
        fetchSales();
        onDataChange();
    };

    return (
        <div className="p-4 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold mb-4">Sales Log</h2>
                    <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                        <table className="w-full text-left min-w-[400px]">
                            <thead><tr><th className="pb-2">Product Name</th><th className="pb-2">Quantity</th><th className="pb-2 text-right">Actions</th></tr></thead>
                            <tbody>
                                {sales.map((s) => (
                                    <tr key={s.id} className="border-t">
                                        {editingSaleId === s.id ? (
                                            <>
                                                <td><input type="text" value={editedData.productName} onChange={(e) => setEditedData({ ...editedData, productName: e.target.value })} className="border rounded py-1 px-2 w-full" /></td>
                                                <td><input type="number" value={editedData.quantity} onChange={(e) => setEditedData({ ...editedData, quantity: parseInt(e.target.value) })} className="border rounded py-1 px-2 w-24" /></td>
                                                <td className="text-right space-x-2">
                                                    <button onClick={() => handleSaveEdit(s.id)} className="text-sm text-green-600 font-semibold">Save</button>
                                                    <button onClick={handleCancelEdit} className="text-sm text-gray-600">Cancel</button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="py-2">{s.productName}</td>
                                                <td className="py-2">{s.quantity}</td>
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
                    <h2 className="text-xl font-bold mb-4">Add New Sale</h2>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4"><label className="block text-sm font-medium">Product Name</label><input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="mt-1 block w-full border rounded-md py-2 px-3" required /></div>
                            <div className="mb-4"><label className="block text-sm font-medium">Quantity</label><input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="mt-1 block w-full border rounded-md py-2 px-3" min="1" required /></div>
                            <button type="submit" className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg">Add Sale</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SalesPage;