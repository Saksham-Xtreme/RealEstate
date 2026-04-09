import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/employee-layout.css";

const NAV = [
  {
    to: "/employee/home",
    label: "Dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    to: "/employee/createListing",
    label: "New Listing",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    ),
  },
//   {
//     to: "/employee/leads",
//     label: "Leads",
//     icon: (
//       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
//         <circle cx="9" cy="7" r="4"/>
//         <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
//         <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
//       </svg>
//     ),
//   },
//   {
//     to: "/employee/listings",
//     label: "My Listings",
//     icon: (
//       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
//         <polyline points="9 22 9 12 15 12 15 22"/>
//       </svg>
//     ),
  //}
];

const EmployeeLayout = () => {
  const location = useLocation();
  const navigate  = useNavigate();
  const [open, setOpen] = useState(false); // mobile drawer

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")) || {}; }
    catch { return {}; }
  })();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const isActive = (to) => location.pathname === to || location.pathname.startsWith(to + "/");

  return (
    <div className="ev-el-shell">

      {/* ══════════ SIDEBAR (desktop) ══════════ */}
      <aside className="ev-el-sidebar">
        <div className="ev-el-sidebar-inner">

          {/* LOGO */}
          <div className="ev-el-logo">
            <div className="ev-nav-mark">
              <svg viewBox="0 0 24 24" fill="white" width="14" height="14">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              </svg>
            </div>
            <span>EV CRM</span>
          </div>

          {/* NAV LABEL */}
          <p className="ev-el-nav-label">Main menu</p>

          {/* NAV LINKS */}
          <nav className="ev-el-nav">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`ev-el-nav-link ${isActive(item.to) ? "ev-el-nav-link--active" : ""}`}
                onClick={() => setOpen(false)}
              >
                <span className="ev-el-nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* SPACER */}
          <div className="ev-el-spacer" />

          {/* USER CARD */}
          <div className="ev-el-user-card">
            <div className="ev-el-user-avatar">
              {(user.name || user.phone || "E")[0].toUpperCase()}
            </div>
            <div className="ev-el-user-info">
              <div className="ev-el-user-name">{user.name || "Employee"}</div>
              <div className="ev-el-user-role">Employee</div>
            </div>
            <button className="ev-el-logout-btn" onClick={handleLogout} title="Logout">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>

        </div>
      </aside>

      {/* ══════════ MOBILE HEADER ══════════ */}
      <header className="ev-el-mobile-header">
        <div className="ev-el-logo" style={{ cursor: "default" }}>
          <div className="ev-nav-mark">
            <svg viewBox="0 0 24 24" fill="white" width="14" height="14">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            </svg>
          </div>
          <span>EV CRM</span>
        </div>
        <button className="ev-el-hamburger" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          {open ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          )}
        </button>
      </header>

      {/* MOBILE DRAWER OVERLAY */}
      {open && <div className="ev-el-overlay" onClick={() => setOpen(false)} />}

      {/* MOBILE DRAWER */}
      <div className={`ev-el-drawer ${open ? "ev-el-drawer--open" : ""}`}>
        <p className="ev-el-nav-label" style={{ padding: "0 var(--sp-md)" }}>Main menu</p>
        <nav className="ev-el-nav">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`ev-el-nav-link ${isActive(item.to) ? "ev-el-nav-link--active" : ""}`}
              onClick={() => setOpen(false)}
            >
              <span className="ev-el-nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ev-el-spacer" />

        <div className="ev-el-user-card" style={{ margin: "0 var(--sp-md) var(--sp-md)" }}>
          <div className="ev-el-user-avatar">
            {(user.name || user.phone || "E")[0].toUpperCase()}
          </div>
          <div className="ev-el-user-info">
            <div className="ev-el-user-name">{user.name || "Employee"}</div>
            <div className="ev-el-user-role">Employee</div>
          </div>
          <button className="ev-el-logout-btn" onClick={handleLogout} title="Logout">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ══════════ MAIN CONTENT ══════════ */}
      <main className="ev-el-main">
        <Outlet />
      </main>

    </div>
  );
};

export default EmployeeLayout;