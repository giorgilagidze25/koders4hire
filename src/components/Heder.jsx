import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function Header({ darkMode, setDarkMode }) {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = !!Cookies.get('token');

  const handleLogout = () => {
    Cookies.remove('token');
    navigate('/login');
  };

  return (
    <div>
      <div className="flex justify-between items-center p-4 shadow-md">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate('/')}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/8/83/Default-Icon.jpg"
            alt="project icon"
            className="w-12 h-12 rounded-full ml-[50px]"
          />
          <p className="ml-4 text-[25px] font-semibold">KODERS4HIRE</p>
        </div>

        <div className="flex items-center gap-4 relative">
          <div
            className="relative"
            onMouseEnter={() => setShowMenu(true)}
            onMouseLeave={() => setShowMenu(false)}
          >
            <img
              src="https://static.thenounproject.com/png/4154905-200.png"
              alt="default user"
              className={`w-12 h-12 rounded-full cursor-pointer ${darkMode ? 'invert' : ''}`}
              onClick={() => {
                if (isLoggedIn) {
                  navigate('/profile');
                } else {
                  navigate('/login');
                }
              }}
            />

            {showMenu && (
              <div
                className={`absolute right-0 border rounded shadow-lg ${
                  darkMode ? 'bg-white text-black' : 'bg-black text-white'
                }`}
              >
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 w-full text-left hover:opacity-80"
                  >
                    გამოსვლა
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      navigate('/login');
                      setShowMenu(false);
                    }}
                    className="block px-4 py-2 w-full text-left hover:opacity-80"
                  >
                    შესვლა
                  </button>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm font-medium mr-[50px] shadow-inner"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>
    </div>
  );
}
