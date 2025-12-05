import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Sun, Moon, User, Bell } from "lucide-react";

export default function Heder({ darkMode, setDarkMode }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = Cookies.get("token");
  const isLoggedIn = !!token;

  useEffect(() => {
    if (!token) return;
    const fetchUser = async () => {
      try {
        const res = await fetch("https://api.k4h.dev/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setUser(data);
      } catch {}
    };
    fetchUser();
  }, [token]);

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/login");
  };

  const bannerHeight = 32;

  return (
    <div>
      {isLoggedIn && user && user.verification_status !== "approved" && user.email && (
        <div className="fixed top-0 left-0 w-full bg-yellow-400 text-black p-2 text-center font-semibold z-50">
          Your email ({user.email}) is not verified. Please check your inbox to verify your account. Click <a href="/verify">here</a> to enter code
        </div>
      )}

      <div
        className={`fixed ${isLoggedIn && user && user.verification_status !== "approved" ? `top-[32px]` : `top-0`} left-0 w-full z-40 transition-colors duration-300 ${
          darkMode ? "bg-gray-900 shadow-lg" : "bg-white shadow-md"
        }`}
      >
        <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
          <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 drop-shadow-md hover:scale-105 transition-transform duration-300">
              KODERS4HIRE
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn && (
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === "inbox" ? null : "inbox")}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <Bell className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                </button>
              </div>
            )}

            <div className="relative">
              <div
                className={`w-12 h-12 rounded-full cursor-pointer flex items-center justify-center font-bold text-xl overflow-hidden ${
                  darkMode ? "bg-white text-black" : "bg-black text-white"
                }`}
                onClick={() => setOpenDropdown(openDropdown === "menu" ? null : "menu")}
              >
                {isLoggedIn && user && user.profile_image ? (
                  <img
                    src={user.profile_image}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-none" />
                )}
              </div>

              {openDropdown === "menu" && (
                <div
                  className={`absolute right-0 mt-2 border rounded shadow-lg ${
                    darkMode ? "bg-white text-black" : "bg-black text-white"
                  }`}
                >
                  {isLoggedIn && user ? (
                    <>
                      <button
                        onClick={() => {
                          navigate("/");
                          setOpenDropdown(null);
                        }}
                        className="block px-4 py-2 w-full text-left hover:opacity-80"
                      >
                        მთავარი
                      </button>
                      <button
                        onClick={() => {
                          navigate("/profile");
                          setOpenDropdown(null);
                        }}
                        className="block px-4 py-2 w-full text-left hover:opacity-80"
                      >
                        პროფილი
                      </button>
                      <button
                        onClick={() => {
                          navigate("/add-service");
                          setOpenDropdown(null);
                        }}
                        className="block px-4 py-2 w-full text-left hover:opacity-80"
                      >
                        სერვისის დამატება
                      </button>

                      {/* Dashboard button for admin/owner/moderator */}
                      {["admin", "owner", "moderator"].includes(user.role) && (
                        <button
                          onClick={() => {
                            navigate("/dashboard");
                            setOpenDropdown(null);
                          }}
                          className="block px-4 py-2 w-full text-left hover:opacity-80 text-red-500"
                        >
                          Dashboard
                        </button>
                      )}

                      <button
                        onClick={() => {
                          handleLogout();
                          setOpenDropdown(null);
                        }}
                        className="block px-4 py-2 w-full text-left hover:opacity-80"
                      >
                        გამოსვლა
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        navigate("/login");
                        setOpenDropdown(null);
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
              className="px-3 py-2 rounded-lg text-sm font-medium shadow-inner flex items-center gap-2"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun className="w-7 h-7 text-yellow-500" /> : <Moon className="w-7 h-7 text-gray-700" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
