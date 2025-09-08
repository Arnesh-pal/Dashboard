import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';

// Page Components
import SignInPage from './SignInPage';
import SignUpPage from './SignUpPage';
import Dashboard from './Dashboard';
import SalesPage from './SalesPage';
import TransactionsPage from './TransactionsPage';
import SchedulesPage from './SchedulesPage';
import UsersPage from './UsersPage';
import SettingsPage from './SettingsPage';
import ContactPage from './ContactPage';
import MainLayout from './MainLayout';

axios.defaults.baseURL = 'https://dashboard-henna-ten-79.vercel.app/';
axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataVersion, setDataVersion] = useState(0);

  const handleDataChange = () => {
    setDataVersion(prevVersion => prevVersion + 1);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/current_user');
        setUser(res.data || null);
      } catch (error) {
        setUser(null);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {user ? (
          <Route path="/" element={<MainLayout user={user} />}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard dataVersion={dataVersion} onDataChange={handleDataChange} />} />
            <Route path="sales" element={<SalesPage onDataChange={handleDataChange} />} />
            <Route path="transactions" element={<TransactionsPage onDataChange={handleDataChange} />} />
            <Route path="schedules" element={<SchedulesPage />} />
            {/* THIS IS THE CORRECTED LINE */}
            <Route path="users" element={<UsersPage dataVersion={dataVersion} onDataChange={handleDataChange} />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Route>
        ) : (
          <>
            <Route path="/login" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
