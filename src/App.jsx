import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

import LogIn from './components/LogIn';
import SignUp from './components/SignUp';
import Header from './components/Heder';
import Home from './components/Home';
import Profile from './components/Profile';
import CardDetail from './components/CardDetail';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const ProtectedRoute = ({ children }) => {
    const token = Cookies.get('token');
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <div className={darkMode ? 'bg-gray-900 text-white min-h-screen' : 'bg-white text-black min-h-screen'}>
      <BrowserRouter>
        <ToastContainer />
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <Routes>
          <Route path="/" element={<Home darkMode={darkMode} />} />
             <Route path="/card/:id" element={<CardDetail />} />
          <Route path="/signup" element={<SignUp darkMode={darkMode} />} />
          <Route path="/login" element={<LogIn darkMode={darkMode} />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
