import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import AddProfileModal from './AddProfileModal';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const generateColors = (numColors) => {
    const colors = ['#98D89E', '#F6DC7D', '#EE8484', '#F4E04D', '#A0E7E5', '#B4F8C8'];
    return Array.from({ length: numColors }, (_, i) => colors[i % colors.length]);
};

function Dashboard({ dataVersion, onDataChange }) {
    const [stats, setStats] = useState({ totalRevenues: 0, totalTransactions: 0, totalUsers: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activitiesChartData, setActivitiesChartData] = useState({ labels: [], datasets: [] });
    const [topProductsData, setTopProductsData] = useState({ labels: [], datasets: [{ data: [] }] });
    const [chartView, setChartView] = useState('month');

    const fetchData = useCallback(async () => {
        try {
            const [statsRes, activitiesRes, topProductsRes] = await Promise.all([
                axios.get('/api/dashboard_stats'),
                axios.get(`/api/activities_chart?view=${chartView}`),
                axios.get('/api/top_products')
            ]);
            setStats(statsRes.data);

            const { transactions, view } = activitiesRes.data;
            let labels, incomeData, expenseData;

            if (view === 'month') {
                labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                incomeData = Array(4).fill(0);
                expenseData = Array(4).fill(0);

                // CORRECTED: Process raw transactions and group them by week on the frontend
                transactions.forEach(t => {
                    const transactionDate = new Date(t.date);
                    const dayOfMonth = transactionDate.getDate();
                    // Calculate week index (0-3). Days 29, 30, 31 will be capped at week 3.
                    const weekIndex = Math.min(Math.floor((dayOfMonth - 1) / 7), 3);

                    if (t.type === 'income') {
                        incomeData[weekIndex] += parseFloat(t.amount);
                    } else {
                        expenseData[weekIndex] += parseFloat(t.amount);
                    }
                });

            } else { // Year view
                labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                incomeData = Array(12).fill(0);
                expenseData = Array(12).fill(0);
                transactions.forEach(t => {
                    const month = new Date(t.group).getMonth();
                    incomeData[month] += parseFloat(t.incomeTotal);
                    expenseData[month] += parseFloat(t.expenseTotal);
                });
            }

            setActivitiesChartData({
                labels: labels,
                datasets: [
                    { label: 'Expenses', data: expenseData, backgroundColor: '#EE8484', borderRadius: 5 },
                    { label: 'Income', data: incomeData, backgroundColor: '#98D89E', borderRadius: 5 },
                ]
            });

            const products = topProductsRes.data;
            setTopProductsData({
                labels: products.map(p => p.productName),
                datasets: [{
                    data: products.map(p => p.totalQuantity),
                    backgroundColor: generateColors(products.length),
                    borderWidth: 0,
                }]
            });
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        }
    }, [chartView]);

    useEffect(() => {
        fetchData();
    }, [fetchData, dataVersion]);

    return (
        <>
            <div className="p-4 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-[#DDEFE0] p-4 rounded-lg shadow"><h3 className="text-sm">Total Revenues</h3><p className="text-2xl font-bold">₹{stats.totalRevenues.toLocaleString()}</p></div>
                    <div className="bg-[#F4ECDD] p-4 rounded-lg shadow"><h3 className="text-sm">Total Transactions</h3><p className="text-2xl font-bold">{stats.totalTransactions.toLocaleString()}</p></div>
                    <div className="bg-[#DEE0EF] p-4 rounded-lg shadow"><h3 className="text-sm">Total Users</h3><p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p></div>
                </div>
                <div className="bg-white p-6 rounded-2xl mb-8 shadow-md">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                            <h3 className="font-bold text-lg">Activities</h3>
                            <p className="text-sm text-gray-500">Based on Transaction Dates</p>
                        </div>
                        <div className="flex space-x-2 mt-4 md:mt-0">
                            <button onClick={() => setChartView('month')} className={`text-sm py-1 px-3 rounded-md ${chartView === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Month</button>
                            <button onClick={() => setChartView('year')} className={`text-sm py-1 px-3 rounded-md ${chartView === 'year' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Year</button>
                        </div>
                    </div>
                    <div className="mt-4 h-72">
                        <Bar data={activitiesChartData} options={{ responsive: true, maintainAspectRatio: false, scales: { x: { grid: { display: false } }, y: { beginAtZero: true } } }} />
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-2xl shadow-md">
                        <h3 className="font-bold text-lg mb-4">Top Products</h3>
                        <div className="flex flex-col sm:flex-row items-center">
                            <div className="w-full sm:w-1/2 h-48"><Doughnut data={topProductsData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} /></div>
                            <div className="w-full sm:w-1/2 pl-0 sm:pl-4 mt-4 sm:mt-0">
                                <ul>
                                    {topProductsData.labels.map((label, i) => (
                                        <li key={i} className="flex items-center mb-2">
                                            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: topProductsData.datasets[0].backgroundColor[i] }}></span>
                                            <div><p className="font-bold">{label}</p></div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div onClick={() => setIsModalOpen(true)} className="bg-white p-6 rounded-2xl flex flex-col justify-center items-center cursor-pointer hover:bg-gray-50 shadow-md">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-4xl text-gray-400 mb-4">+</div>
                        <h3 className="font-bold text-lg">Add Profile</h3>
                    </div>
                </div>
            </div>
            <AddProfileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={onDataChange} />
        </>
    );
}

export default Dashboard;