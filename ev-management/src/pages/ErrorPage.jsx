import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/error-page.css";

const ErrorPage = ({ code = "404", message = "Page not found" }) => {
  const navigate = useNavigate();

  return (
    <div className="ev-err-page">

      {/* ── LOGO ── */}
      <div className="ev-err-logo" onClick={() => navigate("/")}>
        <div className="ev-nav-mark">
          <svg viewBox="0 0 24 24" fill="white" width="14" height="14">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
        </div>
        EV CRM
      </div>

      {/* ── CARD ── */}
      <div className="ev-err-card">

        {/* ILLUSTRATION */}
        <div className="ev-err-illustration">
          <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="ev-err-svg">
            {/* ground */}
            <rect x="20" y="112" width="160" height="2" rx="1" fill="var(--b100)" />
            {/* building left */}
            <rect x="28" y="60" width="36" height="52" rx="4" fill="var(--b50)" stroke="var(--b100)" strokeWidth="1.5"/>
            <rect x="34" y="68" width="8" height="8" rx="1" fill="var(--b200)"/>
            <rect x="46" y="68" width="8" height="8" rx="1" fill="var(--b200)"/>
            <rect x="34" y="82" width="8" height="8" rx="1" fill="var(--b200)"/>
            <rect x="46" y="82" width="8" height="8" rx="1" fill="var(--b100)"/>
            <rect x="38" y="96" width="8" height="16" rx="1" fill="var(--b100)"/>
            {/* building right */}
            <rect x="136" y="72" width="36" height="40" rx="4" fill="var(--b50)" stroke="var(--b100)" strokeWidth="1.5"/>
            <rect x="142" y="80" width="7" height="7" rx="1" fill="var(--b200)"/>
            <rect x="153" y="80" width="7" height="7" rx="1" fill="var(--b100)"/>
            <rect x="142" y="92" width="7" height="7" rx="1" fill="var(--b100)"/>
            <rect x="153" y="92" width="7" height="7" rx="1" fill="var(--b200)"/>
            <rect x="148" y="99" width="8" height="13" rx="1" fill="var(--b100)"/>
            {/* magnifier handle */}
            <line x1="126" y1="90" x2="140" y2="104" stroke="var(--b400)" strokeWidth="4" strokeLinecap="round"/>
            {/* magnifier circle */}
            <circle cx="107" cy="72" r="26" fill="white" stroke="var(--b400)" strokeWidth="3"/>
            {/* question mark */}
            <text x="107" y="80" textAnchor="middle" fontFamily="var(--font-head)" fontSize="24" fontWeight="800" fill="var(--b600)">?</text>
          </svg>
        </div>

        {/* CODE + MESSAGE */}
        <div className="ev-err-code">{code}</div>
        <h1 className="ev-err-title">{message}</h1>
        <p className="ev-err-sub">
          The page you're looking for doesn't exist, was moved, or requires sign-in.
        </p>

        {/* ACTIONS */}
        <div className="ev-err-actions">
          <button className="ev-btn" style={{ width: "auto" }} onClick={() => navigate("/")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            </svg>
            Go Home
          </button>
          <button className="ev-btn-outline" style={{ width: "auto" }} onClick={() => navigate(-1)}>
            ← Go Back
          </button>
          <button className="ev-btn-outline" style={{ width: "auto" }} onClick={() => navigate("/login")}>
            Login
          </button>
        </div>

      </div>

      {/* FOOTER NOTE */}
      <p className="ev-err-footer">
        If you think this is a mistake, contact your administrator.
      </p>

    </div>
  );
};

export default ErrorPage;