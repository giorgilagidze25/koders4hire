import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export default function Profile({ darkMode }) {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("info");
  const [services, setServices] = useState([]);
  const [ratings, setRatings] = useState({ averageRating: 0, totalScore: 0 });
  const [paypal, setPaypal] = useState(null);
  const [updateForm, setUpdateForm] = useState({ real_name: "", username: "", email: "" });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState(""); 
  const token = Cookies.get("token");
  const sidebarColor = darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-900";

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      const res = await fetch("https://api.k4h.dev/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        setUpdateForm({ real_name: data.real_name || "", username: data.username || "", email: data.email || "" });
        setPaypal(data.paypal_account || null);
        fetchRatings(data._id);
        fetchServices(data.username);
      }
    };

    const fetchRatings = async (userId) => {
      try {
        const res = await fetch(`https://api.k4h.dev/rating/user/${userId}`);
        const data = await res.json();
        if (res.ok) setRatings(data);
      } catch (err) {
        toast.error("Failed to fetch ratings");
      }
    };

    const fetchServices = async (username) => {
      try {
        const res = await fetch(`https://api.k4h.dev/users/${username}`);
        const data = await res.json();
        if (res.ok) setServices(data.services || []);
      } catch (err) {
        toast.error("Failed to fetch services");
      }
    };

    fetchProfile();
  }, [token]);

  if (!user) {
    return (
      <div className="text-center mt-10 flex justify-center items-center min-h-screen">
        იტვირთება...
      </div>
    );
  }

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("real_name", updateForm.real_name);
    formData.append("username", updateForm.username);
    formData.append("email", updateForm.email);
    try {
      const res = await fetch("https://api.k4h.dev/users/upd", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Profile updated successfully");
        setUser(data);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };


  const handlePaypalConnect = async () => {
    try {
      const res = await fetch("https://api.k4h.dev/paypal/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ paypal_email: paypal.email, merchant_id: paypal.merchant_id }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("PayPal connected successfully");
        setPaypal(data);
      } else {
        toast.error(data.message || "Failed to connect PayPal");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const handlePaypalUpdate = async () => {
    try {
      const res = await fetch("https://api.k4h.dev/paypal/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ paypal_email: paypal.email, merchant_id: paypal.merchant_id }),
      });
      const data = await res.json();
      if (res.ok) toast.success("PayPal updated successfully");
      else toast.error(data.message || "Failed to update PayPal");
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const handleDangerAction = async () => {
    setShowConfirmModal(false);
    if (actionType === "delete") {
      try {
        const res = await fetch("https://api.k4h.dev/users/del", {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) window.location.href = "/"; 
      } catch (err) {
        toast.error("Failed to delete account");
      }
    } else if (actionType === "disconnect-paypal") {
      try {
        const res = await fetch("https://api.k4h.dev/paypal/disconnect", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          toast.success("PayPal disconnected");
          setPaypal(null);
        }
      } catch (err) {
        toast.error("Failed to disconnect PayPal");
      }
    }
  };

  return (
    <div className={`min-h-screen flex ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <div className={`w-full md:w-64 flex flex-col p-4 md:p-6 ${sidebarColor}`}>
        <h2 className="text-2xl font-bold mb-4 md:mb-8">Profile Panel</h2>
        <button onClick={() => setActiveSection("info")} className={`text-left py-2 ${activeSection === "info" ? "text-blue-400 font-semibold" : "hover:text-blue-400"}`}>My Info</button>
        <button onClick={() => setActiveSection("services")} className={`text-left py-2 ${activeSection === "services" ? "text-blue-400 font-semibold" : "hover:text-blue-400"}`}>My Services</button>
        <button onClick={() => setActiveSection("paypal")} className={`text-left py-2 ${activeSection === "paypal" ? "text-blue-400 font-semibold" : "hover:text-blue-400"}`}>PayPal</button>
        <button onClick={() => setActiveSection("danger")} className={`text-left py-2 ${activeSection === "danger" ? "text-blue-400 font-semibold" : "hover:text-blue-400"}`}>Danger Zone</button>
      </div>

      <div className="flex-1 p-6">
      {activeSection === "info" && (
  <div className="max-w-xl p-6 rounded-2xl  shadow-lg relative">
    <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">User Info</h2>
    <div className="flex justify-center mb-6 relative">
      <img
        src={user.profile_image}
        alt="Profile"
        className="w-24 h-24 rounded-full object-cover"
      />
      <label className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 border-2 border-white dark:border-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v9a2 2 0 002 2z" />
        </svg>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => {
            const file = e.target.files[0];
            if (!file) return;
            const formData = new FormData();
            formData.append("profile_image", file);
            formData.append("real_name", updateForm.real_name);
            formData.append("username", updateForm.username);
            formData.append("email", updateForm.email);
            fetch("https://api.k4h.dev/users/upd", {
              method: "PUT",
              headers: { Authorization: `Bearer ${token}` },
              body: formData
            })
            .then(res => res.json())
            .then(data => {
              if (data._id) {
                setUser(data);
                toast.success("Profile picture updated");
              } else {
                toast.error("Failed to update profile picture");
              }
            })
            .catch(() => toast.error("An error occurred"));
          }}
        />
      </label>
    </div>
    <div className="space-y-2   text-lg">
      <p><strong>Name:</strong> {user.real_name}</p>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.user_type}</p>
      <p><strong>Average Rating:</strong> {ratings.averageRating} ({ratings.totalScore} total)</p>
      <button onClick={() => window.location.href = `/user/${user.username}`} className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 mt-4">
        <p>Go to your profile</p>
      </button>
    </div>
    <div className="mt-4 space-y-2">
      <input type="text" placeholder="Real Name" value={updateForm.real_name} onChange={e => setUpdateForm({ ...updateForm, real_name: e.target.value })} className="w-full p-2 border rounded"/>
      <input type="text" placeholder="Username" value={updateForm.username} onChange={e => setUpdateForm({ ...updateForm, username: e.target.value })} className="w-full p-2 border rounded"/>
      <input type="email" placeholder="Email" value={updateForm.email} onChange={e => setUpdateForm({ ...updateForm, email: e.target.value })} className="w-full p-2 border rounded"/>
      <button onClick={handleUpdate} className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-2">Update Info</button>
    </div>
  </div>
)}


        {activeSection === "services" && (
          <div>
            <h2 className="text-3xl font-bold mb-6">My Services</h2>
            {services.map(s => (
              <div key={s._id} className="border p-4 rounded mb-4">
                <h3 className="font-semibold">{s.title}</h3>
                <p>{s.description}</p>
                <p><strong>Price:</strong> {s.price} {s.currency}</p>
                <p><strong>Average Rating:</strong> {s.averageRating || 0}</p>
              </div>
            ))}
          </div>
        )}

        {activeSection === "paypal" && (
          <div>
            <h2 className="text-3xl font-bold mb-6">PayPal</h2>
            {paypal ? (
              <div className="space-y-2">
                <p><strong>Email:</strong> {paypal.email}</p>
                <p><strong>Merchant ID:</strong> {paypal.merchant_id}</p>
                <p><strong>Connected At:</strong> {paypal.connected_at}</p>
                <p><strong>Last Verified:</strong> {paypal.last_verified}</p>
                <input type="email" value={paypal.email} onChange={e => setPaypal({ ...paypal, email: e.target.value })} className="w-full p-2 border rounded"/>
                <input type="text" value={paypal.merchant_id} onChange={e => setPaypal({ ...paypal, merchant_id: e.target.value })} className="w-full p-2 border rounded"/>
                <button onClick={handlePaypalUpdate} className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700">Update PayPal</button>
              </div>
            ) : (
              <button onClick={handlePaypalConnect} className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700">Connect PayPal</button>
            )}
          </div>
        )}

        {activeSection === "danger" && (
          <div className="space-y-4">
            <button onClick={() => { setActionType("delete"); setShowConfirmModal(true); }} className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700">Delete Account</button>
            {paypal && (
              <button onClick={() => { setActionType("disconnect-paypal"); setShowConfirmModal(true); }} className="w-full py-2 bg-orange-600 text-white rounded hover:bg-orange-700">Disconnect PayPal</button>
            )}
          </div>
        )}

        {showConfirmModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white text-black dark:bg-gray-800 dark:text-white p-6 rounded-lg max-w-sm w-full space-y-4">
              <p>Are you sure?</p>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowConfirmModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button onClick={handleDangerAction} className="px-4 py-2 bg-red-600 text-white rounded">Yes</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
