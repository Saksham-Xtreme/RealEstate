import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "../styles/navbar.css";

const Navbar = ({ role = "user", onNav }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="ev-nav">

      {/* ── LOGO ── */}
      <div className="ev-nav-logo" onClick={() => navigate("/")}>
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
              onNav?.("ev-hero");
              navigate("/");
            }}
          >
            Home
          </a>
        </li>

        <li>
          <a
            href="#"
            className={isActive("/listings") ? "ev-nav-active" : ""}
            onClick={(e) => {
              e.preventDefault();
              navigate("/listings");
            }}
          >
            Listings
          </a>
        </li>

        <li>
              <Link
                to="/my-interests"
                className={isActive("/my-interests") ? "ev-nav-active" : ""}
              >
                My Interests
              </Link>
        </li>

        {role === "owner" && (
          <>
            <li>
              <a
                href="#"
                className={isActive("/admin") ? "ev-nav-active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/admin");
                }}
              >
                Admin
              </a>
            </li>
            
          </>
        )}
      </ul>

      {/* ── ACTION ── */}
      <button className="ev-nav-btn" onClick={() => navigate("/auth")}>
        Login
      </button>
    </nav>
  );
};

export default Navbar;