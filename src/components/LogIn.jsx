import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

export default function LogIn({ darkMode }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const location = useLocation();

useEffect(() => {
  const params = new URLSearchParams(location.search);
  const tokenFromQuery = params.get('token');
  if (tokenFromQuery) {
    Cookies.set('token', tokenFromQuery, { expires: 7 });
    toast.success('Token set from URL');
    navigate('/'); 
  }
}, [location.search, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Logging in...');

    try {
      const response = await fetch('https://2kmvzc-3000.csb.app/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        Cookies.set('token', data.token, { expires: 7 });
        toast.update(loadingToast, {
          render: 'Login successful!',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        });
       setTimeout(() => navigate(`/login?token=${data.token}`), 3000);

      } else {
        toast.update(loadingToast, {
          render: data.error || data.message || 'Login failed',
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.update(loadingToast, {
        render: 'An error occurred: ' + err.message,
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleOAuth = (provider) => {
    window.location.href = `https://2kmvzc-3000.csb.app/auth/${provider}`;
  };

  return (
    <div className={`min-h-screen flex justify-center items-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <form
        onSubmit={handleSubmit}
        className={`w-[400px] p-6 rounded-lg shadow-lg space-y-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
      >
        <h2 className="text-2xl font-bold text-center">შესვლა</h2>

        <div>
          <p className="mb-1">იმეილი</p>
          <input
            name="email"
            type="email"
            placeholder="შეიყვანეთ იმეილი"
            value={formData.email}
            onChange={handleChange}
            required
            className={`border p-2 w-full rounded ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'}`}
          />
        </div>

        <div>
          <p className="mb-1">პაროლი</p>
          <input
            name="password"
            type="password"
            placeholder="*****"
            value={formData.password}
            onChange={handleChange}
            required
            className={`border p-2 w-full rounded ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'}`}
          />
        </div>

        <button
          type="submit"
          className={`w-full py-2 rounded ${darkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
        >
          შესვლა
        </button>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => handleOAuth('google')}
            className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Google-ით შესვლა
          </button>

          <button
            type="button"
            onClick={() => handleOAuth('github')}
            className="w-full py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
          >
            GitHub-ით შესვლა
          </button>
        </div>

        <p className="text-center mt-4 text-sm">
          ჯერ არ გაქვს ანგარიში?{' '}
          <span
            onClick={() => navigate('/signup')}
            className="underline cursor-pointer hover:opacity-80"
          >
            რეგისტრაცია
          </span>
        </p>
      </form>
    </div>
  );
}
