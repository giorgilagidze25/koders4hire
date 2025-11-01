import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

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
      toast.error("Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!token) {
      toast.error("You must be logged in to add items to cart");
      return;
    }

    try {
      const res = await fetch("https://api.k4h.dev/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.warn(data.msg || "Failed to add to cart");
      } else {
        toast.success(data.msg || "Added to cart");
        setCart(data.items || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error: " + err.message);
    }
  };

  const updateCart = async (productId, quantity) => {
    if (!token) {
      toast.error("You must be logged in");
      return;
    }

    try {
      const res = await fetch("https://api.k4h.dev/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await res.json();

      if (!res.ok) toast.warn(data.msg || "Failed to update cart");
      else setCart(data.items || []);
    } catch (err) {
      console.error(err);
      toast.error("Network error: " + err.message);
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
      toast.success("Cart cleared");
    } catch (err) {
      console.error(err);
      toast.error("Failed to clear cart");
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
