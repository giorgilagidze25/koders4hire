import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";

import LogIn from './components/LogIn';
import SignUp from './components/SignUp';
import Header from './components/Heder';
import Home from './components/Home';
import Profile from './components/Profile';
import CardDetail from './components/CardDetail';
import Dashboard from './components/Dashboard';
import AddService from './components/AddServis';
import UserProfile from './components/UserCard';
import ServiceDetail from "./components/ServicDetail.";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      setLoadingUser(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch("https://api.k4h.dev/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setUser(data);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (loadingUser) return null;
    const token = Cookies.get("token");
    if (!token) return <Navigate to="/login" replace />;
    return children;
  };

  const AdminProtectedRoute = ({ children }) => {
    if (loadingUser) return null;
    const token = Cookies.get("token");
    if (!token) return <Navigate to="/login" replace />;
    if (!["owner", "admin", "moderator"].includes(user?.role)) return <Navigate to="/" replace />;
    return children;
  };

  return (
    <div className={darkMode ? "bg-gray-900 text-white min-h-screen" : "bg-white text-black min-h-screen"}>
      <BrowserRouter>
        <ToastContainer />
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="pt-20">
          <Routes>
            <Route path="/" element={<Home darkMode={darkMode} />} />
            <Route path="/project/:id" element={<CardDetail darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path="/signup" element={<SignUp darkMode={darkMode} />} />
            <Route path="/login" element={<LogIn darkMode={darkMode} />} />
            <Route path="/profile" element={<ProtectedRoute><Profile darkMode={darkMode} /></ProtectedRoute>} />
            <Route path="/add-service" element={<ProtectedRoute><AddService darkMode={darkMode} /></ProtectedRoute>} />
            <Route path="/user/:username" element={<UserProfile />} />
            <Route path="/dashboard" element={<AdminProtectedRoute><Dashboard darkMode={darkMode} setDarkMode={setDarkMode} /></AdminProtectedRoute>} />
            <Route path="/service/:id" element={<ServiceDetail darkMode={darkMode} />} />
     
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
