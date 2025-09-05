import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import axios from 'axios';

// --- Icon Components ---
const DashboardIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>;
const SalesIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
const TransactionsIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>;
const SchedulesIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>;
const UsersIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-6-6h6m6 0a6 6 0 00-6 6z"></path></svg>;
const SettingsIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>;
const ContactIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const MenuIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>;

// Server Status Indicator Component
const ServerStatus = () => {
    const [status, setStatus] = useState('checking'); // 'ok', 'checking', 'down'

    useEffect(() => {
        const checkStatus = async () => {
            setStatus('checking');
            try {
                // Use the full URL for the deployed app
                await axios.get('https://my-dashboard-server-1cyf.onrender.com/api/health');
                setStatus('ok');
            } catch (error) {
                setStatus('down');
            }
        };

        checkStatus(); // Initial check
        const interval = setInterval(checkStatus, 30000); // Check every 30 seconds

        return () => clearInterval(interval); // Cleanup on component unmount
    }, []);

    const statusConfig = {
        ok: { color: 'bg-green-500', tooltip: 'Server is online' },
        checking: { color: 'bg-yellow-500', tooltip: 'Checking server status...' },
        down: { color: 'bg-red-500', tooltip: 'Server is offline or waking up' },
    };

    return (
        <div className="relative group flex items-center">
            <span className={`w-3 h-3 rounded-full ${statusConfig[status].color}`}></span>
            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                {statusConfig[status].tooltip}
            </span>
        </div>
    );
};


const MainLayout = ({ user }) => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // CORRECTED: Added "Dashboard" to this list for mobile view
    const navItems = [
        { path: '/dashboard', icon: DashboardIcon, label: 'Dashboard' },
        { path: '/sales', icon: SalesIcon, label: 'Sales' },
        { path: '/transactions', icon: TransactionsIcon, label: 'Transactions' },
        { path: '/schedules', icon: SchedulesIcon, label: 'Schedules' },
        { path: '/users', icon: UsersIcon, label: 'Users' },
        { path: '/settings', icon: SettingsIcon, label: 'Settings' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row font-sans">
            <header className="lg:hidden flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-30">
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-[#4285F4]">Board.</Link>
                <div className="flex items-center space-x-4">
                    <ServerStatus />
                    <span className="text-sm truncate">{user?.displayName}</span>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)}><MenuIcon /></button>
                </div>
            </header>

            <aside className={`fixed lg:relative inset-y-0 left-0 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out bg-[#4285F4] text-white w-64 lg:w-1/5 lg:m-4 lg:rounded-3xl p-8 flex flex-col justify-between z-20`}>
                <div>
                    <h1 className="text-4xl font-bold mb-12 hidden lg:block">Board.</h1>
                    <nav>
                        <ul>
                            {navItems.map(item => (
                                <li key={item.path} className="mb-6">
                                    <Link to={item.path} onClick={() => setIsMenuOpen(false)} className={`flex items-center p-2 rounded-lg hover:bg-white/20 ${location.pathname === item.path ? 'font-bold' : ''}`}>
                                        <item.icon />
                                        <span className="ml-4">{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
                <div>
                    <Link to="/contact" onClick={() => setIsMenuOpen(false)} className={`flex items-center p-2 rounded-lg hover:bg-white/20 mb-4 ${location.pathname === '/contact' ? 'font-bold' : ''}`}>
                        <ContactIcon />
                        <span className="ml-4">Contact Us</span>
                    </Link>
                    <a href="https://my-dashboard-server-1cyf.onrender.com/api/logout" className="flex items-center p-2 rounded-lg hover:bg-white/20 text-sm">
                        <span>Logout</span>
                    </a>
                </div>
            </aside>

            <div className="w-full lg:w-4/5">
                <header className="hidden lg:flex justify-between items-center p-8">
                    <h2 className="text-2xl font-bold capitalize">{location.pathname.replace('/', '') || 'Dashboard'}</h2>
                    <div className="flex items-center space-x-4">
                        <ServerStatus />
                        <img src={user?.photo} alt={user?.displayName} className="rounded-full w-10 h-10" />
                        <span>{user?.displayName}</span>
                        <a href="https://my-dashboard-server-1cyf.onrender.com/api/logout" className="text-sm text-gray-600 hover:text-black">Logout</a>
                    </div>
                </header>
                <main><Outlet /></main>
            </div>
        </div>
    );
};
export default MainLayout;
