import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/owner.css";

const SERVER = import.meta.env.VITE_SERVER_URL;

const DetailRow = ({ label, value }) => (
  <div className="ev-ow-detail-row">
    <span className="ev-ow-detail-label">{label}</span>
    <span className="ev-ow-detail-value">{value || "—"}</span>
  </div>
);

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [emp,     setEmp]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${SERVER}/api/owner/employee/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmp(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <div className="ev-ow-loading">
      <div className="ev-ow-spinner" /><p>Loading employee…</p>
    </div>
  );

  if (!emp) return (
    <div className="ev-ow-loading">
      <p style={{ color: "var(--tl)" }}>Employee not found.</p>
    </div>
  );

  const isActive = emp.status === "Active";

  return (
    <div className="ev-ow-page">

      <button className="ev-ow-back-btn" onClick={() => navigate(-1)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Back
      </button>

      <div className="ev-ow-page-header" style={{ marginTop: "var(--sp-md)" }}>
        <div>
          <p className="ev-sec-label">Employee Profile</p>
          <h1 className="ev-ow-page-title">Employee Detail</h1>
        </div>
      </div>

      <div className="ev-ow-detail-layout">

        {/* ── PROFILE CARD ── */}
        <div className="ev-ow-card ev-ow-profile-card">
          <div className="ev-ow-profile-avatar">
            {(emp.name || "E")[0].toUpperCase()}
          </div>
          <div className="ev-ow-profile-name">{emp.name}</div>
          <div className="ev-ow-profile-role">Employee</div>
          <span className={`ev-ow-status ${isActive ? "ev-ow-status--active" : "ev-ow-status--idle"}`}>
            {emp.status || "Offline"}
          </span>
        </div>

        {/* ── DETAIL CARD ── */}
        <div className="ev-ow-card ev-ow-detail-card">
          <h3 className="ev-ow-card-title" style={{ marginBottom: "var(--sp-md)" }}>Contact & Activity</h3>
          <DetailRow label="Email"       value={emp.email} />
          <DetailRow label="Phone"       value={emp.phone} />
          <DetailRow label="Last Login"  value={emp.lastLogin ? new Date(emp.lastLogin).toLocaleString("en-IN") : "Never"} />
          <DetailRow label="Active Time" value={`${emp.activeTime || 0}s`} />
          <DetailRow label="Status"      value={emp.status} />
        </div>

      </div>
    </div>
  );
};

export default EmployeeDetail;