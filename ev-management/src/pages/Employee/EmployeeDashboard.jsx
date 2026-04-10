import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/employee-dashboard.css";

const SERVER = import.meta.env.VITE_SERVER_URL || "http://localhost:8080";

const formatPrice = (price) => {
  if (!price) return "—";
  return `₹${Number(price).toLocaleString("en-IN")}`;
};

// 🔥 ADDED: Time formatter function
const formatTimeSpent = (totalSeconds) => {
  if (!totalSeconds) return "0s";
  
  if (totalSeconds < 60) {
    return `${totalSeconds}s`;
  }
  
  if (totalSeconds < 3600) {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
  }
  
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

const FILTERS = ["ALL", "HIGH", "MEDIUM", "LOW"];

const CATEGORY_META = {
  HIGH:   { label: "High",   cls: "ev-ed-badge--high"   },
  MEDIUM: { label: "Medium", cls: "ev-ed-badge--medium" },
  LOW:    { label: "Low",    cls: "ev-ed-badge--low"    },
};

const EmployeeDashboard = () => {
  const navigate = useNavigate();

  const [leads,         setLeads]         = useState([]);
  const [listings,      setListings]      = useState([]);
  const [filter,        setFilter]        = useState("ALL");
  const [loading,       setLoading]       = useState(true);
  const [notifiedLeads, setNotifiedLeads] = useState(new Set());
  const [activeTab,     setActiveTab]     = useState("leads"); // "leads" | "listings"

  const token = localStorage.getItem("token");
  const authHeader = { Authorization: `Bearer ${token}` };

  const fetchLeads = async () => {
    try {
      const res = await axios.get(`${SERVER}/api/employee/leads`, { headers: authHeader });
      setLeads(res.data.data || []);
    } catch (err) {
      console.error("Leads fetch error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchListings = async () => {
    try {
      const res = await axios.get(`${SERVER}/api/listings/my`, { headers: authHeader });
      setListings(res.data.data || []);
    } catch (err) {
      console.error("Listings fetch error:", err);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchListings();
    const interval = setInterval(fetchLeads, 5000);
    return () => clearInterval(interval);
  }, []);

  /* HIGH LEAD ALERTS */
  useEffect(() => {
    leads.forEach((lead) => {
      if (lead.leadCategory === "HIGH" && !notifiedLeads.has(lead._id)) {
        setNotifiedLeads((prev) => new Set([...prev, lead._id]));
      }
    });
  }, [leads]);

  useEffect(() => {
    const BASE_URL = import.meta.env.VITE_SERVER_URL;
    const token = localStorage.getItem("token");
  
    console.log("Tracking started...");
  
    const interval = setInterval(async () => {
      try {
        await axios.post(
          `${BASE_URL}/api/owner/track-employee`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        console.log("Tracking ping sent");
  
      } catch (err) {
        console.error("Tracking failed", err);
      }
    }, 5000); // every 5 sec
  
    return () => clearInterval(interval);
  }, []);

  /* FILTER + SORT */
  const filteredLeads = leads
    .filter((l) => filter === "ALL" || l.leadCategory === filter)
    .sort((a, b) => {
      if (a.leadCategory === "HIGH" && b.leadCategory !== "HIGH") return -1;
      if (b.leadCategory === "HIGH" && a.leadCategory !== "HIGH") return 1;
      return (b.leadScore || 0) - (a.leadScore || 0);
    });

  /* STATS */
  const stats = [
    { label: "Total Leads",  value: leads.length,                                               mod: ""         },
    { label: "High Intent",  value: leads.filter((l) => l.leadCategory === "HIGH").length,      mod: "high"     },
    { label: "Medium",       value: leads.filter((l) => l.leadCategory === "MEDIUM").length,    mod: "medium"   },
    { label: "Low",          value: leads.filter((l) => l.leadCategory === "LOW").length,       mod: "low"      },
    { label: "My Listings",  value: listings.length,                                            mod: "listings" },
  ];

  if (loading) return (
    <div className="ev-ed-page">
      <div className="ev-ed-loading">
        <div className="ev-ed-loading-spinner" />
        <p>Loading dashboard…</p>
      </div>
    </div>
  );

  return (
    <div className="ev-ed-page">

      {/* ── TOPBAR ── */}
      <header className="ev-ed-topbar">
        <div className="ev-ed-topbar-inner">
          <div className="ev-nav-logo" style={{ cursor: "default" }}>
            <div className="ev-nav-mark">
              <svg viewBox="0 0 24 24" fill="white" width="14" height="14">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
            </div>
            EV CRM
          </div>

          <div className="ev-ed-topbar-right">
            <div className="ev-ed-live-pill">
              <span className="ev-pulse" />
              Live
            </div>
            <button
              className="ev-btn"
              style={{ width: "auto", padding: "8px 18px", minHeight: 36, fontSize: 13 }}
              onClick={() => navigate("/employee/createListing")}
            >
              + Add Listing
            </button>
          </div>
        </div>
      </header>

      <div className="ev-ed-wrap ev-inner">

        {/* ── KPI CARDS ── */}
        <div className="ev-ed-kpi-grid">
          {stats.map((s) => (
            <div key={s.label} className={`ev-ed-kpi ${s.mod ? `ev-ed-kpi--${s.mod}` : ""}`}>
              <div className="ev-ed-kpi-value">{s.value}</div>
              <div className="ev-ed-kpi-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── TABS ── */}
        <div className="ev-ed-tabs">
          <button
            className={`ev-ed-tab ${activeTab === "leads" ? "ev-ed-tab--active" : ""}`}
            onClick={() => setActiveTab("leads")}
          >
            Leads
            {leads.filter((l) => l.leadCategory === "HIGH").length > 0 && (
              <span className="ev-ed-tab-badge">
                {leads.filter((l) => l.leadCategory === "HIGH").length}
              </span>
            )}
          </button>
          <button
            className={`ev-ed-tab ${activeTab === "listings" ? "ev-ed-tab--active" : ""}`}
            onClick={() => setActiveTab("listings")}
          >
            My Listings
            <span className="ev-ed-tab-count">{listings.length}</span>
          </button>
        </div>

        {/* ════ LEADS TAB ════ */}
        {activeTab === "leads" && (
          <div className="ev-ed-leads-section">

            {/* FILTER PILLS */}
            <div className="ev-ed-filters">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  className={`ev-ed-filter-btn ${filter === f ? "ev-ed-filter-btn--active" : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
              <span className="ev-ed-filter-count">
                {filteredLeads.length} {filteredLeads.length === 1 ? "lead" : "leads"}
              </span>
            </div>

            {/* TABLE WRAPPER */}
            <div className="ev-ed-table-wrap">
              <table className="ev-ed-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Phone</th>
                    <th>Visits</th>
                    <th>Time</th>
                    <th>Interactions</th>
                    <th>Score</th>
                    <th>Engagement</th>
                    <th>Category</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="ev-ed-table-empty">
                        No leads found for this filter
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => (
                      <tr
                        key={lead._id}
                        className={`ev-ed-row ev-ed-row--${(lead.leadCategory || "low").toLowerCase()}`}
                      >
                        <td className="ev-ed-cell-user">
                          <div className="ev-ed-user-avatar">
                            {(lead.name || lead.email || "?")[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="ev-ed-user-name">{lead.name || "—"}</div>
                            <div className="ev-ed-user-email">{lead.email || "—"}</div>
                          </div>
                        </td>
                        <td>{lead.phone || "—"}</td>
                        <td>{lead.visits || 0}</td>
                        {/* 🔥 CHANGED: Using formatTimeSpent helper */}
                        <td>{formatTimeSpent(lead.timeSpent)}</td>
                        <td>{lead.interactions || 0}</td>
                        <td className="ev-ed-cell-score">
                          {(lead.leadScore || 0).toFixed(1)}
                        </td>
                        <td>{(lead.engagementScore || 0).toFixed(2)}</td>
                        <td>
                          <span className={`ev-ed-badge ${CATEGORY_META[lead.leadCategory]?.cls || ""}`}>
                            {CATEGORY_META[lead.leadCategory]?.label || lead.leadCategory || "—"}
                          </span>
                        </td>
                        <td>
                          <span className={`ev-ed-status ${lead.isActive ? "ev-ed-status--active" : "ev-ed-status--idle"}`}>
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
        )}

        {/* ════ LISTINGS TAB ════ */}
        {activeTab === "listings" && (
          <div className="ev-ed-listings-section">
            {listings.length === 0 ? (
              <div className="ev-int-empty" style={{ paddingTop: 48 }}>
                <div className="ev-int-empty-ico">🏠</div>
                <p className="ev-int-empty-title">No listings yet</p>
                <p className="ev-int-empty-sub">Create your first property listing.</p>
                <button
                  className="ev-btn"
                  style={{ width: "auto", marginTop: "var(--sp-lg)" }}
                  onClick={() => navigate("/employee/createListing")}
                >
                  + Add Listing
                </button>
              </div>
            ) : (
              <div className="ev-ed-listings-grid">
                {listings.map((l) => {
                  const imgSrc = l.images?.[0]?.url || l.images?.[0] || null;
                  return (
                    <div key={l._id} className="ev-ed-listing-card">
                      <div className="ev-ed-listing-img-wrap">
                        {imgSrc ? (
                          <img
                            src={imgSrc}
                            alt={l.title}
                            className="ev-ed-listing-img"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              e.currentTarget.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div
                          className="ev-ed-listing-img-fallback"
                          style={{ display: imgSrc ? "none" : "flex" }}
                        >
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                          </svg>
                        </div>
                        <span className={`ev-ed-listing-type ${l.type === "rent" ? "ev-ed-type-rent" : "ev-ed-type-buy"}`}>
                          {l.type === "rent" ? "Rent" : "Sale"}
                        </span>
                      </div>
                      <div className="ev-ed-listing-body">
                        <div className="ev-ed-listing-title">{l.title || "Untitled"}</div>
                        <div className="ev-soc-city" style={{ marginBottom: 8 }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          {l.location?.city || "—"}
                        </div>
                        <div className="ev-ed-listing-footer">
                          <span className="ev-ed-listing-price">{formatPrice(l.price)}</span>
                          <button
                            className="ev-ed-edit-btn"
                            onClick={() => navigate(`/employee/editListing/${l._id}`)}
                          >
                            Edit →
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default EmployeeDashboard;