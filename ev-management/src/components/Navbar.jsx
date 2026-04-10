import React, { useState, useMemo } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "../styles/navbar.css";

const Navbar = ({ onNav }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const isLoggedIn = !!token;
  const role = user?.role || "guest";

  const isActive = (path) => location.pathname === path;

  const handleNav = (path, hash = null) => {
    if (hash) onNav?.(hash);
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // 🔥 ROLE-BASED LINKS
  const navLinks = useMemo(() => {
    if (!isLoggedIn) {
      return [
        { label: "Home", path: "/" },
      ];
    }

    if (role === "owner") {
      return [
        { label: "Dashboard", path: "/owner/dashboard" },
        { label: "Add Employee", path: "/owner/add-employee" },
      ];
    }

    if (role === "employee") {
      return [
        { label: "Dashboard", path: "/employee/home" },
        { label: "Create Listing", path: "/employee/createListing" },
      ];
    }

    // default user
    return [
      { label: "Home", path: "/" },
      { label: "Listings", path: "/listings" },
      { label: "My Interests", path: "/my-interests" },
    ];
  }, [role, isLoggedIn]);

  return (
    <nav className="ev-nav">

      {/* LOGO */}
      <div className="ev-nav-logo" onClick={() => handleNav("/")}>
        <div className="ev-nav-mark">
          <svg viewBox="0 0 24 24" fill="white">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
        </div>
        EV CRM
      </div>

      {/* DESKTOP LINKS */}
      <ul className="ev-nav-links">
        {navLinks.map((link, i) => (
          <li key={i}>
            <Link
              to={link.path}
              className={isActive(link.path) ? "ev-nav-active" : ""}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* ACTIONS */}
      <div className="ev-nav-actions">
        {isLoggedIn ? (
          <button className="ev-nav-btn" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <button className="ev-nav-btn" onClick={() => handleNav("/login")}>
            Login
          </button>
        )}

        {/* MOBILE */}
        <div
          className={`ev-nav-hamburger ${isMobileMenuOpen ? "ev-open" : ""}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div className={`ev-nav-mobile-menu ${isMobileMenuOpen ? "ev-open" : ""}`}>
        {navLinks.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            className={isActive(link.path) ? "ev-nav-active" : ""}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </div>

    </nav>
  );
};

export default Navbar;