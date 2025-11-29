import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const COLORS = ["#FF8042", "#00C49F", "#0088FE", "#FFBB28"];
const allowedRoles = [
  "owner", "admin", "moderator",
  "client",
  "backend", "frontend", "fullstack",
  "rust", "cpp", "cs", "systems-developer", "embedded-developer", "firmware-developer", "device-driver-developer", "kernel-developer",
  "web-developer",
  "mobile-developer", "ios-developer", "android-developer", "flutter-developer", "react-native-developer",
  "game-developer", "graphics-programmer", "unity-developer", "unreal-developer", "vr-developer", "ar-developer",
  "devops-engineer", "site-reliability-engineer", "cloud-engineer", "infrastructure-engineer", "platform-engineer", "release-engineer",
  "data-engineer", "data-scientist", "ml-engineer", "ai-engineer", "deep-learning-engineer", "nlp-engineer", "cv-engineer", "mleops-engineer", "big-data-developer", "data-visualization-developer",
  "security-engineer", "application-security-engineer", "penetration-tester", "red-teamer", "reverse-engineer",
  "blockchain-developer", "smart-contract-developer", "solidity-developer", "web3-developer", "dapp-developer",
  "qa-engineer", "test-automation-engineer", "manual-tester", "performance-tester",
  "ui-developer", "ux-developer", "graphic-designer", "ui-ux-designer", "product-designer",
  "simulation-developer", "bioinformatics-developer", "quant-developer", "hardware-software-integration-developer", "robotics-developer", "audio-software-developer", "financial-software-developer",
  "scripting-developer", "build-engineer", "ci-cd-engineer",
  "no-code-developer", "low-code-developer",
  "technical-writer", "project-manager", "product-manager", "scrum-master", "technical-support-engineer", "database-administrator", "network-engineer",
  "vibecoder"
];

export default function Dashboard({ darkMode, setDarkMode }) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [serviceCount, setServiceCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [pendingVerifications, setPendingVerifications] = useState(0);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [modal, setModal] = useState({ show: false, type: "", id: "", message: "" });
  const [openDropdown, setOpenDropdown] = useState(null);
  const [me, setMe] = useState(null);
  const token = Cookies.get("token");

  useEffect(() => {
    document.title = 'Admin Dashboard | Koders4Hire'
    const fetchMe = async () => {
      if (!token) return;
      try {
        const res = await fetch("https://api.k4h.dev/auth/me", { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        setMe(data);
        if (!["admin", "owner", "moderator"].includes(data.role)) {
          window.location.href = "/";
          toast.error("You are not authorized to access the dashboard.");
        }
      } catch {
        window.location.href = "/";
      }
    };
    fetchMe();
  }, [token]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return;
      try {
        const [servicesRes, usersRes, pendingRes] = await Promise.all([
          fetch("https://api.k4h.dev/admin/all-services", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("https://api.k4h.dev/admin/all-users", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("https://api.k4h.dev/admin/verifications", { headers: { Authorization: `Bearer ${token}` } })
        ]);
        const [servicesData, usersData, pendingData] = await Promise.all([servicesRes.json(), usersRes.json(), pendingRes.json()]);
        setServiceCount(Array.isArray(servicesData) ? servicesData.length : 0);
        setUserCount(Array.isArray(usersData) ? usersData.length : 0);
        setPendingVerifications(Array.isArray(pendingData) ? pendingData.length : 0);
      } catch {}
      finally { setLoading(false); }
    };
    fetchDashboardData();
  }, [token]);

  const fetchUsers = async () => {
    if (!token) return;
    try {
      const res = await fetch("https://api.k4h.dev/admin/all-users", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch {}
  };

  const fetchServices = async () => {
    if (!token) return;
    try {
      const res = await fetch("https://api.k4h.dev/admin/all-services", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    } catch {}
  };

  const fetchTransactions = async () => {
    if (!token) return;
    try {
      const res = await fetch("https://api.k4h.dev/admin/transactions", { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error(`Failed to fetch transactions: ${res.status}`);
      const data = await res.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setTransactions([]);
      toast.error("Failed to load transactions");
    }
  };

  useEffect(() => {
    if (activeSection === "users") fetchUsers();
    if (activeSection === "services") fetchServices();
    if (activeSection === "transactions") fetchTransactions();
  }, [activeSection]);

  const confirmAction = async () => {
    if (!modal.id) return;
    try {
      if (modal.type === "approve") await fetch(`https://api.k4h.dev/admin/approve/${modal.id}`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      else if (modal.type === "reject") await fetch(`https://api.k4h.dev/admin/reject/${modal.id}`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      else if (modal.type === "delete") await fetch(`https://api.k4h.dev/admin/delservice/${modal.id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      else if (modal.type === "deleteUser") await fetch(`https://api.k4h.dev/admin/deluser/${modal.id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      fetchUsers();
      fetchServices();
      fetchTransactions();
    } catch { toast.error("Action failed"); }
    finally { setModal({ show: false, type: "", id: "", message: "" }); }
  };

  const updateUserType = async (userId, newType) => {
    if (!token) return;
    try {
      const res = await fetch(`https://api.k4h.dev/admin/usertype/${userId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ newType })
      });
      const data = await res.json();
      fetchUsers();
      res.ok ? toast.success("User type updated") : toast.error(data.error || "Failed to update user type");
    } catch { toast.error("Failed to update user type"); }
    finally { setOpenDropdown(null); }
  };

  const updateRole = async (userId, newRole) => {
    if (!token) return;
    try {
      const res = await fetch(`https://api.k4h.dev/admin/userrole/${userId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ newRole })
      });
      const data = await res.json();
      fetchUsers();
      res.ok ? toast.success("User role updated") : toast.error(data.error || "Failed to update role");
    } catch { toast.error("Failed to update role"); }
    finally { setOpenDropdown(null); }
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-xl">იტვირთება მონაცემები...</div>;

  const bgColor = darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900";
  const sidebarColor = darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-900";
  const tableHeaderColor = darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900";
  const isSelf = (userId) => me && me._id && me._id === userId;

  return (
    <div className={`flex flex-col md:flex-row min-h-screen ${bgColor}`}>
      <div className={`w-full md:w-64 flex flex-col p-4 md:p-6 ${sidebarColor}`}>
        <h2 className="text-2xl font-bold mb-4 md:mb-8">Admin Panel</h2>
        <button onClick={() => setActiveSection("dashboard")} className={`text-left py-2 ${activeSection === "dashboard" ? "text-blue-400" : ""}`}>Dashboard</button>
        <button onClick={() => setActiveSection("users")} className={`text-left py-2 ${activeSection === "users" ? "text-blue-400" : ""}`}>Users</button>
        <button onClick={() => setActiveSection("services")} className={`text-left py-2 ${activeSection === "services" ? "text-blue-400" : ""}`}>Services</button>
        <button onClick={() => setActiveSection("transactions")} className={`text-left py-2 ${activeSection === "transactions" ? "text-blue-400" : ""}`}>Transactions</button>
      </div>
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        {activeSection === "dashboard" && (
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={[
                    { name: "მომხმარებლები", value: userCount },
                    { name: "სერვისები", value: serviceCount },
                    { name: "დადასტურება მოლოდინში", value: pendingVerifications }
                  ]}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label
                >
                  {COLORS.map((c, i) => <Cell key={i} fill={c} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-6 text-lg text-center space-y-1">
              <p>მომხმარებლები: {userCount}</p>
              <p>სერვისები: {serviceCount}</p>
              <p>დადასტურება მოლოდინში: {pendingVerifications}</p>
            </div>
          </div>
        )}
        {activeSection === "users" && (
          <div className="overflow-x-auto w-full">
            <h1 className="text-2xl font-bold mb-4">მომხმარებელთა მართვა</h1>
            <table className={`min-w-[900px] w-full border ${darkMode ? "border-gray-600" : "border-gray-300"}`}>
              <thead className={tableHeaderColor}>
                <tr>
                  <th className="py-2 px-4 border">Profile</th>
                  <th className="py-2 px-4 border">სახელი</th>
                  <th className="py-2 px-4 border">მომხმარებელი</th>
                  <th className="py-2 px-4 border">ელფოსტა</th>
                  <th className="py-2 px-4 border">User Type</th>
                  <th className="py-2 px-4 border">Role</th>
                  <th className="py-2 px-4 border">Verification Status</th>
                  <th className="py-2 px-4 border">მოქმედება</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => {
                  const self = isSelf(u._id);
                  return (
                    <tr key={u._id} className={`border-t ${darkMode ? "border-gray-600" : "border-gray-300"}`}>
                      <td className="py-2 px-4 border">{u.profile_image ? <img src={u.profile_image} className="w-10 h-10 rounded-full" /> : <div className="w-10 h-10 bg-gray-400 rounded-full" />}</td>
                      <td className="py-2 px-4 border">{u.real_name}</td>
                      <td className="py-2 px-4 border">{u.username}</td>
                      <td className="py-2 px-4 border">{u.email}</td>
                      <td className="py-2 px-4 border relative">
                        {openDropdown && openDropdown.id === u._id && openDropdown.kind === "user_type" ? (
                          <select defaultValue={u.user_type} onChange={e => updateUserType(u._id, e.target.value)} onBlur={() => setOpenDropdown(null)} autoFocus className="border rounded px-2 py-1 w-full">
                            <option value="developer">Developer</option>
                            <option value="user">User</option>
                          </select>
                        ) : (
                          <span className={`cursor-pointer ${self ? "opacity-60 cursor-not-allowed" : ""}`} onClick={() => { if (self) return; setOpenDropdown({ id: u._id, kind: "user_type" }); }}>{u.user_type}</span>
                        )}
                      </td>
                      <td className="py-2 px-4 border relative">
                        {openDropdown && openDropdown.id === u._id && openDropdown.kind === "role" ? (
                          <select defaultValue={u.role || "client"} onChange={e => updateRole(u._id, e.target.value)} onBlur={() => setOpenDropdown(null)} autoFocus className="border rounded px-2 py-1 w-full max-w-xs">
                            {allowedRoles.map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                        ) : (
                          <span className={`cursor-pointer ${self ? "opacity-60 cursor-not-allowed" : ""}`} onClick={() => { if (self) return; setOpenDropdown({ id: u._id, kind: "role" }); }}>{u.role || "client"}</span>
                        )}
                      </td>
                      <td className="py-2 px-4 border">
                        {u.user_type === "developer" ? (
                          u.verification_status === "approved" ? <span className="text-green-500 font-semibold">მომხმარებლის მოთხოვნა დადასტურებულია</span> :
                          u.verification_status === "rejected" ? <span className="text-red-500 font-semibold">მომხმარებლის მოთხოვნა უარყოფილია</span> :
                          <div className="space-x-1">
                            <button onClick={() => setModal({ show: true, type: "approve", id: u._id, message: "ნამდვილად გსურთ ამ მომხმარებლის დადასტურება?" })} className="bg-green-600 text-white px-3 py-1 rounded mr-1">დადასტურება</button>
                            <button onClick={() => setModal({ show: true, type: "reject", id: u._id, message: "ნამდვილად გსურთ ამ მომხმარებლის უარყოფა?" })} className="bg-red-600 text-white px-3 py-1 rounded">უარყოფა</button>
                          </div>
                        ) : "N/A"}
                      </td>
                      <td className="py-2 px-4 border flex flex-col space-y-1">
                        <button onClick={() => setModal({ show: true, type: "deleteUser", id: u._id, message: "ნამდვილად გსურთ ამ მომხმარებლის წაშლა?" })} className="bg-gray-600 text-white px-3 py-1 rounded">წაშლა</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {activeSection === "services" && (
          <div className="overflow-x-auto">
            <h1 className="text-2xl font-bold mb-4">სერვისების მართვა</h1>
            <table className={`min-w-[700px] w-full border ${darkMode ? "border-gray-600" : "border-gray-300"}`}>
              <thead className={tableHeaderColor}>
                <tr>
                  <th className="py-2 px-4 border">ID</th>
                  <th className="py-2 px-4 border">დასახელება</th>
                  <th className="py-2 px-4 border">მოქმედება</th>
                </tr>
              </thead>
              <tbody>
                {services.map(s => (
                  <tr key={s._id} className={`border-t ${darkMode ? "border-gray-600" : "border-gray-300"}`}>
                    <td className="py-2 px-4 border">{s._id}</td>
                    <td className="py-2 px-4 border">{s.name || s.title || "Untitled"}</td>
                    <td className="py-2 px-4 border">
                      <button onClick={() => setModal({ show: true, type: "delete", id: s._id, message: "ნამდვილად გსურთ ამ სერვისის წაშლა?" })} className="bg-red-600 text-white px-3 py-1 rounded">წაშლა</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeSection === "transactions" && (
          <div className="overflow-x-auto">
            <h1 className="text-2xl font-bold mb-4">ტრანზაქციები</h1>
            <table className={`min-w-[900px] w-full border ${darkMode ? "border-gray-600" : "border-gray-300"}`}>
              <thead className={tableHeaderColor}>
                <tr>
                  <th className="py-2 px-4 border">ID</th>
                  <th className="py-2 px-4 border">Service ID</th>
                  <th className="py-2 px-4 border">Buyer ID</th>
                  <th className="py-2 px-4 border">Seller ID</th>
                  <th className="py-2 px-4 border">Amount Paid</th>
                  <th className="py-2 px-4 border">Currency</th>
                  <th className="py-2 px-4 border">Platform Earnings</th>
                  <th className="py-2 px-4 border">Developer Earnings</th>
                  <th className="py-2 px-4 border">Created At</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(t => (
                  <tr key={t._id} className={`border-t ${darkMode ? "border-gray-600" : "border-gray-300"}`}>
                    <td className="py-2 px-4 border">{t._id}</td>
                    <td className="py-2 px-4 border">{t.serviceID}</td>
                    <td className="py-2 px-4 border">{t.buyerID}</td>
                    <td className="py-2 px-4 border">{t.sellerID}</td>
                    <td className="py-2 px-4 border">{t.amountPaid}</td>
                    <td className="py-2 px-4 border">{t.currency}</td>
                    <td className="py-2 px-4 border">{t.platformEarnings}</td>
                    <td className="py-2 px-4 border">{t.developerEarnings}</td>
                    <td className="py-2 px-4 border">{new Date(t.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {modal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-40">
          <div className={`rounded-lg p-6 w-full max-w-sm text-center ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
            <p className="mb-6">{modal.message}</p>
            <div className="flex justify-around">
              <button onClick={confirmAction} className="bg-blue-600 text-white px-4 py-2 rounded">Yes</button>
              <button onClick={() => setModal({ show: false, type: "", id: "", message: "" })} className="bg-gray-400 text-white px-4 py-2 rounded">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
