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
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({ message: "", price: state?.price || 0 });

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setCurrentUser({ _id: payload.userId });
      } catch (err) {
        console.error("Token parse error:", err);
      }
    }
  }, [token]);

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

  if (!service) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}>
        იტვირთება...
      </div>
    );
  }

  const isOwner = currentUser && service.owner?._id === currentUser._id;

  const handleSubmit = async () => {
    if (!token) return toast.error("Not authorized");
    if (isOwner) return toast.error("Cannot propose to your own service");

    try {
      const res = await fetch(`https://api.k4h.dev/proposals/${serviceId}/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: formData.message, price: formData.price }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Proposal submitted successfully");
        navigate('/profile');
      } else {
        toast.error(data.error || "Failed to submit proposal");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
      darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
    }`}>
      <div className={`max-w-lg w-full p-6 rounded-xl shadow-lg space-y-4 transition-colors duration-300 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}>
        <h2 className="text-2xl font-bold mb-2">შეთავაზების გაგზავნა</h2>

        <p><strong>სერვისი:</strong> {service.title}</p>
        <p><strong>აღწერა:</strong> {service.description}</p>
        <p><strong>კატეგორია:</strong> {service.category}</p>
        <p><strong>სერვისის ტიპი:</strong> {service.type}</p>
        <p><strong>მფლობელი:</strong> {service.owner?.real_name} (@{service.owner?.username})</p>
        {service.type === "offering" && (
          <p><strong>ორიგინალური ფასი:</strong> {service.price} {service.currency}</p>
        )}

        {!isOwner ? (
          <>
            <textarea
              placeholder="შეიყვანეთ შეტყობინება"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className={`w-full p-2 rounded border transition-colors duration-300 ${
                darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"
              }`}
            />
            <input
              type="number"
              placeholder="თქვენი შეთავაზებული ფასი"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className={`w-full p-2 rounded border transition-colors duration-300 ${
                darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"
              }`}
            />
            <button
              onClick={handleSubmit}
              className={`w-full py-2 rounded transition-colors duration-300 ${
                darkMode ? "bg-green-600 hover:bg-green-700 text-white" : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              გაგზავნა
            </button>
          </>
        ) : (
          <p className="text-red-500 font-semibold">ეს სერვისი თქვენ გეკუთვნით, შეთავაზების გაგზავნა შეუძლებელია.</p>
        )}

        <button
          onClick={() => navigate(-1)}
          className={`w-full py-2 rounded transition-colors duration-300 ${
            darkMode ? "bg-gray-400 hover:bg-gray-500 text-white" : "bg-gray-300 hover:bg-gray-400 text-gray-900"
          }`}
        >
          დახურვა
        </button>
      </div>
    </div>
  );
}
