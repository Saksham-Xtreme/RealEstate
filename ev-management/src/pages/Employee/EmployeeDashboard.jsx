import { useEffect, useState } from "react";
import axios from "axios";

const SERVER = import.meta.env.VITE_SERVER_URL || "http://localhost:8080";

const EmployeeDashboard = () => {
  const [leads, setLeads] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [notifiedLeads, setNotifiedLeads] = useState(new Set());

  // 🔥 Fetch Leads
  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${SERVER}/api/employee/leads`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLeads(res.data.data || []);
    } catch (err) {
      console.error("❌ API ERROR:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Polling (Live Updates)
  useEffect(() => {
    fetchLeads();

    const interval = setInterval(fetchLeads, 5000);

    return () => clearInterval(interval);
  }, []);

  // 🔍 Filter
  const filteredLeads =
    filter === "ALL"
      ? leads
      : leads.filter((l) => l.leadCategory === filter);

  // 🔥 SORTING (IMPORTANT)
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (a.leadCategory === "HIGH" && b.leadCategory !== "HIGH") return -1;
    if (b.leadCategory === "HIGH" && a.leadCategory !== "HIGH") return 1;
    return (b.leadScore || 0) - (a.leadScore || 0);
  });

  // 📊 Stats
  const stats = {
    total: leads.length,
    high: leads.filter((l) => l.leadCategory === "HIGH").length,
    medium: leads.filter((l) => l.leadCategory === "MEDIUM").length,
    low: leads.filter((l) => l.leadCategory === "LOW").length,
  };

  // 🔥 HIGH LEAD ALERT SYSTEM
  useEffect(() => {
    leads.forEach((lead) => {
      if (
        lead.leadCategory === "HIGH" &&
        !notifiedLeads.has(lead._id)
      ) {
        alert(`🔥 High Intent Lead: ${lead.email}`);

        setNotifiedLeads((prev) => {
          const updated = new Set(prev);
          updated.add(lead._id);
          return updated;
        });
      }
    });
  }, [leads, notifiedLeads]);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* KPI */}
      <div className="grid grid-cols-4 gap-4">
        <Card title="Total Leads" value={stats.total} />
        <Card title="High" value={stats.high} color="text-red-500" />
        <Card title="Medium" value={stats.medium} color="text-yellow-500" />
        <Card title="Low" value={stats.low} color="text-green-500" />
      </div>

      {/* FILTER */}
      <div className="flex gap-3">
        {["ALL", "HIGH", "MEDIUM", "LOW"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg border ${
              filter === f ? "bg-black text-white" : "bg-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="p-3">User</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Visits</th>
              <th>Time</th>
              <th>Interactions</th>
              <th>Score</th>
              <th>Engagement</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {sortedLeads.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center p-6 text-gray-500">
                  No leads found
                </td>
              </tr>
            ) : (
              sortedLeads.map((lead) => (
                <tr
                  key={lead._id}
                  className={`border-t ${
                    lead.leadCategory === "HIGH"
                      ? "bg-red-100"
                      : lead.leadCategory === "MEDIUM"
                      ? "bg-yellow-50"
                      : ""
                  }`}
                >
                  <td className="p-3 font-medium">
                    {lead.name || lead.email}
                  </td>
                  <td>{lead.email || "-"}</td>
                  <td>{lead.phone || "-"}</td>
                  <td>{lead.visits || 0}</td>
                  <td>{lead.timeSpent || 0}s</td>
                  <td>{lead.interactions || 0}</td>

                  <td className="font-semibold">
                    {(lead.leadScore || 0).toFixed(1)}
                  </td>

                  <td>
                    {(lead.engagementScore || 0).toFixed(2)}
                  </td>

                  <td>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        lead.isActive
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {lead.isActive ? "Active" : "Idle"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// KPI CARD
const Card = ({ title, value, color = "text-black" }) => (
  <div className="bg-white shadow rounded-xl p-4">
    <p className="text-sm text-gray-500">{title}</p>
    <h2 className={`text-2xl font-bold ${color}`}>{value}</h2>
  </div>
);

export default EmployeeDashboard;