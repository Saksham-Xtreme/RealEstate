import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/owner.css";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const Field = ({ label, children }) => (
  <div className="ev-lf-field">
    <label className="ev-lf-label">{label}</label>
    {children}
  </div>
);

const AddEmployee = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name)     return setError("Name is required.");
    if (!form.phone)    return setError("Phone is required.");
    if (!form.password) return setError("Password is required.");
    setError(""); setLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${BASE_URL}/api/owner/add-employee`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(true);
      setForm({ name: "", email: "", password: "", phone: "" });
      setTimeout(() => navigate("/owner/employees"), 1400);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add employee.");
    } finally {
      setLoading(false);
    }
  };

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
          <p className="ev-sec-label">Team Management</p>
          <h1 className="ev-ow-page-title">Add Employee</h1>
          <p className="ev-ow-page-sub">Create a new employee account with login credentials.</p>
        </div>
      </div>

      <div className="ev-ow-card ev-ow-form-card">

        <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "var(--sp-md)" }}>

          <Field label="Full Name *">
            <input
              className="ev-lf-input"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Employee's full name"
              autoComplete="off"
            />
          </Field>

          <Field label="Phone *">
            <div className="ev-auth-phone-wrap">
              <span className="ev-auth-dial">+91</span>
              <input
                className="ev-lf-input ev-auth-phone-input"
                type="tel"
                name="phone"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
                placeholder="10-digit mobile number"
                maxLength={10}
              />
            </div>
          </Field>

          <Field label="Email (optional)">
            <input
              className="ev-lf-input"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="employee@example.com"
              autoComplete="off"
            />
          </Field>

          <Field label="Password *">
            <div className="ev-auth-pass-wrap">
              <input
                className="ev-lf-input ev-auth-pass-input"
                type={showPass ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a password"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="ev-auth-pass-toggle"
                onClick={() => setShowPass((p) => !p)}
                tabIndex={-1}
              >
                {showPass ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </Field>

          {error && (
            <div className="ev-lf-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          {success && (
            <div className="ev-lf-success">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Employee added! Redirecting…
            </div>
          )}

          <div className="ev-lf-actions">
            <button type="button" className="ev-btn-outline" style={{ width: "auto" }} onClick={() => navigate(-1)} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="ev-btn" style={{ width: "auto", minWidth: 160 }} disabled={loading || success}>
              {loading ? "Adding…" : success ? "Added ✓" : "Add Employee"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddEmployee;