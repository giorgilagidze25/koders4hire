import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const token = Cookies.get("token");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    if (!token) return;
    try {
      const res = await fetch("https://api.k4h.dev/cart/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCart(Array.isArray(data.items) ? data.items : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!token) return;
    try {
      const res = await fetch("https://api.k4h.dev/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId, quantity }),
      });
      const data = await res.json();
      setCart(data.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  const updateCart = async (productId, quantity) => {
    if (!token) return;
    try {
      const res = await fetch("https://api.k4h.dev/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId, quantity }),
      });
      const data = await res.json();
      setCart(data.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromCart = async (productId) => {
    await updateCart(productId, 0);
  };

  const clearCart = async () => {
    if (!token) return;
    try {
      await fetch("https://api.k4h.dev/cart/clear", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart([]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
