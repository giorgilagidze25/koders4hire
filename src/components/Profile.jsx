import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const token = Cookies.get('token');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;

      try {
        const res = await fetch('https://2kmvzc-3000.csb.app/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setUser(data);
        } else {
          console.error('User fetch error:', data.message);
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    };

    fetchProfile();
  }, [token]);



  if (!user) {
    return <div className="text-center mt-10">იტვირთება...</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 shadow-lg rounded bg-white text-black">
      <h2 className="text-2xl font-bold mb-4">Პროფაილი</h2>
      <p><strong>სახელი:</strong> {user.real_name}</p>
      <p><strong>მომხმარებელი:</strong> {user.username}</p>
      <p><strong>იმეილი:</strong> {user.email}</p>

   
    </div>
  );
}
