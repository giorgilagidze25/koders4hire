import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Sun, Moon, User, Bell, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Header({ darkMode, setDarkMode }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = Cookies.get("token");
  const isLoggedIn = !!token;
  const { cart, updateQuantity, clearCart } = useCart();

  useEffect(() => {
    if (!token) return;
    const fetchUser = async () => {
      try {
        const res = await fetch("https://api.k4h.dev/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setUser(data);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchUser();
  }, [token]);

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/login");
  };

  return (
    <div className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${darkMode ? "bg-gray-900 shadow-lg" : "bg-white shadow-md"}`}>
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
                onClick={() => setOpenDropdown(openDropdown === "cart" ? null : "cart")}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 relative"
              >
                <ShoppingCart className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                {cart.length > 0 && (
                  <span className="absolute top-0 right-0 text-xs font-bold bg-red-600 text-white w-4 h-4 rounded-full flex items-center justify-center">
                    {cart.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </button>

              {openDropdown === "cart" && (
                <div className={`absolute right-0 mt-2 w-72 border rounded shadow-lg p-4 z-50 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
                  {cart.length === 0 ? (
                    <p className="text-center">კარტი ცარიელია</p>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {cart.reduce((acc, item) => {
                        const existingItem = acc.find(i => i.product._id === item.product._id);
                        if (existingItem) {
                          existingItem.quantity += item.quantity;
                        } else {
                          acc.push({ ...item });
                        }
                        return acc;
                      }, []).map((item) => (
                        <div key={item.product._id} className="flex justify-between items-center border-b pb-1">
                          <div>
                            <p className="font-semibold">{item.product.title}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-300">{item.product.price}{" "}
                              {item.product.currency === "USD"
                                ? "$"
                                : item.product.currency === "EUR"
                                ? "€"
                                : item.product.currency}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="number"
                              min="0"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.product._id, parseInt(e.target.value))}
                              className="w-12 p-1 text-center rounded border"
                            />
                            <button
                              onClick={() => {
                                clearCart(item.product._id);
                              }}
                              className="ml-2 text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={clearCart}
                        className="mt-2 w-full py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Clear Cart
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
  {isLoggedIn && (
            <div className="relative">
              <button onClick={() => setOpenDropdown(openDropdown === "inbox" ? null : "inbox")} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                <Bell className="w-6 h-6 text-gray-700 dark:text-gray-200" />
              </button>
              {openDropdown === "inbox" && (
                <div className={`absolute right-0 mt-2 w-96 h-96 border rounded shadow-lg z-50 ${darkMode ? "bg-gray-900" : "bg-white"}`}>
                  <div className="p-4">
                    <h2 className="font-bold">Notifications</h2>
                    <ul>
                      {async () => {
                        const res = await fetch(`https://api.k4h.dev/notifications?token=${token}`);
                        const data = await res.json();
                        return data.notifications.map(notification => (
                          <li key={notification._id} className="border-b py-2">
                            <p>{notification.message}</p>
                            <p className="text-sm text-gray-500">{new Date(notification.createdAt).toLocaleString()}</p>
                          </li>
                        ));
                      }}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="relative">
            <div
              className={`w-12 h-12 rounded-full cursor-pointer flex items-center justify-center font-bold text-xl overflow-hidden ${darkMode ? "bg-white text-black" : "bg-black text-white"}`}
              onClick={() => setOpenDropdown(openDropdown === "menu" ? null : "menu")}
            >
              {isLoggedIn && user && user.profile_image ? (
                <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-none" />
              )}
            </div>

            {openDropdown === "menu" && (
              <div className={`absolute right-0 mt-2 w-48 border rounded shadow-lg ${darkMode ? "bg-white text-black" : "bg-black text-white"}`}>
                {isLoggedIn && user ? (
                  <>
                    <button onClick={() => { navigate('/'); setOpenDropdown(null); }} className="block px-4 py-2 w-full text-left hover:opacity-80">მთავარ გვერდზე</button>
                    <button onClick={() => { navigate("/profile"); setOpenDropdown(null); }} className="block px-4 py-2 w-full text-left hover:opacity-80">პროფილი</button>
                    {["owner", "admin", "moderator"].includes(user.role) && (
                      <button onClick={() => { navigate("/dashboard"); setOpenDropdown(null); }} className="block px-4 py-2 w-full text-left hover:opacity-80">Dashboard</button>
                    )}
                    <button onClick={() => { navigate("/add-service"); setOpenDropdown(null); }} className="block px-4 py-2 w-full text-left hover:opacity-80">სერვისის დამატება</button>
                    <button onClick={() => { handleLogout(); setOpenDropdown(null); }} className="block px-4 py-2 w-full text-left hover:opacity-80">გამოსვლა</button>
                  </>
                ) : (
                  <button onClick={() => { navigate("/login"); setOpenDropdown(null); }} className="block px-4 py-2 w-full text-left hover:opacity-80">შესვლა</button>
                )}
              </div>
            )}
          </div>

          <button onClick={() => setDarkMode(!darkMode)} className="px-3 py-2 rounded-lg text-sm font-medium shadow-inner flex items-center gap-2">
            {darkMode ? <Sun className="w-7 h-7 text-yellow-500" /> : <Moon className="w-7 h-7 text-gray-700" />}
          </button>
        </div>
      </div>
    </div>
  );
}
