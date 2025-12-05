import React, { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import Modal from "./Modal";

export default function Servis({ darkMode }) {
  const [services, setServices] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ type: '', category: '', minPrice: '', maxPrice: '', tags: '' });
  const token = Cookies.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setCurrentUser({ _id: payload.userId, user_type: payload.user_type || "user" });
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  const fetchServices = async (query = '') => {
    try {
      const url = query ? `https://api.k4h.dev/services/browse?${query}` : `https://api.k4h.dev/services`;
      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data)) setServices(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleFilter = () => {
    const query = Object.entries(filters)
      .filter(([_, value]) => value !== '')
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    fetchServices(query);
  };

  const handleDelete = async (id) => {
    if (!token) return alert("Not authorized");
    if (!window.confirm("გსურს ამ სერვისის წაშლა?")) return;
    try {
      const res = await fetch(`https://api.k4h.dev/services/del/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setServices(prev => prev.filter(s => s._id !== id));
      else alert("Error deleting service");
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
  };

  const [formData, setFormData] = useState({ title: "", description: "", price: 0, currency: "", category: "", tags: [], type: "request" });

  useEffect(() => {
    if (editingService) {
      setFormData({
        title: editingService.title,
        description: editingService.description,
        price: editingService.price,
        currency: editingService.currency,
        category: editingService.category,
        tags: editingService.tags,
        type: editingService.type || "request",
      });
    }
  }, [editingService]);

  const handleUpdate = async (formData) => {
    if (!token) return alert("Not authorized");
    try {
      const res = await fetch(`https://api.k4h.dev/services/upd/${editingService._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const updated = await res.json();
        setServices(prev => prev.map(s => s._id === editingService._id ? updated : s));
        setEditingService(null);
      } else {
        alert("Error updating service");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <section className="max-w-screen-xl mx-auto px-6 py-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-4xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>ჩვენი სერვისები</h2>
          <button onClick={() => setFilterOpen(!filterOpen)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">ფილტრი</button>
        </div>
        
<div
  className={`fixed top-0 left-0 h-full w-80
  bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl
  shadow-2xl p-7 rounded-r-3xl
  transform transition-transform duration-300 z-50
  border-r border-gray-200/50 dark:border-gray-700/50
  ${filterOpen ? "translate-x-0" : "-translate-x-full"}`}
>
  <button
    onClick={() => setFilterOpen(false)}
    className="absolute top-5 right-5 text-gray-600 dark:text-gray-300
               hover:text-red-500 transition transform hover:scale-110"
  >
    <svg xmlns="http://www.w3.org/2000/svg" 
      fill="none" viewBox="0 0 24 24" strokeWidth="1.8" 
      stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" 
        d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>

  <h3
    className={`text-3xl font-bold mb-8 tracking-wide
    ${darkMode ? "text-white" : "text-gray-900"}`}
  >
    ფილტრი
  </h3>

  <div className="space-y-5">

    <div>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        კატეგორია
      </label>
      <input
        type="text"
        placeholder="მაგ: website"
        value={filters.category}
        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        className="w-full p-3 mt-1 rounded-2xl border border-gray-300 dark:border-gray-700
                   bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
      />
    </div>

    <div>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        ტეგები
      </label>
      <input
        type="text"
        placeholder="მაგ: react"
        value={filters.tags}
        onChange={(e) => setFilters({ ...filters, tags: e.target.value })}
        className="w-full p-3 mt-1 rounded-2xl border border-gray-300 dark:border-gray-700
                   bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
      />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Min Price
        </label>
        <input
          type="number"
          placeholder="0"
          value={filters.minPrice}
          onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          className="w-full p-3 mt-1 rounded-2xl border border-gray-300 dark:border-gray-700
                     bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Max Price
        </label>
        <input
          type="number"
          placeholder="1000"
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          className="w-full p-3 mt-1 rounded-2xl border border-gray-300 dark:border-gray-700
                     bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
        />
      </div>
    </div>

    <div>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        ტიპი
      </label>
      <select
        value={filters.type}
        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        className="w-full p-3 mt-1 rounded-2xl border border-gray-300 dark:border-gray-700
                   bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
      >
        <option value="">ყველა ტიპი</option>
        <option value="request">Request</option>
        <option value="offering">Offering</option>
      </select>
    </div>

    <button
      onClick={handleFilter}
      className="w-full bg-green-600 text-white p-3 rounded-2xl
                 hover:bg-green-700 transition font-semibold text-lg
                 shadow-md hover:shadow-xl"
    >
      განახლება
    </button>
  </div>



        </div>
        {services.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
            {services.map(service => {
              const isOwner = currentUser && service.owner?._id === currentUser._id;
              return (
               <div
  key={service._id}
  onClick={() =>
    navigate(`/service/${service._id}`, { state: service })
  }
  className={`
    cursor-pointer w-full
    shadow-md rounded-2xl overflow-hidden
    transform transition duration-300
    hover:scale-105 hover:shadow-xl
    min-w-[320px]
    ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}
  `}
>
  {service.image_url && (
    <img
      src={service.image_url}
      alt={service.title}
      className="w-full h-48 object-cover"
    />
  )}

  <div className="p-6">

    <h3 className="text-2xl font-semibold mb-2">{service.title}</h3>

    <p className="text-base mt-3 mb-4 break-words max-w-[400px]">
      {service.description}
    </p>

    {service.type === "offering" && (
      <p
        className={`mt-2 font-semibold ${
          darkMode ? "text-yellow-400" : "text-green-600"
        }`}
      >
        ფასი: {service.price} {service.currency}
      </p>
    )}

    <p
      className={`mt-2 text-[17px] ${
        darkMode ? "text-gray-300" : "text-black-700"
      }`}
    >
      კატეგორია: {service.category}
    </p>

    <div className="flex justify-end mt-4 space-x-2">
      {isOwner && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(service);
            }}
            className={`
              px-4 py-2 rounded-lg font-semibold transition-colors duration-300
              ${
                darkMode
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-gray-200 text-gray-900 hover:bg-gray-300"
              }
            `}
          >
            განახლება
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(service._id);
            }}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            წაშლა
          </button>
        </>
      )}
    </div>
  </div>

                </div>
              );
            })}
          </div>
        ) : <p className={`text-center text-lg mt-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>სერვისები ვერ მოიძებნა...</p>}
      </section>
      <Modal open={!!editingService} onClose={() => setEditingService(null)} darkMode={darkMode}>
        {editingService && (
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold mb-4">სერვისის განახლება</h3>
            <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full mb-2 p-2 rounded border" />
            <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full mb-2 p-2 rounded border" />
            {formData.type === "offering" && (
              <>
                <input type="number" placeholder="Price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full mb-2 p-2 rounded border" />
                <input type="text" placeholder="Currency" value={formData.currency} onChange={(e) => setFormData({ ...formData, currency: e.target.value })} className="w-full mb-2 p-2 rounded border" />
              </>
            )}
            <input type="text" placeholder="Category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full mb-2 p-2 rounded border" />
            <div className="flex justify-end space-x-2 mt-2">
              <button onClick={() => handleUpdate(formData)} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">განახლება</button>
              <button onClick={() => setEditingService(null)} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">დახურვა</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
