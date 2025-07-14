import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie'; 

export default function SignUp({ darkMode }) {
  const [formData, setFormData] = useState({
    real_name: '',
    username: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Registering...');

    try {
      const response = await fetch('https://2kmvzc-3000.csb.app/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        Cookies.set('token', data.token, { expires: 7 }); 
        toast.update(loadingToast, {
          render: 'Registration successful!',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        });
        setTimeout(() => navigate('/profile'), 3000);
      } else {
        toast.update(loadingToast, {
          render: data.message || 'Registration failed',
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.update(loadingToast, {
        render: 'Error occurred: ' + err.message,
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };


  return (
    <div className={`min-h-screen flex justify-center items-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <form onSubmit={handleSubmit} className={`w-[400px] p-6 rounded-lg shadow-lg space-y-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="text-2xl font-bold text-center">რეგისტრაცია</h2>

        <div>
          <p className="mb-1">ნამდვილი სახელი</p>
          <input
            name="real_name"
            placeholder="ნამდვილი სახელი"
            value={formData.real_name}
            onChange={handleChange}
            required
            className={`border p-2 w-full rounded ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'}`}
          />
        </div>

        <div>
          <p className="mb-1">მომხმარებლის სახელი</p>
          <input
            name="username"
            placeholder="მომხმარებელი"
            value={formData.username}
            onChange={handleChange}
            required
            className={`border p-2 w-full rounded ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'}`}
          />
        </div>

        <div>
          <p className="mb-1">იმეილი</p>
          <input
            name="email"
            type="email"
            placeholder="იმეილი"
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
            placeholder="*******"
            value={formData.password}
            onChange={handleChange}
            required
            className={`border p-2 w-full rounded ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'}`}
          />
        </div>

        <button type="submit" className={`w-full py-2 rounded ${darkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}>
          რეგისტრაცია
        </button>

        <p className="text-center mt-4 text-sm">
          გაქვს ანგარიში?{' '}
          <span onClick={() => navigate('/login')} className="underline cursor-pointer hover:opacity-80">
            შესვლა
          </span>
        </p>
      </form>
    </div>
  );
}
