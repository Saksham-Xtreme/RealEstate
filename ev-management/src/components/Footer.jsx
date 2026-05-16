import React from "react";
import { Link } from "react-router-dom";
import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="ev-footer">
      <div className="ev-footer-inner">

        {/* ── TOP ── */}
        <div className="ev-footer-top">

          {/* BRAND */}
          <div className="ev-footer-brand">
            <Link to="/" className="ev-footer-logo">
              <div className="ev-footer-mark">
                <svg viewBox="0 0 24 24" fill="white" width="13" height="13">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
              </div>
              EV CRM
            </Link>
            <p className="ev-footer-tagline">
              Verified real estate platform with analytics-driven insights.
              Designed,Developed and maintained by Saksham Tripathi 
            </p>
          </div>

          {/* LINK COLUMNS */}
          <div className="ev-footer-cols">

            <div>
              <p className="ev-footer-col-title">Platform</p>
              <ul className="ev-footer-col-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/listings">Listings</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <p className="ev-footer-col-title">Company</p>
              <ul className="ev-footer-col-links">
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>

            <div>
              <p className="ev-footer-col-title">Legal</p>
              <ul className="ev-footer-col-links">
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms of Service</Link></li>
              </ul>
            </div>

          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="ev-footer-bottom">
          <span className="ev-footer-copy">
            © {new Date().getFullYear()} EV CRM. All rights reserved.
          </span>
          <ul className="ev-footer-bottom-links">
            <li><Link to="/privacy">Privacy</Link></li>
            <li><Link to="/terms">Terms</Link></li>
          </ul>
        </div>

      </div>
    </footer>
  );
};

export default Footer;