import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/interests.css";

const formatPrice = (price, type) => {
  if (!price) return "—";
  const formatted = `₹${Number(price).toLocaleString("en-IN")}`;
  return type === "rent" ? `${formatted}/mo` : formatted;
};

const SkeletonCard = () => (
  <div className="ev-int-card ev-int-skeleton">
    <div className="ev-int-skeleton-img" />
    <div className="ev-int-skeleton-body">
      {[70, 45, 30].map((w, i) => (
        <div key={i} className="ev-int-skeleton-line" style={{ width: `${w}%` }} />
      ))}
    </div>
  </div>
);

const MyInterests = () => {
  const navigate  = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(false);

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const token = localStorage.getItem("token");
        const res   = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/interests`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setListings(data.listings || []);
      } catch (err) {
        console.error("Failed to load interests");
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchInterests();
  }, []);

  return (
    <div className="ev-int-page">
      <Navbar />

      <div className="ev-int-wrap ev-section ev-inner">

        {/* ── HEADER ── */}
        <div className="ev-int-header">
          <div>
            <p className="ev-sec-label">Your activity</p>
            <h1 className="ev-sec-title">My Interests</h1>
            <p className="ev-sec-desc">
              Properties you've marked interest in — owners will reach out directly.
            </p>
          </div>
          {!loading && listings.length > 0 && (
            <div className="ev-int-count-pill">
              {listings.length} {listings.length === 1 ? "property" : "properties"}
            </div>
          )}
        </div>

        {/* ── LOADING ── */}
        {loading && (
          <div className="ev-int-grid">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* ── ERROR ── */}
        {error && (
          <div className="ev-int-error">
            <span className="ev-int-error-ico">⚠</span>
            <p className="ev-int-error-text">Failed to load your interests. Please try again.</p>
          </div>
        )}

        {/* ── EMPTY ── */}
        {!loading && !error && listings.length === 0 && (
          <div className="ev-int-empty">
            <div className="ev-int-empty-ico">🏠</div>
            <p className="ev-int-empty-title">No interests yet</p>
            <p className="ev-int-empty-sub">
              Browse listings and tap "I'm Interested" to save them here.
            </p>
            <button className="ev-btn" style={{ width: "auto", marginTop: "var(--sp-lg)" }} onClick={() => navigate("/listings")}>
              Browse Listings →
            </button>
          </div>
        )}

        {/* ── LIST ── */}
        {!loading && !error && listings.length > 0 && (
          <div className="ev-int-grid">
            {listings.map((l) => {
              const imgSrc = l.images?.[0]?.url || l.images?.[0] || l.image || null;
              const cfg    = l.configuration || {};
              const d      = l.details      || {};
              const loc    = l.location     || {};

              return (
                <div
                  key={l._id}
                  className="ev-int-card"
                  onClick={() => navigate(`/listing/${l._id}`)}
                >
                  {/* IMAGE */}
                  <div className="ev-int-card-img-wrap">
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={l.title}
                        className="ev-int-card-img"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className="ev-int-card-img-fallback"
                      style={{ display: imgSrc ? "none" : "flex" }}
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                    </div>

                    {/* type badge */}
                    {l.type && (
                      <span className={`ev-int-type-badge ${l.type === "rent" ? "ev-int-type-rent" : "ev-int-type-buy"}`}>
                        {l.type === "rent" ? "Rent" : "Sale"}
                      </span>
                    )}
                  </div>

                  {/* BODY */}
                  <div className="ev-int-card-body">

                    {/* title + location */}
                    <div className="ev-int-card-main">
                      <div className="ev-int-card-title">
                        {l.title || "Untitled Property"}
                      </div>
                      <div className="ev-soc-city ev-int-card-loc">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {[loc.address, loc.city].filter(Boolean).join(", ") || "Location unavailable"}
                      </div>
                    </div>

                    {/* chips */}
                    <div className="ev-int-chips">
                      {cfg.bedrooms && (
                        <span className="ev-soc-tag">{cfg.bedrooms} BHK</span>
                      )}
                      {d.furnishing && (
                        <span className="ev-soc-tag">{d.furnishing}</span>
                      )}
                      {d.floor && d.totalFloors && (
                        <span className="ev-soc-tag">Floor {d.floor}/{d.totalFloors}</span>
                      )}
                    </div>

                    {/* price + cta */}
                    <div className="ev-int-card-footer">
                      <span className="ev-int-price">
                        {formatPrice(l.price, l.type)}
                      </span>
                      <span className="ev-int-arrow">View →</span>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      <Footer />
    </div>
  );
};

export default MyInterests;