import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function UserCard({ darkMode }) {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [ratings, setRatings] = useState({ averageRating: 0, totalScore: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndServices = async () => {
      try {
        const userRes = await fetch(`https://api.k4h.dev/users/${username}`);
        const userData = await userRes.json();

        if (!userRes.ok) {
          toast.error("User not found");
          setLoading(false);
          return;
        }

        setUser(userData);
        fetchRatings(userData._id);

        const serviceRes = await fetch(`https://api.k4h.dev/services`);
        const serviceData = await serviceRes.json();

        if (serviceRes.ok && Array.isArray(serviceData)) {
          const userServices = serviceData.filter(
            (s) =>
              s.owner?._id === userData._id ||
              s.owner?.username === userData.username
          );
          setServices(userServices);
        } else {
          toast.error("Failed to load services");
        }
      } catch {
        toast.error("Something went wrong while loading profile");
      } finally {
        setLoading(false);
      }
    };

    const fetchRatings = async (userId) => {
      try {
        const res = await fetch(`https://api.k4h.dev/rating/user/${userId}`);
        const data = await res.json();
        if (res.ok) setRatings(data);
      } catch {
        toast.error("Failed to load ratings");
      }
    };

    fetchUserAndServices();
  }, [username]);

  if (loading)
    return (
      <div
        className={`min-h-screen flex justify-center items-center ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
        }`}
      >
        იტვირთება...
      </div>
    );

  if (!user)
    return (
      <div
        className={`min-h-screen flex justify-center items-center text-xl ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
        }`}
      >
        User not found.
      </div>
    );

  return (
    <div
      className={`min-h-screen p-6 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
      }`}
    >
      <div
        className={`max-w-3xl mx-auto rounded-2xl p-6 shadow-lg ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <img
            src={
              user.profile_image 
            }
            alt={user.username}
            className="w-32 h-32 rounded-full object-cover border"
          />

          <div className="text-center md:text-left space-y-2">
            <h2 className="text-3xl font-bold">{user.real_name || "Unidentified User"}</h2>
            <p className="opacity-80">@{user.username}</p>
            {
  (user.role && user.role.length > 0)
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "N/A"
}
            <div className="mt-2 text-yellow-400 font-semibold">
              ⭐ {ratings.averageRating} ({ratings.totalScore} total score)
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-2xl font-bold mb-4 border-b pb-2">Services</h3>
          {services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((s) => (
                <div
                  key={s._id}
                  className={`p-4 rounded-xl shadow transition ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <h4 className="font-semibold text-lg mb-1">{s.title}</h4>
                  <p className="text-sm mb-2">{s.description}</p>
                  <div className="text-sm opacity-80">
                    <p>
                      💲 {s.price} {s.currency}
                    </p>
                    <p>⭐ {s.averageRating || 0}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="opacity-70 text-center mt-4">No services yet.</p>
          )}
        </div>

        <div className="mt-10 text-center opacity-70 text-sm">
          Joined: {new Date(user.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
