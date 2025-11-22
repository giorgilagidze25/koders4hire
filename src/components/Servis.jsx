import React, { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import Modal from "./Modal";

export default function Servis({ darkMode }) {
  const [services, setServices] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    currency: "",
    category: "",
    tags: [],
    type: "request",
  });
  const [editingService, setEditingService] = useState(null);
  const token = Cookies.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setCurrentUser({ _id: payload.userId, user_type: payload.user_type || "user" });
    } catch (err) {
      console.error("Token parse error:", err);
    }
  }, [token]);

  useEffect(() => {
    fetch("https://api.k4h.dev/services")
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setServices(data); })
      .catch((err) => console.error("Service fetch error:", err));
  }, []);

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
    } catch (err) { console.error(err); }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      price: service.price,
      currency: service.currency,
      category: service.category,
      tags: service.tags,
      type: service.type || "request",
    });
  };

  const handleUpdate = async () => {
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
      } else { alert("Error updating service"); }
    } catch (err) { console.error(err); }
  };

  return (
    <div>
      <section className="max-w-screen-xl mx-auto px-6 py-16">
        <h2 className={`text-4xl font-bold text-center mb-12 mt-[100px] ${darkMode ? "text-white" : "text-gray-900"}`}>
          ჩვენი სერვისები
        </h2>

        {services.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const isOwner = currentUser && service.owner?._id === currentUser._id;
              return (
                <div
                  key={service._id}
                  onClick={() => navigate(`/service/${service._id}`, { state: service })}
                  className={`shadow-md rounded-2xl p-6 transform transition duration-300 hover:scale-105 hover:shadow-xl ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}
                >
                  <h3 className="text-2xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-base mb-4">{service.description}</p>
                  {service.type === "offering" && (
                    <p className={`font-semibold ${darkMode ? "text-yellow-400" : "text-green-600"}`}>
                      ფასი: {service.price} {service.currency}
                    </p>
                  )}
                  <p className={`mt-1 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    კატეგორია: {service.category}
                  </p>

                  <div className="flex justify-end mt-4 space-x-2">
                    {isOwner && (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEdit(service); }}
                          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                        >
                          განახლება
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(service._id); }}
                          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                        >
                          წაშლა
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className={`text-center text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            სერვისები ვერ მოიძებნა...
          </p>
        )}
      </section>

      <Modal open={!!editingService} onClose={() => setEditingService(null)} darkMode={darkMode}>
        {editingService && (
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold mb-4">სერვისის განახლება</h3>
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full mb-2 p-2 rounded border"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full mb-2 p-2 rounded border"
            />
            {formData.type === "offering" && (
              <>
                <input
                  type="number"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full mb-2 p-2 rounded border"
                />
                <input
                  type="text"
                  placeholder="Currency"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full mb-2 p-2 rounded border"
                />
              </>
            )}
            <input
              type="text"
              placeholder="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full mb-2 p-2 rounded border"
            />

            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                განახლება
              </button>
              <button
                onClick={() => setEditingService(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                დახურვა
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
