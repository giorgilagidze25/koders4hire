import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export default function Propose({ darkMode }) {
  const { state } = useLocation();
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const token = Cookies.get("token");

  const [service, setService] = useState(state || null);
  const [formData, setFormData] = useState({
    message: "",
    price: state?.price || 0,
  });

  const fetchService = async (id) => {
    try {
      const res = await fetch(`https://api.k4h.dev/services/${id}`);
      const data = await res.json();
      if (res.ok) return data;
    } catch (err) {
      console.error("Error fetching service:", err);
    }
    return null;
  };

  useEffect(() => {
    if (!service) {
      fetchService(serviceId).then((data) => {
        if (data) {
          setService(data);
          if (data.price) setFormData((prev) => ({ ...prev, price: data.price }));
        } else {
          toast.error("Service not found");
          navigate(-1);
        }
      });
    }
  }, [serviceId, service, navigate]);

  const handleSubmit = async () => {
    if (!token) return toast.error("Not authorized");

    try {
      const res = await fetch(`https://api.k4h.dev/proposals/${serviceId}/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: formData.message,
          proposedPrice: formData.price,
        }),
      });

      if (res.ok) {
        toast.success("Proposal submitted successfully");
        navigate(-1);
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to submit proposal");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    }
  };

  if (!service) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
        იტვირთება...
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="max-w-lg w-full p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">შეთავაზების გაგზავნა</h2>
        <p className="mb-2">სერვისი: {service.title}</p>

        <textarea
          placeholder="შეიყვანეთ შეტყობინება"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full p-2 mb-2 rounded border dark:bg-gray-700 dark:text-white"
        />

          <input
            type="number"
            placeholder="თქვენი შეთავაზებული ფასი"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            className="w-full p-2 mb-2 rounded border dark:bg-gray-700 dark:text-white"
          />


        <button
          onClick={handleSubmit}
          className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          გაგზავნა
        </button>
        <button
          onClick={() => navigate(-1)}
          className="w-full py-2 mt-2 bg-gray-400 text-white rounded hover:bg-gray-500"
        >
          დახურვა
        </button>
      </div>
    </div>
  );
}
