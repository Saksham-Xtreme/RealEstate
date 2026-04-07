import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useListings from "../hooks/useListings";
import "../styles/listing.css";

const formatPrice = (price) => {
  if (!price) return "—";
  return `₹${Number(price).toLocaleString("en-IN")}`;
};

/* ── Skeleton ── */
const SkeletonCard = () => (
  <div className="ev-skeleton-card">
    <div className="ev-skeleton-img" />
    <div className="ev-skeleton-body">
      {[80, 55, 40].map((w, i) => (
        <div key={i} className="ev-skeleton-line" style={{ width: `${w}%` }} />
      ))}
    </div>
  </div>
);

/* ── Tracking (important for your CRM) ── */
const trackListingView = async (id) => {
  try {
    await fetch(`${import.meta.env.VITE_SERVER_URL}/api/track/view`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ listingId: id }),
    });
  } catch (err) {
    console.error("Tracking failed:", err);
  }
};

const Listings = () => {
  const navigate = useNavigate();
  const { listings, loading, error } = useListings();

  /* ✅ Normalize once (clean & performant approach) */
  const safeListings = useMemo(() => {
    const rawData = listings?.data || listings?.listings || listings;
    return Array.isArray(rawData) ? rawData : [];
  }, [listings]);

  return (
    <div className="ev-listings-page">
      <Navbar />

      <div className="ev-listings-wrap ev-section ev-inner">

        {/* ── HEADER ── */}
        <div className="ev-listings-header">
          <p className="ev-sec-label">Marketplace</p>
          <h1 className="ev-sec-title">Property Listings</h1>
          <p className="ev-sec-desc" style={{ maxWidth: 480 }}>
            Browse verified properties across societies — directly from verified residents.
          </p>
        </div>

        {/* ── LOADING ── */}
        {loading && (
          <div className="ev-skeleton-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* ── ERROR ── */}
        {error && (
          <div className="ev-listings-error">
            <p className="ev-listings-error-title">Failed to load listings</p>
            <p className="ev-listings-error-msg">
              {error?.message || error || "Something went wrong"}
            </p>
          </div>
        )}

        {/* ── EMPTY ── */}
        {!loading && !error && safeListings.length === 0 && (
          <div className="ev-listings-empty">
            <div className="ev-listings-empty-ico">🏠</div>
            <p className="ev-listings-empty-title">No listings yet</p>
            <p className="ev-listings-empty-sub">
              Check back soon — new properties are added regularly.
            </p>
          </div>
        )}

        {/* ── GRID ── */}
        {!loading && !error && safeListings.length > 0 && (
          <div className="ev-listings-grid">
            {safeListings.map((l, idx) => {
              const id = l._id || l.id;
              if (!id) return null;

              const imgSrc = l.images?.[0]?.url || l.images?.[0] || l.image || null;

              return (
                <div
                  key={id}
                  className={`ev-listing-card ev-anim-${Math.min(idx + 1, 5)}`}
                  onClick={() => {
                    trackListingView(id); // 🔥 CRM Tracking triggered
                    navigate(`/listing/${id}`);
                  }}
                >
                  {/* IMAGE with advanced error handling */}
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={l.title || "property"}
                      className="ev-listing-card-img"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}

                  {/* FALLBACK IMAGE (Shows if no image provided OR if img fails to load) */}
                  <div
                    className="ev-listing-img-fallback"
                    style={{ display: imgSrc ? "none" : "flex" }}
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    <span>No image</span>
                  </div>

                  {/* VERIFIED PILL */}
                  {l.verified && (
                    <span className="ev-verified-pill ev-listing-verified">
                      ✓ Verified
                    </span>
                  )}

                  {/* CARD BODY */}
                  <div className="ev-listing-card-body">
                    <div className="ev-listing-card-title">
                      {l.title || l.name || "Untitled Property"}
                    </div>

                    <div className="ev-soc-city ev-listing-card-loc">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {l.location?.city || l.city || "Location unavailable"}
                    </div>

                    <div className="ev-listing-card-tags">
                      {l.configuration?.bedrooms && (
                        <span className="ev-soc-tag">
                          {l.configuration.bedrooms} BHK
                        </span>
                      )}
                      {l.floor && (
                        <span className="ev-soc-tag">
                          Floor {l.floor}
                        </span>
                      )}
                      {l.type && (
                        <span className="ev-soc-tag">{l.type}</span>
                      )}
                    </div>

                    <div className="ev-listing-card-divider" />

                    <div className="ev-listing-card-footer">
                      <span className="ev-listing-card-price">
                        {formatPrice(l.price)}
                      </span>
                      <span className="ev-listing-card-arrow">→</span>
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

export default Listings;