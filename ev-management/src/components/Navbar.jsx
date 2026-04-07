import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "../styles/navbar.css";

const Navbar = ({ role = "user", onNav }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const isActive = (path) => location.pathname === path;

  // Helper to handle navigation and close the mobile menu
  const handleNav = (path, hash = null) => {
    if (hash) onNav?.(hash);
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
    window.location.reload(); // ensures clean state
  };

  return (
    <nav className="ev-nav">

      {/* ── LOGO ── */}
      <div className="ev-nav-logo" onClick={() => handleNav("/", "ev-hero")}>
        <div className="ev-nav-mark">
          <svg viewBox="0 0 24 24" fill="white">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
        </div>
        EV CRM
      </div>

      {/* ── DESKTOP LINKS ── */}
      <ul className="ev-nav-links">
        <li>
          <a
            href="#"
            className={isActive("/") ? "ev-nav-active" : ""}
            onClick={(e) => {
              e.preventDefault();
              handleNav("/", "ev-hero");
            }}
          >
            Home
          </a>
        </li>
        <li>
          <Link to="/listings" className={isActive("/listings") ? "ev-nav-active" : ""}>
            Listings
          </Link>
        </li>
        <li>
          <Link to="/my-interests" className={isActive("/my-interests") ? "ev-nav-active" : ""}>
            My Interests
          </Link>
        </li>
        {role === "owner" && (
          <li>
            <Link to="/admin" className={isActive("/admin") ? "ev-nav-active" : ""}>
              Admin
            </Link>
          </li>
        )}
      </ul>

      {/* ── ACTIONS & MOBILE TOGGLE ── */}
      <div className="ev-nav-actions">
      {isLoggedIn ? (
            <button className="ev-nav-btn" onClick={handleLogout}>
                Logout
            </button>
            ) : (
            <button className="ev-nav-btn" onClick={() => handleNav("/auth")}>
                Login
            </button>
        )}

        {/* ── MOBILE HAMBURGER ── */}
        <div 
          className={`ev-nav-hamburger ${isMobileMenuOpen ? "ev-open" : ""}`} 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      {/* ── MOBILE DROPDOWN MENU ── */}
      <div className={`ev-nav-mobile-menu ${isMobileMenuOpen ? "ev-open" : ""}`}>
        <a
          href="#"
          className={isActive("/") ? "ev-nav-active" : ""}
          onClick={(e) => {
            e.preventDefault();
            handleNav("/", "ev-hero");
          }}
        >
          Home
        </a>
        <Link to="/listings" className={isActive("/listings") ? "ev-nav-active" : ""} onClick={() => setIsMobileMenuOpen(false)}>
          Listings
        </Link>
        <Link to="/my-interests" className={isActive("/my-interests") ? "ev-nav-active" : ""} onClick={() => setIsMobileMenuOpen(false)}>
          My Interests
        </Link>
        {role === "owner" && (
          <Link to="/admin" className={isActive("/admin") ? "ev-nav-active" : ""} onClick={() => setIsMobileMenuOpen(false)}>
            Admin
          </Link>
        )}
      </div>

    </nav>
  );
};

export default Navbar;