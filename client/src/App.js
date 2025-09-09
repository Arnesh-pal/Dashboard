// client/src/App.js

import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';
import axios from './axiosInstance';

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


// --- OAuth handler ---
function OAuthHandler({ setUser }) {
  const { search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);

      // ✅ FIX #1: Use the correct '/api/profile' route
      axios.get('/api/profile')
        .then(res => {
          setUser(res.data);
          navigate("/dashboard");
        })
        .catch(() => {
          setUser(null);
          navigate("/login");
        });
    } else {
      navigate("/login");
    }
  }, [search, navigate, setUser]);

  return <div className="flex items-center justify-center h-screen">Signing you in...</div>;
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataVersion, setDataVersion] = useState(0);

  const handleDataChange = () => {
    setDataVersion(prevVersion => prevVersion + 1);
  };

  // check local token on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // ✅ FIX #2: Use the correct '/api/profile' route
      axios.get('/api/profile')
        .then(res => setUser(res.data))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/oauth" element={<OAuthHandler setUser={setUser} />} />

        {user ? (
          <Route path="/" element={<MainLayout user={user} />}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard dataVersion={dataVersion} onDataChange={handleDataChange} />} />
            <Route path="sales" element={<SalesPage onDataChange={handleDataChange} />} />
            <Route path="transactions" element={<TransactionsPage onDataChange={handleDataChange} />} />
            <Route path="schedules" element={<SchedulesPage />} />
            <Route path="users" element={<UsersPage onDataChange={handleDataChange} />} />
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