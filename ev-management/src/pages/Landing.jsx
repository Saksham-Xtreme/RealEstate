import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/reset.css";
import "../styles/landing.css";


import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
// ─── CONFIG ──────────────────────────────────────────────────────────────────

const API = import.meta.env.VITE_SERVER_URL || "http://localhost:8080";

// ─── STATIC STEPS ────────────────────────────────────────────────────────────

const STEPS = [
  {
    num: "01",
    title: "Browse Listings",
    desc: "Explore properties across all verified societies. Filter by location, type, and budget — no friction, no signup needed.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#378ADD" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Unlock Details",
    desc: "Login to access exact location, amenities, floor plans, and direct resident contact. Everything gated for quality.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#378ADD" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Connect Instantly",
    desc: "Our team personally connects you with the best-fit options. We handle coordination so you can focus on choosing.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#378ADD" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.14a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 15.18v1.74z" />
      </svg>
    ),
  },
];

// ─── HOOKS ───────────────────────────────────────────────────────────────────

function useListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(`${API}/api/listings?limit=3`, { signal: ctrl.signal })
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((data) => {
        const arr = Array.isArray(data) ? data : (data.listings ?? []);
        setListings(arr.slice(0, 3));
      })
      .catch((err) => { if (err.name !== "AbortError") setError(err.message); })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, []);

  return { listings, loading, error };
}

function useStats() {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(`${API}/api/stats`, { signal: ctrl.signal })
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(setStats)
      .catch((err) => { if (err.name !== "AbortError") console.warn("Stats:", err.message); })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, []);

  return { stats, loading };
}

function useSocieties() {
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading]     = useState(true);

  const iconFor = (tag = "") => {
    const t = tag.toLowerCase();
    if (t.includes("premium") || t.includes("gated")) return "🌿";
    if (t.includes("township"))   return "☀️";
    if (t.includes("high"))       return "🏙";
    if (t.includes("luxury"))     return "💎";
    if (t.includes("integrated")) return "🏡";
    return "🌴";
  };

  useEffect(() => {
    const ctrl = new AbortController();

    fetch(`${API}/api/listings/societies`, { signal: ctrl.signal })
      .then((r) => { if (!r.ok) throw new Error("no endpoint"); return r.json(); })
      .then((data) => {
        const arr = Array.isArray(data) ? data : (data.societies ?? []);
        setSocieties(arr);
      })
      .catch(() => {
        // fallback: derive from listings
        fetch(`${API}/api/listings?limit=50`, { signal: ctrl.signal })
          .then((r) => r.json())
          .then((data) => {
            const arr = Array.isArray(data) ? data : (data.listings ?? []);
            const seen = new Set();
            const derived = [];
            arr.forEach((l) => {
              const name = l.society || l.societyName || l.location?.society || l.title;
              const city = l.location?.city || l.city || "";
              const tag  = l.propertyType || l.type || "Gated Society";
              if (name && !seen.has(name)) {
                seen.add(name);
                derived.push({ name, city, tag, icon: iconFor(tag) });
              }
            });
            setSocieties(derived.slice(0, 6));
          })
          .catch(() => {});
      })
      .finally(() => setLoading(false));

    return () => ctrl.abort();
  }, []);

  return { societies, loading };
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function formatPrice(price) {
  if (!price && price !== 0) return "—";
  const n = Number(price);
  if (isNaN(n)) return price;
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(0)}L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

// ─── SKELETON ────────────────────────────────────────────────────────────────

function Skeleton({ style }) {
  return (
    <div style={{
      background: "linear-gradient(90deg,var(--b50) 25%,var(--b100) 50%,var(--b50) 75%)",
      backgroundSize: "200% 100%",
      animation: "ev-skeleton 1.4s infinite",
      borderRadius: 6,
      ...style,
    }} />
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────



// ─── HERO ────────────────────────────────────────────────────────────────────



// ─── SOCIETIES ───────────────────────────────────────────────────────────────

const FALLBACK_SOCIETIES = [
  { name: "Green Valley",       city: "Noida",   tag: "Premium Gated", icon: "🌿" },
  { name: "Sunshine Residency", city: "Delhi",   tag: "Township",      icon: "☀️" },
  { name: "Skyline Towers",     city: "Gurgaon", tag: "High-Rise",     icon: "🏙" },
  { name: "Palm Heights",       city: "Noida",   tag: "Gated Society", icon: "🌴" },
  { name: "Urban Nest",         city: "Delhi",   tag: "Integrated",    icon: "🏡" },
  { name: "Elite Homes",        city: "Gurgaon", tag: "Luxury Gated",  icon: "💎" },
];

function Societies({ societies, loading }) {
  const items = societies.length > 0 ? societies : (!loading ? FALLBACK_SOCIETIES : []);

  return (
    <section className="ev-section ev-soc-bg" id="ev-societies">
      <div className="ev-inner">
        <div className="ev-soc-head">
          <div>
            <div className="ev-sec-label">Our Network</div>
            <h2 className="ev-sec-title">Societies We Cover</h2>
            <p className="ev-sec-desc">
              Hand-picked, verified communities across Delhi NCR's most sought-after locations.
            </p>
          </div>
        </div>

        <div className="ev-soc-grid">
          {loading
            ? [1, 2, 3, 4, 5, 6].map((i) => (
                <div className="ev-soc-card" key={i} style={{ pointerEvents: "none" }}>
                  {/* mobile: horizontal skeleton */}
                  <Skeleton style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0 }} />
                  <div className="ev-soc-info">
                    <Skeleton style={{ width: "70%", height: 15, marginBottom: 6 }} />
                    <Skeleton style={{ width: "40%", height: 12, marginBottom: 8 }} />
                    <Skeleton style={{ width: 80, height: 20, borderRadius: 100 }} />
                  </div>
                </div>
              ))
            : items.map((s) => (
                <div className="ev-soc-card" key={s.name}>
                  <div className="ev-soc-ico">{s.icon || "🏢"}</div>
                  {/* ev-soc-info wraps text for both mobile (flex row) and desktop (vertical) */}
                  <div className="ev-soc-info">
                    <div className="ev-soc-name">{s.name}</div>
                    <div className="ev-soc-city">
                      <span className="ev-city-dot" />
                      {s.city}
                    </div>
                    <span className="ev-soc-tag">{s.tag || s.type || "Gated Society"}</span>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}

// ─── HOW IT WORKS ────────────────────────────────────────────────────────────

function HowItWorks() {
  return (
    <section className="ev-section ev-how-bg" id="ev-how">
      <div className="ev-inner">
        <div className="ev-sec-label">Process</div>
        <h2 className="ev-sec-title">Three steps to your next home</h2>

        {/* ev-how-grid handles: 1-col mobile, 3-col+dividers desktop */}
        <div className="ev-how-grid">
          {STEPS.map((step, i) => (
            <>
              {/* ev-step: flex row on mobile, flex column on desktop */}
              <div className="ev-step" key={step.num}>
                <div className="ev-step-left">
                  <div className="ev-step-num">{step.num}</div>
                  <div className="ev-step-ico">{step.icon}</div>
                </div>
                <div className="ev-step-body">
                  <div className="ev-step-title">{step.title}</div>
                  <p className="ev-step-desc">{step.desc}</p>
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div className="ev-how-div" key={`div-${i}`} />
              )}
            </>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── STATS ───────────────────────────────────────────────────────────────────

function Stats({ navigate, stats, statsLoading }) {
  const societyCount  = stats?.totalSocieties  ?? stats?.societies  ?? "6";
  const propertyCount = stats?.totalListings   ?? stats?.listings   ?? stats?.properties ?? "100";
  const verifiedPct   = stats?.verifiedPercent ?? 100;

  return (
    <section className="ev-stats-bg" id="ev-stats">
      <div className="ev-inner">
        <div className="ev-stats-grid">
          <div className="ev-stat-block">
            <div className="ev-stat-num">{statsLoading ? "—" : societyCount}<sup>+</sup></div>
            <div className="ev-stat-label">Partner Societies</div>
          </div>
          <div className="ev-stat-block">
            <div className="ev-stat-num">{statsLoading ? "—" : propertyCount}<sup>+</sup></div>
            <div className="ev-stat-label">Active Properties</div>
          </div>
          <div className="ev-stat-block">
            <div className="ev-stat-num">{statsLoading ? "—" : verifiedPct}<sup>%</sup></div>
            <div className="ev-stat-label">Verified Listings</div>
          </div>
        </div>

        <div className="ev-stats-bottom">
          <div className="ev-stats-claim">
            Every listing is sourced directly from{" "}
            <span>verified residents</span> — not third-party brokers.
          </div>
          <button className="ev-btn ev-btn-light" onClick={() => navigate("/listings")}
            style={{ width: "auto" }}>
            View All Listings
            <span className="ev-btn-arr" style={{ background: "var(--b50)", color: "var(--b800)" }}>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── CTA ─────────────────────────────────────────────────────────────────────

function CTA({ navigate, onScrollTo }) {
  return (
    <section className="ev-section ev-cta-bg" id="ev-cta">
      <div className="ev-cta-inner">
        <div className="ev-cta-tag">
          <span className="ev-label-dot" />
          Ready to find your home?
        </div>
        <h2>Start Exploring Verified Listings</h2>
        <p>
          Join hundreds of home seekers who found their perfect match through
          verified society listings. No middlemen, no hassle.
        </p>
        <div className="ev-cta-actions">
          <button className="ev-btn" onClick={() => navigate("/listings")}>
            Get Started
            <span className="ev-btn-arr">→</span>
          </button>
          <button className="ev-btn-outline" onClick={() => onScrollTo("ev-societies")}>
            Browse Societies
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────



// ─── LANDING PAGE ─────────────────────────────────────────────────────────────

export default function LandingPage() {
  const navigate = useNavigate();

  const { listings, loading: listingsLoading, error: listingsError } = useListings();
  const { stats,    loading: statsLoading }                           = useStats();
  const { societies, loading: societiesLoading }                      = useSocieties();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ background: "#ffffff", color: "#0A1628" }}>
      <Navbar onNav={scrollTo} />
      <Hero
        listings={listings}
        listingsLoading={listingsLoading}
        listingsError={listingsError}
      />
      <Societies societies={societies} loading={societiesLoading} />
      <HowItWorks />
      <Stats navigate={navigate} stats={stats} statsLoading={statsLoading} />
      <CTA navigate={navigate} onScrollTo={scrollTo} />
      <Footer />
    </div>
  );
}