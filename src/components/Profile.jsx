import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Profile({ darkMode }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("info");
  const [services, setServices] = useState([]);
  const [ratings, setRatings] = useState({ averageRating: 0, totalScore: 0 });
  const [updateForm, setUpdateForm] = useState({ real_name: "", username: "", email: "" });
  const [profileImage, setProfileImage] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [receivedProposals, setReceivedProposals] = useState([]);
  const [sentProposals, setSentProposals] = useState([]);

  const token = Cookies.get("token");
  const sidebarColor = darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-900";

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch("https://api.k4h.dev/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data);
          setUpdateForm({
            real_name: data.real_name || "",
            username: data.username || "",
            email: data.email || "",
          });
          fetchRatings(data._id);
          fetchServices(data._id);
          fetchProposals();
        }
      } catch {
        toast.error("Failed to fetch profile");
      }
    };

    const fetchRatings = async (userId) => {
      try {
        const res = await fetch(`https://api.k4h.dev/rating/user/${userId}`);
        const data = await res.json();
        if (res.ok) setRatings(data);
      } catch {
        toast.error("Failed to fetch ratings");
      }
    };

    const fetchServices = async (userId) => {
      try {
        const res = await fetch("https://api.k4h.dev/services");
        const allServices = await res.json();
        const myServices = allServices.filter(s => s.owner?._id === userId);
        setServices(myServices);
      } catch {
        toast.error("Failed to fetch services");
      }
    };

    const fetchProposals = async () => {
      try {
        const receivedRes = await fetch("https://api.k4h.dev/proposals/received", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (receivedRes.ok) setReceivedProposals(await receivedRes.json());

        const sentRes = await fetch("https://api.k4h.dev/proposals/sent", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (sentRes.ok) setSentProposals(await sentRes.json());
      } catch {
        toast.error("Failed to fetch proposals");
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
    try {
      const formData = new FormData();
      formData.append("real_name", updateForm.real_name);
      formData.append("username", updateForm.username);
      formData.append("email", updateForm.email);

      const res = await fetch("https://api.k4h.dev/users/upd", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Profile updated successfully");
        setUser(data);
      } else toast.error("Failed to update profile");
    } catch {
      toast.error("An error occurred");
    }
  };

  const handleProfileImageUpload = async () => {
    if (!profileImage) return toast.error("Please select an image");

    try {
      const formData = new FormData();
      formData.append("profile_image", profileImage);
      formData.append("real_name", updateForm.real_name);
      formData.append("username", updateForm.username);
      formData.append("email", updateForm.email);

      const res = await fetch("https://api.k4h.dev/users/upd", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Profile updated successfully");
        setUser(data);
        setProfileImage(null);
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch {
      toast.error("An error occurred while updating profile");
    }
  };

  const handleProposalApproval = async (proposalId) => {
    try {
      const req = await fetch(`https://api.k4h.dev/proposals/${proposalId}/accept`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const res = await req.json();

      if (req.ok) {
        toast.success("Proposal approved successfully");
        setReceivedProposals(prev =>
          prev.map(p => (p._id === proposalId ? res : p))
        );

        if (res.chat && res.chat._id) {
          navigate(`/chat/${res.chat._id}`);
        }
      } else {
        toast.error(res.error || "Failed to approve proposal");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve proposal");
    }
  };

  const handleProposalRejection = async (proposalId) => {
    try {
      const req = await fetch(`https://api.k4h.dev/proposals/${proposalId}/reject`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const res = await req.json();

      if (req.ok) {
        toast.success("Proposal rejected");
        setReceivedProposals(prev =>
          prev.map(p => (p._id === proposalId ? res : p))
        );
      } else {
        toast.error(res.error || "Failed to reject proposal");
      }
    } catch {
      toast.error("Failed to reject proposal");
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
      } catch {
        toast.error("Failed to delete account");
      }
    }
  };

  return (
    <div className={`min-h-screen flex ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <div className={`w-full md:w-64 flex flex-col p-4 md:p-6 ${sidebarColor}`}>
        <h2 className="text-2xl font-bold mb-4 md:mb-8">Profile Panel</h2>
        <button onClick={() => setActiveSection("info")} className={`text-left py-2 ${activeSection === "info" ? "text-blue-400 font-semibold" : "hover:text-blue-400"}`}>My Info</button>
        <button onClick={() => setActiveSection("services")} className={`text-left py-2 ${activeSection === "services" ? "text-blue-400 font-semibold" : "hover:text-blue-400"}`}>My Services</button>
        <button disabled className="text-left py-2 opacity-50 cursor-not-allowed">PayPal (temporarily disabled)</button>
        <button onClick={() => setActiveSection("danger")} className={`text-left py-2 ${activeSection === "danger" ? "text-blue-400 font-semibold" : "hover:text-blue-400"}`}>Danger Zone</button>
        <button onClick={() => setActiveSection("receivedProposals")} className={`text-left py-2 ${activeSection === "receivedProposals" ? "text-blue-400 font-semibold" : "hover:text-blue-400"}`}>Proposals Received</button>
        <button onClick={() => setActiveSection("sentProposals")} className={`text-left py-2 ${activeSection === "sentProposals" ? "text-blue-400 font-semibold" : "hover:text-blue-400"}`}>Proposals Sent</button>
      </div>

      <div className="flex-1 p-6 space-y-6">

        {activeSection === "info" && (
          <div className="max-w-xl p-6 rounded-2xl shadow-lg relative">
            <h2 className="text-3xl font-bold mb-6 text-center">User Info</h2>
            <div className="space-y-2 text-lg">
              <img src={user.profile_image} alt="Profile" className="w-24 h-24 rounded-full object-cover mb-2" />
              <input type="file" accept="image/*" onChange={e => setProfileImage(e.target.files[0])} className="mb-2" />
              <button onClick={handleProfileImageUpload} className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Update Profile Picture</button>
              <p><strong>Name:</strong> {user.real_name}</p>
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.user_type}</p>
              <p><strong>Average Rating:</strong> {ratings.averageRating} ({ratings.totalScore} total)</p>
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
            {services.length > 0 ? services.map(s => (
              <div key={s._id} className="border p-4 rounded mb-4">
                <h3 className="font-semibold text-xl">{s.title}</h3>
                <p>{s.description}</p>
                <p><strong>Price:</strong> {s.price} {s.currency}</p>
                <p>Category: {s.category}</p>
                {s.tags && s.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {s.tags.map((t, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-200 text-gray-800 rounded-full text-sm dark:bg-gray-700 dark:text-white">{t}</span>
                    ))}
                  </div>
                )}
                <button onClick={() => window.location.href = `/service/${s._id}`} className="mt-3 py-1 px-3 bg-blue-600 text-white rounded hover:bg-blue-700">View Service</button>
              </div>
            )) : <p>No services found.</p>}
          </div>
        )}

        {activeSection === "danger" && (
          <div className="space-y-4">
            <button onClick={() => { setActionType("delete"); setShowConfirmModal(true); }} className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700">Delete Account</button>
          </div>
        )}

        {activeSection === "receivedProposals" && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Proposals Received</h2>
            {receivedProposals.length > 0 ? receivedProposals.map(p => {
              const buyer = p.buyer || {};
              const service = p.service || {};
              const isPending = p.status === "pending";

              return (
                <div key={p._id} className="border p-4 rounded mb-4">
                  <p><strong>From:</strong> {buyer.real_name || "Unknown"} (@{buyer.username || "unknown"})</p>
                  <p><strong>Service:</strong> {service.title || "Untitled"}</p>
                  <p><strong>Message:</strong> {p.message}</p>
                  <p><strong>Price:</strong> {p.price} {p.currency}</p>
                  <p><strong>Status:</strong> {p.status}</p>
                  {p.status === "accepted" && p.chat?._id && (
                    <div className="mt-2 text-green-600">
                      This proposal was accepted,{" "}
                      <span
                        className="underline font-semibold cursor-pointer"
                        onClick={() => navigate(`https://chat-k4h.vercel.app/chat/${p.chat._id}`)}
                      >
                        click here to open the chat (Chat ID is {p.chat._id})
                      </span>
                    </div>
                  )}

                  {isPending && (
                    <div className="mt-3 space-x-2">
                      <button onClick={() => handleProposalApproval(p._id)} className="py-1 px-3 bg-green-600 text-white rounded hover:bg-green-700">Approve</button>
                      <button onClick={() => handleProposalRejection(p._id)} className="py-1 px-3 bg-red-600 text-white rounded hover:bg-red-700">Reject</button>
                    </div>
                  )}
                </div>
              );
            }) : <p>No proposals received yet.</p>}
          </div>
        )}

        {activeSection === "sentProposals" && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Proposals Sent</h2>
            {sentProposals.length > 0 ? sentProposals.map(p => (
              <div key={p._id} className="border p-4 rounded mb-4">
                <p><strong>To Service:</strong> {p.service?.title}</p>
                <p><strong>Message:</strong> {p.message}</p>
                <p><strong>Price:</strong> {p.price} {p.currency}</p>
                <p><strong>Status:</strong> {p.status}</p>
                {p.status === "accepted" && p.chat?._id && (
                  <p className="mt-2 text-green-600">
                    This proposal was accepted,{" "}
                    <span
                      className="underline font-semibold cursor-pointer"
                      onClick={() => navigate(`https://chat-k4h.vercel.app/chat/${p.chat._id}`)}
                    >
                      click here to open the chat (Chat ID is {p.chat._id})
                    </span>
                  </p>
                )}
              </div>
            )) : <p>No proposals sent yet.</p>}
          </div>
        )}

        {showConfirmModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className={`p-6 rounded-lg max-w-sm w-full space-y-4 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
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
