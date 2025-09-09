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

// Wrapper component to use the navigate hook
function AppWrapper() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataVersion, setDataVersion] = useState(0);

  const handleDataChange = () => setDataVersion(prev => prev + 1);

  // ✅ FIX: Create a client-side logout handler
  const handleLogout = () => {
    // 1. Clear the token from storage
    localStorage.removeItem("token");
    // 2. Remove the Authorization header from future requests
    delete axios.defaults.headers.common['Authorization'];
    // 3. Update the user state to null
    setUser(null);
    // 4. Redirect to the login page
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
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
    <Routes>
      <Route path="/oauth" element={<OAuthHandler setUser={setUser} />} />
      {user ? (
        // ✅ Pass the handleLogout function as a prop
        <Route path="/" element={<MainLayout user={user} onLogout={handleLogout} />}>
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
  );
}

// OAuth handler remains the same
function OAuthHandler({ setUser }) {
  const { search } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const token = new URLSearchParams(search).get("token");
    if (token) {
      localStorage.setItem("token", token);
      axios.get('/api/profile')
        .then(res => { setUser(res.data); navigate("/dashboard"); })
        .catch(() => { setUser(null); navigate("/login"); });
    } else { navigate("/login"); }
  }, [search, navigate, setUser]);
  return <div className="flex items-center justify-center h-screen">Signing you in...</div>;
}

// Main App component now just sets up the router
function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;
