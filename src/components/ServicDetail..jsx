import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export default function ServiceDetail({ darkMode }) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const token = Cookies.get("token");

  const [service, setService] = useState(location.state || null);
  const [currentUser, setCurrentUser] = useState(null);
  const [proposals, setProposals] = useState([]);

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

  useEffect(() => {
    if (!service) {
      fetch(`https://api.k4h.dev/services/${id}`)
        .then(res => res.json())
        .then(data => setService(data))
        .catch(err => {
          console.error("Error fetching service:", err);
          toast.error("Service not found");
          navigate(-1);
        });
    }
  }, [id, service, navigate]);

  useEffect(() => {
    if (service) {
      fetch(`https://api.k4h.dev/proposals/service/${service._id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
        .then(res => res.json())
        .then(data => setProposals(data))
        .catch(err => console.error("Error fetching proposals:", err));
    }
  }, [service, token]);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-500 font-semibold">Service not found</p>
      </div>
    );
  }

  const isOffering = service.type === "offering";
  const isOwner = currentUser && service.owner?._id === currentUser._id;

  return (
    <div className="max-w-5xl mx-auto mt-20 flex flex-col lg:flex-row gap-10">
  <div className="lg:w-1/2 flex flex-col gap-4">
    <h1 className="text-4xl font-extrabold">{service.title}</h1>
    <p className="text-lg">{service.description}</p>

    {isOffering && (
      <p className={`text-2xl font-semibold ${darkMode ? "text-yellow-400" : "text-green-600"}`}>
        ფასი: {service.price}{" "}
        {service.currency === "USD" ? "$" : service.currency === "EUR" ? "€" : service.currency}
      </p>
    )}

    <p className="text-lg">
      კატეგორია: <span className="font-semibold">{service.category}</span>
    </p>

    {service.owner && (
      <div className="flex items-center gap-3 mt-2">
        <img
          src={service.owner.profile_image}
          alt={service.owner.real_name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold">{service.owner.real_name}</p>
          <a href={`http://k4h.dev/${service.owner.username}`} className="text-sm text-gray-500">
  @{service.owner.username}
</a>
        </div>
      </div>
    )}

    {service.tags && service.tags.length > 0 && (
      <div className="mt-4">
        <span className="font-semibold">Tags: </span>
        {service.tags.join(", ")}
      </div>
    )}

    {service.createdAt && (
      <p className="mt-2 text-sm text-gray-400">
        შექმნილია: {new Date(service.createdAt).toLocaleDateString()}
      </p>
    )}

    {!isOwner && token && (
      <button
        onClick={() => navigate(`/propose/${service._id}`, { state: service })}
        className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        შეთავაზების გაკეთება
      </button>
    )}

    {isOwner && (
      <p className="mt-6 text-red-500 font-semibold">
        ეს სერვისი თქვენ გეკუთვნით, შეთავაზების გაგზავნა შეუძლებელია.
      </p>
    )}
  </div>

  {service.image_url && service.image_url.startsWith("http") && (
    <div className="lg:w-1/2 flex justify-center items-start">
      <img
        src={service.image_url}
        alt={service.title}
        className="w-full max-h-96 object-cover rounded-xl"
      />
    </div>
  )}
</div>

  );
}
