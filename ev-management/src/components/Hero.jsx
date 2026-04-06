import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/reset.css";
import "../styles/landing.css";


// fallback formatter (prevents crash if not passed)
const formatPrice = (price) => {
  if (!price) return "—";
  return `₹${Number(price).toLocaleString("en-IN")}`;
};

const Hero = ({
  listings = [],
  listingsLoading = false,
  listingsError = null,
}) => {
  const navigate = useNavigate();

  return (
    <section className="ev-hero" id="ev-hero">
      <div className="ev-hero-grid">

        {/* LEFT */}
        <div>
          <div className="ev-hero-label ev-anim-1">
            <span className="ev-label-dot" />
            Verified Listings Platform
          </div>

          <h1 className="ev-h1 ev-anim-2">
            Find <span>Verified Homes</span><br />
            in Premium Societies
          </h1>

          <p className="ev-hero-sub ev-anim-3">
            Only genuine listings from verified residents across top societies.
            No brokers. No fake listings. Just homes worth your time.
          </p>

          <div className="ev-badges ev-anim-4">
            {["No Broker Fees", "Verified Residents", "Instant Connect"].map((b) => (
              <div className="ev-badge" key={b}>
                <span className="ev-badge-chk" />
                {b}
              </div>
            ))}
          </div>

          <button
            className="ev-btn ev-anim-5"
            onClick={() => navigate("/listings")}
          >
            Get Started
            <span className="ev-btn-arr">→</span>
          </button>
        </div>

        {/* RIGHT */}
        <div className="ev-hero-vis ev-anim-vis">

          {/* TOP FLOAT */}
          <div className="ev-float ev-float-top">
            <div className="ev-float-ico">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>

            <div>
              <div className="ev-float-stat">
                {listingsLoading ? "—" : listings.length}
                <sup style={{ fontSize: 12 }}>+</sup>
              </div>
              <div className="ev-float-label">Verified Properties</div>
            </div>
          </div>

          {/* MAIN CARD */}
          <div className="ev-card-main">
            <div className="ev-card-hd">
              <div>
                <div className="ev-card-title">Live Listings</div>
                <div className="ev-card-sub">Updated daily</div>
              </div>
              <span className="ev-verified-pill">All Verified</span>
            </div>

            {/* STATES */}
            {listingsLoading ? (
              <p style={{ fontSize: 13, padding: "12px 0" }}>
                Loading listings...
              </p>
            ) : listingsError ? (
              <p style={{ fontSize: 13, padding: "12px 0", color: "red" }}>
                Failed to load listings
              </p>
            ) : listings.length === 0 ? (
              <p style={{ fontSize: 13, padding: "12px 0" }}>
                No listings available
              </p>
            ) : (
              listings.slice(0, 3).map((l) => (
                <div className="ev-listing-row" key={l._id}>
                  <div className="ev-listing-ico">🏢</div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="ev-listing-name">
                      {l.title || l.name}
                    </div>

                    <div className="ev-listing-loc">
                      {l.location?.city || l.city || "Unknown"}
                      {l.configuration?.bedrooms
                        ? ` · ${l.configuration.bedrooms} BHK`
                        : ""}
                      {l.floor ? ` · Floor ${l.floor}` : ""}
                    </div>
                  </div>

                  <div className="ev-listing-price">
                    {formatPrice(l.price)}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* BOTTOM FLOAT */}
          <div className="ev-float ev-float-bot">
            <span className="ev-pulse" />
            {listingsLoading
              ? "Fetching listings..."
              : "Live listings available"}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;