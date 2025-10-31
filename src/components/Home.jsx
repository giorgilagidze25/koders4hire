import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { CheckCircle } from "lucide-react";
import data from "./data";
import { useCart } from "../context/CartContext"; 

export default function Home({ darkMode }) {
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    currency: "",
    category: "",
    tags: [],
    type: "request",
  });

  const token = Cookies.get("token");
  const { addToCart } = useCart(); 

  useEffect(() => {
    fetch("https://api.k4h.dev/services")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setServices(data);
      })
      .catch((err) => console.error("Service fetch error:", err));
  }, []);

  const handleDelete = async (id) => {
    if (!token) {
      alert("Not authorized");
      return;
    }

    try {
      const res = await fetch(`https://api.k4h.dev/services/del/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        setServices((prev) => prev.filter((s) => s._id !== id));
      } else if (res.status === 403) {
        alert("Not authorized");
      } else if (res.status === 404) {
        alert("Service not found");
      } else {
        alert("Error deleting service");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service._id);
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
    if (!token) {
      alert("Not authorized");
      return;
    }

    try {
      const res = await fetch(`https://api.k4h.dev/services/upd/${editingService}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.status === 200) {
        const updated = await res.json();
        setServices((prev) =>
          prev.map((s) => (s._id === editingService ? updated : s))
        );
        setEditingService(null);
      } else if (res.status === 403) {
        alert("Not authorized");
      } else if (res.status === 404) {
        alert("Service not found");
      } else {
        alert("Error updating service");
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
      }`}
    >
      <section className="max-w-screen-xl mx-auto px-6 py-16">
        <h2
          className={`text-4xl font-bold text-center mb-12 mt-[100px] ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          ჩვენი სერვისები
        </h2>

        {services.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service._id}
                className={`shadow-md rounded-2xl p-6 transform transition duration-300 hover:scale-105 hover:shadow-xl ${
                  darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
                }`}
              >
                <h3 className="text-2xl font-semibold mb-2">{service.title}</h3>
                <p className="text-base mb-4">{service.description}</p>
                <p
                  className={`font-semibold ${
                    darkMode ? "text-yellow-400" : "text-green-600"
                  }`}
                >
                  ფასი: {service.price}{" "}
                  {service.currency === "USD"
                    ? "$"
                    : service.currency === "EUR"
                    ? "€"
                    : service.currency}
                </p>
                <p
                  className={`mt-1 text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  კატეგორია: {service.category}
                </p>

                <div className="flex justify-end mt-4 space-x-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                  >
                    განახლება
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                  >
                    წაშლა
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                    onClick={() => addToCart(service)}
                  >
                    კარტაში დამატება
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p
            className={`text-center text-lg ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            სერვისები ვერ მოიძებნა...
          </p>
        )}
      </section>

      {editingService && (
        <div className="max-w-xl mx-auto p-6 mt-8 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-md">
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
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full mb-2 p-2 rounded border"
          />
          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: Number(e.target.value) })
            }
            className="w-full mb-2 p-2 rounded border"
          />
          <input
            type="text"
            placeholder="Currency"
            value={formData.currency}
            onChange={(e) =>
              setFormData({ ...formData, currency: e.target.value })
            }
            className="w-full mb-2 p-2 rounded border"
          />
          <input
            type="text"
            placeholder="Category"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full mb-2 p-2 rounded border"
          />
          <button
            onClick={handleUpdate}
            className="px-4 py-2 mt-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            განახლება
          </button>
          <button
            onClick={() => setEditingService(null)}
            className="px-4 py-2 mt-2 ml-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            დახურვა
          </button>
        </div>
      )}

      <div className="flex justify-center mt-16">
        <p
          className={`text-[40px] sm:text-[50px] md:text-[30px] mt-[100px] font-bold text-center px-2 transition-colors duration-300 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          აწყობილი პროექტები
        </p>
      </div>

      <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-10 p-8">
        {data.map((item) => (
          <div
            key={item.id}
            className={`cursor-pointer w-full shadow-md rounded-2xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl min-w-[320px] ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              {item.steak && (
                <p
                  className={`mt-2 text-[20px] ${
                    darkMode ? "text-gray-300" : "text-black-700"
                  }`}
                >
                  {item.steak}
                </p>
              )}
              <p
                className={`mt-2 font-semibold ${
                  darkMode ? "text-yellow-400" : "text-green-600"
                }`}
              >
                ფასი: {item.price}
              </p>
              <h2 className="text-xl font-semibold">{item.name}</h2>
              <p className="text-base mt-3">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <section
        id="about"
        className={`py-20 transition-colors duration-300 ${
          darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2
                className={`text-4xl font-bold mb-6 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                რატომ KODERS4HIRE?
              </h2>
              <p
                className={`text-lg mb-8 leading-relaxed ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                ჩვენ უბრალოდ დეველოპერები არ ვართ – ჩვენ ვართ თქვენი
                ტექნოლოგიური პარტნიორები. გამოცდილებით და ინოვაციით ვქმნით
                გადაწყვეტილებებს, რომლებიც რეალურ ბიზნეს შედეგებს მოაქვს.
              </p>

              <div className="space-y-4">
                {[
                  "ექსპერტი დეველოპერები გამოცდილებით",
                  "Agile დეველოპმენტის მეთოდოლოგია",
                  "24/7 მხარდაჭერა და მომსახურება",
                  "მასშტაბირებადი და უსაფრთხო გადაწყვეტილებები",
                  "დროულად მიწოდების გარანტია",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                    <span
                      className={`font-medium ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { value: "100+", label: "დასრულებული პროექტი" },
                { value: "50+", label: "კმაყოფილი კლიენტი" },
                { value: "5+", label: "წლის გამოცდილება" },
                { value: "24/7", label: "მხარდაჭერა" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className={`p-6 rounded-xl shadow-lg text-center ${
                    darkMode
                      ? "bg-gray-800 text-gray-300"
                      : "bg-white text-gray-600"
                  }`}
                >
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {stat.value}
                  </div>
                  <div>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
