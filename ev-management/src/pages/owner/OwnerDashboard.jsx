import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/owner.css";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const CATEGORY_META = {
  HIGH:   { cls: "ev-ow-badge--high",   label: "High"   },
  MEDIUM: { cls: "ev-ow-badge--medium", label: "Medium" },
  LOW:    { cls: "ev-ow-badge--low",    label: "Low"    },
};

const STATUS_META = {
  Active: { cls: "ev-ow-status--active", label: "Active" },
  Idle:   { cls: "ev-ow-status--idle",   label: "Idle"   },
};

/* ── KPI CARD ── */
const KpiCard = ({ title, value, accent }) => (
  <div className={`ev-ow-kpi ${accent ? `ev-ow-kpi--${accent}` : ""}`}>
    <div className="ev-ow-kpi-value">{value ?? 0}</div>
    <div className="ev-ow-kpi-label">{title}</div>
  </div>
);

/* ── TOP LEADS TABLE ── */
const TopLeads = ({ users }) => (
  <div className="ev-ow-card">
    <div className="ev-ow-card-head">
      <h2 className="ev-ow-card-title">Top Leads</h2>
      <span className="ev-ow-card-count">{users.length}</span>
    </div>
    <div className="ev-ow-table-wrap">
      <table className="ev-ow-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Score</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr><td colSpan="3" className="ev-ow-table-empty">No leads yet</td></tr>
          ) : (
            users.map((u, i) => (
              <tr key={i}>
                <td>
                  <div className="ev-ow-user-cell">
                    <div className="ev-ow-avatar">{(u.name || "?")[0].toUpperCase()}</div>
                    <span>{u.name || "—"}</span>
                  </div>
                </td>
                <td className="ev-ow-score">{u.score}</td>
                <td>
                  <span className={`ev-ow-badge ${CATEGORY_META[u.category]?.cls || ""}`}>
                    {CATEGORY_META[u.category]?.label || u.category || "—"}
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

/* ── EMPLOYEE SUMMARY TABLE ── */
const EmployeeSummary = ({ employees, onView }) => (
  <div className="ev-ow-card">
    <div className="ev-ow-card-head">
      <h2 className="ev-ow-card-title">Employees</h2>
      <span className="ev-ow-card-count">{employees.length}</span>
    </div>
    <div className="ev-ow-table-wrap">
      <table className="ev-ow-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Active Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {employees.length === 0 ? (
            <tr><td colSpan="3" className="ev-ow-table-empty">No employees</td></tr>
          ) : (
            employees.map((emp) => (
              <tr key={emp._id} className="ev-ow-row-clickable" onClick={() => onView(emp._id)}>
                <td>
                  <div className="ev-ow-user-cell">
                    <div className="ev-ow-avatar">{(emp.name || "E")[0].toUpperCase()}</div>
                    <div>
                      <div className="ev-ow-user-name">{emp.name}</div>
                      <div className="ev-ow-user-email">{emp.email || "—"}</div>
                    </div>
                  </div>
                </td>
                <td>{emp.activeTime || 0}s</td>
                <td>
                  <span className={`ev-ow-status ${STATUS_META[emp.status]?.cls || "ev-ow-status--idle"}`}>
                    {emp.status || "Offline"}
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

/* ══ MAIN ══ */
const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats,   setStats]   = useState({});
  const [employees, setEmployees] = useState([]);
  const [topUsers,  setTopUsers]  = useState([]);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")) || {}; } catch { return {}; }
  })();

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/api/owner/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d = res.data?.data;
        if (!d) return;
        setStats(d.stats || {});
        setEmployees(d.employees || []);
        setTopUsers(d.topUsers || []);
      } catch (err) {
        console.error(err.response || err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const KPI_ROWS = [
    { title: "Total Users",       value: stats.totalUsers,       accent: ""          },
    { title: "Active Users",      value: stats.activeUsers,      accent: "active"    },
    { title: "Employees",         value: stats.totalEmployees,   accent: ""          },
    { title: "Active Employees",  value: stats.activeEmployees,  accent: "active"    },
    { title: "High Leads",        value: stats.highLeads,        accent: "high"      },
    { title: "Medium Leads",      value: stats.mediumLeads,      accent: "medium"    },
    { title: "Low Leads",         value: stats.lowLeads,         accent: "low"       },
  ];

  if (loading) return (
    <div className="ev-ow-loading">
      <div className="ev-ow-spinner" />
      <p>Loading dashboard…</p>
    </div>
  );

  return (
    <div className="ev-ow-page">

      {/* ── PAGE HEADER ── */}
      <div className="ev-ow-page-header">
        <div>
          <p className="ev-sec-label">Owner Panel</p>
          <h1 className="ev-ow-page-title">Dashboard</h1>
          <p className="ev-ow-page-sub">Welcome back, {user.name || "Owner"}</p>
        </div>
        <button
          className="ev-btn"
          style={{ width: "auto" }}
          onClick={() => navigate("/owner/add-employee")}
        >
          + Add Employee
        </button>
      </div>

      {/* ── KPI GRID ── */}
      <div className="ev-ow-kpi-grid">
        {KPI_ROWS.map((k) => (
          <KpiCard key={k.title} title={k.title} value={k.value} accent={k.accent} />
        ))}
      </div>

      {/* ── TABLES ── */}
      <div className="ev-ow-tables-grid">
        <TopLeads users={topUsers} />
        <EmployeeSummary employees={employees} onView={(id) => navigate(`/owner/employee/${id}`)} />
      </div>

    </div>
  );
};

export default OwnerDashboard;