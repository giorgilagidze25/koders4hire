

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Sun, Moon, User } from "lucide-react"; 
export default function Header({ darkMode, setDarkMode }) {
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const token = Cookies.get("token");
  const isLoggedIn = !!token;

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;

      try {
        const res = await fetch("https://2kmvzc-3000.csb.app/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (err) {
        console.error("User fetch error:", err.message);
      }
    };

    fetchUser();
  }, [token]);

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/login");
  };

  const renderUserIcon = () => {
    if (!isLoggedIn || !user) {
      return (
          <User className="w-6 h-6" />
      );
    }

    const firstLetter = user?.real_name?.[0]?.toUpperCase() || "?";

    return (
      <div
        className={`w-12 h-12 rounded-full cursor-pointer flex items-center justify-center font-bold text-xl ${
          darkMode ? "bg-white text-black" : "bg-black text-white"
        }`}
        onClick={() => navigate("/profile")}
      >
        {firstLetter}
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center p-4 shadow-md">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 drop-shadow-md hover:scale-105 transition-transform duration-300 ml-[100px]">
        KODERS4HIRE
      </h1>
      </div>

        <div className="flex items-center gap-4 relative">
          <div
            className="relative"
            onMouseEnter={() => setShowMenu(true)}
            onMouseLeave={() => setShowMenu(false)}
          >
            {renderUserIcon()}

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
  className="px-3 py-2 rounded-lg text-sm font-medium mr-[50px] shadow-inner flex items-center gap-2"
>
  {darkMode ? (
      <Sun className="w-7 h-7 text-yellow-500" />
  ) : (
      <Moon className="w-7 h-7 text-gray-700" />
  )}
</button>

        </div>
      </div>
    </div>
  );
}

