import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/listing-detail.css";

const formatPrice = (price, type) => {
  if (!price) return "—";
  const formatted = `₹${Number(price).toLocaleString("en-IN")}`;
  return type === "rent" ? `${formatted}/mo` : formatted;
};

const InfoChip = ({ label }) => (
  <span className="ev-ld-chip">{label}</span>
);

const StatBox = ({ icon, label, value }) => (
  <div className="ev-ld-stat">
    <div className="ev-ld-stat-icon">{icon}</div>
    <div>
      <div className="ev-ld-stat-value">{value}</div>
      <div className="ev-ld-stat-label">{label}</div>
    </div>
  </div>
);

const Section = ({ title, children }) => (
  <div className="ev-ld-section">
    <h3 className="ev-ld-section-title">{title}</h3>
    {children}
  </div>
);

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interested, setInterested] = useState(false);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImg, setActiveImg] = useState(0);

  const startTimeRef = useRef(Date.now());
  const isActiveRef = useRef(true); // ✅ STEP 1 — Track active/inactive state
  const listingRef = useRef(listing); // Used to avoid stale closures in cleanup/event listeners

  // ✅ STEP 3 — Modified Incremental time tracking function (CRITICAL)
  const sendTimeUpdate = async () => {
    try {
      // ❌ skip if tab not active
      if (!isActiveRef.current) return;

      const token = localStorage.getItem("token");

      const timeSpent = Math.floor(
        (Date.now() - startTimeRef.current) / 1000
      );

      // ignore very small values
      if (timeSpent < 2) return;

      await fetch(`${import.meta.env.VITE_SERVER_URL}/api/activity/time`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          listingId: id,
          duration: timeSpent,
        }),
      });

      // reset timer after sending
      startTimeRef.current = Date.now();

    } catch (err) {
      console.error("Time tracking failed");
    }
  };

  // ✅ STEP 2 — Detect tab visibility
  useEffect(() => {
    const handleVisibility = () => {
      isActiveRef.current = !document.hidden;

      // reset timer when user comes back
      if (!document.hidden) {
        startTimeRef.current = Date.now();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // ✅ STEP 4 — OPTIONAL (User activity detection)
  useEffect(() => {
    let timeout;

    const markActive = () => {
      isActiveRef.current = true;

      clearTimeout(timeout);

      timeout = setTimeout(() => {
        isActiveRef.current = false; // user inactive
      }, 15000); // 15 sec idle
    };

    window.addEventListener("mousemove", markActive);
    window.addEventListener("keydown", markActive);
    window.addEventListener("scroll", markActive);

    return () => {
      window.removeEventListener("mousemove", markActive);
      window.removeEventListener("keydown", markActive);
      window.removeEventListener("scroll", markActive);
    };
  }, []);

  // Keep ref synced with latest listing data
  useEffect(() => {
    listingRef.current = listing;
  }, [listing]);

  // 🔥 ADD: Universal interaction tracker
  const trackInteraction = async (type) => {
    try {
      const token = localStorage.getItem("token");
      const currentListing = listingRef.current;

      await fetch(`${import.meta.env.VITE_SERVER_URL}/api/activity/interact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          listingId: id,
          type, // click, image, scroll, interest
          society: currentListing?.location?.sector || "",
        }),
      });
    } catch (err) {
      console.error("Interaction failed");
    }
  };

  const handleInterest = async () => {
    try {
      const token = localStorage.getItem("token");  
  
      await fetch(`${import.meta.env.VITE_SERVER_URL}/api/interests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ listingId: id }),
      });
  
      setInterested(true);
  
    } catch (err) {
      console.error("Interest failed", err);
    }
  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/listings/${id}`);
        const data = await res.json();
        setListing(data.listing || data);
      } catch (err) {
        setError("Failed to load listing");
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  // ✅ FIX: Upgraded view tracking
  useEffect(() => {
    // Only track enriched view once the listing data has loaded
    if (!listing) return; 

    const trackView = async () => {
      try {
        const token = localStorage.getItem("token");

        await fetch(`${import.meta.env.VITE_SERVER_URL}/api/activity/view`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({
            listingId: id,
            society: listing.location?.sector || "",
            city: listing.location?.city || "",
            price: listing.price || 0,
          }),
        });
      } catch (err) {
        console.error("View tracking failed");
      }
    };
    trackView();
  }, [id, listing?._id]); // 👈 ✅ FIXED: Used listing?._id instead of listing?.id

  // Periodic tracking
  useEffect(() => {
    const interval = setInterval(() => {
      sendTimeUpdate();
    }, 10000); // every 10 seconds

    return () => clearInterval(interval);
  }, [id]);

  // Final send on exit (Replaced sendBeacon)
  useEffect(() => {
    return () => {
      sendTimeUpdate(); // final send on exit
    };
  }, [id]);

  // 🎯 CONNECT: Scroll Tracking
  useEffect(() => {
    let scrollTracked = false; // Prevent multiple pings per page visit
    
    const handleScroll = () => {
      // 👈 ✅ FIXED: More accurate scroll calc
      const scrollPercent =
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) * 100;

      if (scrollPercent > 50 && !scrollTracked) {
        trackInteraction("scroll_50");
        scrollTracked = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ── LOADING ── */
  if (loading) return (
    <div className="ev-ld-page">
      <Navbar />
      <div className="ev-ld-state">
        <div className="ev-ld-state-spinner" />
        <p className="ev-ld-state-text">Loading property details...</p>
      </div>
      <Footer />
    </div>
  );

  /* ── ERROR ── */
  if (error || !listing) return (
    <div className="ev-ld-page">
      <Navbar />
      <div className="ev-ld-state">
        <div className="ev-ld-state-ico">⚠</div>
        <p className="ev-ld-state-text">Failed to load listing.</p>
        <button className="ev-btn" style={{ width: "auto", marginTop: 16 }} onClick={() => navigate("/listings")}>
          ← Back to Listings
        </button>
      </div>
      <Footer />
    </div>
  );

  /* ── IMAGE HANDLING ── */
  // supports both { url } objects and raw string URLs
  const images = (listing.images || []).map((img) =>
    typeof img === "string" ? img : img?.url
  ).filter(Boolean);

  const imgSrc = images[activeImg] || null;

  const d  = listing.details        || {};
  const cfg = listing.configuration  || {};
  const area = listing.area          || {};
  const loc  = listing.location      || {};
  const nearby = listing.nearby      || {};

  return (
    <div className="ev-ld-page">
      <Navbar />

      <div className="ev-ld-wrap ev-inner">

        {/* ── BACK LINK ── */}
        <button className="ev-ld-back" onClick={() => navigate("/listings")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          All Listings
        </button>

        {/* ── MAIN GRID ── */}
        <div className="ev-ld-grid">

          {/* ════ LEFT COLUMN ════ */}
          <div className="ev-ld-left">

            {/* IMAGE */}
            <div className="ev-ld-img-wrap">
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt={listing.title}
                  className="ev-ld-img"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div className="ev-ld-img-fallback" style={{ display: imgSrc ? "none" : "flex" }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span>No image available</span>
              </div>

              {/* type badge */}
              <span className={`ev-ld-type-badge ${listing.type === "rent" ? "ev-ld-type-rent" : "ev-ld-type-buy"}`}>
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </span>
            </div>

            {/* THUMBNAIL ROW */}
            {images.length > 1 && (
              <div className="ev-ld-thumbs">
                {images.map((src, i) => (
                  <button
                    key={i}
                    className={`ev-ld-thumb ${i === activeImg ? "ev-ld-thumb-active" : ""}`}
                    onClick={() => {
                      setActiveImg(i);
                      trackInteraction("image_click"); // 🎯 CONNECT: Image click tracking
                    }}
                  >
                    <img src={src} alt={`View ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}

            {/* ── QUICK STATS ── */}
            <div className="ev-ld-stats-row">
              {cfg.bedrooms   && <StatBox icon="🛏" label="Bedrooms"   value={cfg.bedrooms} />}
              {cfg.bathrooms  && <StatBox icon="🚿" label="Bathrooms"  value={cfg.bathrooms} />}
              {cfg.balconies  && <StatBox icon="🌤" label="Balconies"  value={cfg.balconies} />}
              {area.builtUp   && <StatBox icon="📐" label="Built-up"   value={`${area.builtUp} sq.ft`} />}
              {area.carpet    && <StatBox icon="🏠" label="Carpet"     value={`${area.carpet} sq.ft`} />}
              {d.parking !== undefined && <StatBox icon="🚗" label="Parking" value={d.parking || "None"} />}
            </div>

            {/* ── DESCRIPTION ── */}
            <Section title="About this property">
              <p className="ev-ld-desc">
                {listing.description || "No description available for this property."}
              </p>
            </Section>

            {/* ── PROPERTY DETAILS ── */}
            <Section title="Property Details">
              <div className="ev-ld-details-grid">
                {d.furnishing   && <div className="ev-ld-detail-row"><span>Furnishing</span><span>{d.furnishing}</span></div>}
                {d.facing       && <div className="ev-ld-detail-row"><span>Facing</span><span>{d.facing}</span></div>}
                {d.floor        && <div className="ev-ld-detail-row"><span>Floor</span><span>{d.floor}{d.totalFloors ? ` of ${d.totalFloors}` : ""}</span></div>}
                {d.ownership    && <div className="ev-ld-detail-row"><span>Ownership</span><span>{d.ownership}</span></div>}
                {loc.sector     && <div className="ev-ld-detail-row"><span>Sector</span><span>{loc.sector}</span></div>}
                {loc.pincode    && <div className="ev-ld-detail-row"><span>Pincode</span><span>{loc.pincode}</span></div>}
                {loc.state      && <div className="ev-ld-detail-row"><span>State</span><span>{loc.state}</span></div>}
              </div>
            </Section>

            {/* ── AMENITIES ── */}
            {listing.amenities?.length > 0 && (
              <Section title="Amenities">
                <div className="ev-ld-chips">
                  {listing.amenities.map((a, i) => (
                    <InfoChip key={i} label={a} />
                  ))}
                </div>
              </Section>
            )}

            {/* ── NEARBY ── */}
            {Object.keys(nearby).some((k) => nearby[k]?.length > 0) && (
              <Section title="Nearby">
                <div className="ev-ld-nearby-grid">
                  {nearby.metro?.length > 0 && (
                    <div className="ev-ld-nearby-group">
                      <div className="ev-ld-nearby-label">🚇 Metro</div>
                      {nearby.metro.map((m, i) => <div key={i} className="ev-ld-nearby-item">{m}</div>)}
                    </div>
                  )}
                  {nearby.schools?.length > 0 && (
                    <div className="ev-ld-nearby-group">
                      <div className="ev-ld-nearby-label">🏫 Schools</div>
                      {nearby.schools.map((s, i) => <div key={i} className="ev-ld-nearby-item">{s}</div>)}
                    </div>
                  )}
                  {nearby.hospitals?.length > 0 && (
                    <div className="ev-ld-nearby-group">
                      <div className="ev-ld-nearby-label">🏥 Hospitals</div>
                      {nearby.hospitals.map((h, i) => <div key={i} className="ev-ld-nearby-item">{h}</div>)}
                    </div>
                  )}
                  {nearby.malls?.length > 0 && (
                    <div className="ev-ld-nearby-group">
                      <div className="ev-ld-nearby-label">🛍 Malls</div>
                      {nearby.malls.map((m, i) => <div key={i} className="ev-ld-nearby-item">{m}</div>)}
                    </div>
                  )}
                </div>
              </Section>
            )}
          </div>

          {/* ════ RIGHT COLUMN (sticky CTA) ════ */}
          <div className="ev-ld-right">
            <div className="ev-ld-cta-card">

              {/* PRICE */}
              <div className="ev-ld-cta-price">
                {formatPrice(listing.price, listing.type)}
              </div>

              {/* TITLE */}
              <h1 className="ev-ld-cta-title">
                {listing.title || "Untitled Property"}
              </h1>

              {/* LOCATION */}
              <div className="ev-soc-city" style={{ marginBottom: "var(--sp-md)" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {[loc.address, loc.city, loc.state].filter(Boolean).join(", ")}
              </div>

              {/* CHIPS */}
              <div className="ev-ld-chips" style={{ marginBottom: "var(--sp-lg)" }}>
                {cfg.bedrooms && <InfoChip label={`${cfg.bedrooms} BHK`} />}
                {d.furnishing && <InfoChip label={d.furnishing} />}
                {d.floor && d.totalFloors && <InfoChip label={`Floor ${d.floor}/${d.totalFloors}`} />}
                {d.facing && <InfoChip label={`${d.facing} facing`} />}
              </div>

              {/* DIVIDER */}
              <div className="ev-listing-card-divider" />

              {/* BUTTON */}
              <button
                className={`ev-ld-interest-btn ${interested ? "ev-ld-interest-btn--done" : ""}`}
                onClick={() => {
                  trackInteraction("interest_click"); // 🎯 CONNECT: Interest click tracking
                  handleInterest();
                }}
                disabled={interested}
              >
                {interested ? "Interest Registered ✓" : "I'm Interested"}
              </button>

              <p className="ev-ld-cta-note">
                {interested
                  ? "The owner will be notified shortly."
                  : "No broker fees • Direct owner contact"}
              </p>

              {/* MINI STATS */}
              <div className="ev-ld-cta-meta">
                {area.builtUp && (
                  <div className="ev-ld-cta-meta-row">
                    <span>Built-up Area</span>
                    <span>{area.builtUp} sq.ft</span>
                  </div>
                )}
                {area.carpet && (
                  <div className="ev-ld-cta-meta-row">
                    <span>Carpet Area</span>
                    <span>{area.carpet} sq.ft</span>
                  </div>
                )}
                {d.ownership && (
                  <div className="ev-ld-cta-meta-row">
                    <span>Ownership</span>
                    <span style={{ textTransform: "capitalize" }}>{d.ownership}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ListingDetail;