import React, { useEffect, useState } from "react";
import axios from "axios";


const BASE_URL = import.meta.env.VITE_SERVER_URL;
// ================= STAT CARD =================
const StatCard = ({ title, value }) => (
  <div className="bg-white shadow-sm rounded-xl p-4 border">
    <p className="text-sm text-gray-500">{title}</p>
    <h2 className="text-2xl font-semibold mt-1">{value}</h2>
  </div>
);

// ================= TOP LEADS =================
const TopLeads = ({ users }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      <h2 className="text-lg font-semibold mb-4">Top Leads</h2>

      <table className="w-full text-sm">
        <thead className="text-gray-500 border-b">
          <tr>
            <th className="text-left py-2">Name</th>
            <th>Score</th>
            <th>Category</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center py-4 text-gray-400">
                No data
              </td>
            </tr>
          ) : (
            users.map((u, i) => (
              <tr key={i} className="border-b">
                <td className="py-2">{u.name || "—"}</td>
                <td className="text-center">{u.score}</td>
                <td className="text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      u.category === "HIGH"
                        ? "bg-green-100 text-green-700"
                        : u.category === "MEDIUM"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {u.category}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// ================= EMPLOYEE TABLE =================
const EmployeeTable = ({ employees }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      <h2 className="text-lg font-semibold mb-4">Employees</h2>

      <table className="w-full text-sm">
        <thead className="text-gray-500 border-b">
          <tr>
            <th className="text-left py-2">Name</th>
            <th>Email</th>
            <th>Active Time</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-400">
                No employees
              </td>
            </tr>
          ) : (
            employees.map((emp) => (
              <tr key={emp._id} className="border-b">
                <td className="py-2">{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.activeTime}s</td>
                <td>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      emp.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {emp.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// ================= MAIN DASHBOARD =================
const OwnerDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalEmployees: 0,
    activeEmployees: 0,
    highLeads: 0,
    mediumLeads: 0,
    lowLeads: 0,
  });

  const [employees, setEmployees] = useState([]);
  const [topUsers, setTopUsers] = useState([]);

  const fetchDashboard = async () => {
    try {
      const BASE_URL = import.meta.env.VITE_SERVER_URL;
      const token = localStorage.getItem("token");
  
      console.log("BASE:", BASE_URL);
      console.log("TOKEN:", token);
  
      const res = await axios.get(`${BASE_URL}/api/owner/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log("FINAL RESPONSE:", res.data);
  
      // 🔥 FIX STARTS HERE
      const dashboard = res.data?.data;
  
      if (!dashboard) {
        console.error("Invalid response structure:", res.data);
        return;
      }
  
      setStats(dashboard.stats || {});
      setEmployees(dashboard.employees || []);
      setTopUsers(dashboard.topUsers || []);
      // 🔥 FIX ENDS HERE
  
    } catch (err) {
      console.error("ERROR:", err.response || err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Owner Dashboard</h1>
        <button className="bg-black text-white px-4 py-2 rounded-lg">
          Export Excel
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <StatCard title="Total Users" value={stats?.totalUsers ?? 0} />
        <StatCard title="Active Users" value={stats?.activeUsers ?? 0} />
        <StatCard title="Employees" value={stats?.totalEmployees ?? 0} />
        <StatCard title="Active Employees" value={stats?.activeEmployees ?? 0} />
        <StatCard title="High Leads" value={stats?.highLeads ?? 0} />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopLeads users={topUsers} />
        <EmployeeTable employees={employees} />
        <p>This will get complete soon</p>
      </div>

    </div>
  );
};

export default OwnerDashboard;