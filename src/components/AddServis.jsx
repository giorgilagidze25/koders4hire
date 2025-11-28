import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function AddService({ darkMode }) {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    currency: "USD",
    category: "",
    tags: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;

      try {
        const res = await fetch("https://api.k4h.dev/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error.message);
      }
    };

    fetchUser();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrors({});

    try {
      const formData = new FormData(); 

      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("price", form.price);
      formData.append("currency", form.currency);
      formData.append("type", "offering");

      const tagsArray = form.tags.split(",").map((t) => t.trim());
      tagsArray.forEach((tag) => formData.append("tags", tag));

      if (image) {
        formData.append("image_url", image);
      }

      const res = await fetch("https://api.k4h.dev/services/new", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("სერვისი წარმატებით დაემატა!");
        setForm({
          title: "",
          description: "",
          price: "",
          currency: "USD",
          category: "",
          tags: "",
        });
        setImage(null);
      } else {
        setMessage(data.message || "შეცდომა მოხდა");
      }
    } catch (error) {
      setMessage("შეცდომა: " + error.message);
    }

    setLoading(false);
  };

  if (!user) {
    return (
      <div
        className={`text-center mt-10 min-h-screen flex items-center justify-center ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
        }`}
      >
        იტვირთება...
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col items-center pt-10 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div
        className={`max-w-xl w-full p-8 rounded-2xl shadow-lg mt-[100px] ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
          სერვისის დამატება
        </h2>

        {message && (
          <p
            className={`mb-4 text-center ${
              message.includes("შეცდომა") ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="სერვისის სათაური"
            className="w-full p-2 border rounded-md"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="აღწერა"
            className="w-full p-2 border rounded-md"
          />

          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="ფასი"
            className="w-full p-2 border rounded-md"
          />

          <select
            name="currency"
            value={form.currency}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>

          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="კატეგორია"
            className="w-full p-2 border rounded-md"
          />

          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="ტეგები (გამიჯნე მძიმით)"
            className="w-full p-2 border rounded-md"
          />

          <input
            type="file"
            name="image_url"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded-md"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "იტვირთება..." : "დამატება"}
          </button>
        </form>
      </div>
    </div>
  );
}
