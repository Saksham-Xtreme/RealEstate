// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/auth.css";

// const SERVER = import.meta.env.VITE_SERVER_URL;

// /* ── tiny helpers ── */
// const Field = ({ label, type = "text", value, onChange, placeholder, maxLength }) => (
//   <div className="ev-auth-field">
//     <label className="ev-auth-label">{label}</label>
//     <input
//       className="ev-auth-input"
//       type={type}
//       value={value}
//       onChange={onChange}
//       placeholder={placeholder}
//       maxLength={maxLength}
//       autoComplete="off"
//     />
//   </div>
// );

// const Err = ({ msg }) =>
//   msg ? <p className="ev-auth-err">{msg}</p> : null;

// /* ═══════════════════════════════════════════════
//    FLOWS:
//    "login"    → phone → OTP  (default)
//    "register" → phone → OTP → name/email/city
//    "password" → phone + password (employees / owner)
//    ═══════════════════════════════════════════════ */

// const Authentication = () => {
//   const navigate = useNavigate();

//   const [mode, setMode]       = useState("login");    // "login" | "register" | "password"
//   const [step, setStep]       = useState("phone");    // "phone" | "otp" | "profile"
//   const [loading, setLoading] = useState(false);
//   const [error, setError]     = useState("");

//   /* fields */
//   const [phone,    setPhone]    = useState("");
//   const [otp,      setOtp]      = useState("");
//   const [password, setPassword] = useState("");
//   const [name,     setName]     = useState("");
//   const [email,    setEmail]    = useState("");
//   const [city,     setCity]     = useState("");

//   const reset = () => {
//     setStep("phone"); setError("");
//     setPhone(""); setOtp(""); setPassword("");
//     setName(""); setEmail(""); setCity("");
//   };

//   const switchMode = (m) => { setMode(m); reset(); };

//   /* ── SEND OTP ── */
//   const sendOtp = async () => {
//     if (phone.length !== 10) return setError("Enter a valid 10-digit phone number.");
//     setError(""); setLoading(true);
//     try {
//       const res  = await fetch(`${SERVER}/api/auth/send-otp`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ phone }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to send OTP");
//       setStep("otp");
//     } catch (e) {
//       setError(e.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ── VERIFY OTP ── */
//   const verifyOtp = async () => {
//     if (otp.length !== 6) return setError("Enter the 6-digit OTP.");
//     setError(""); setLoading(true);
//     try {
//       const endpoint = mode === "register"
//         ? `${SERVER}/api/auth/register-otp`
//         : `${SERVER}/api/auth/verify-otp`;

//       const res  = await fetch(endpoint, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ phone, otp }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Invalid OTP");

//       if (mode === "register") {
//         setStep("profile");
//       } else {
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("user",  JSON.stringify(data.user));
//         navigate("/dashboard");
//       }
//     } catch (e) {
//       setError(e.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ── COMPLETE REGISTRATION ── */
//   const completeRegister = async () => {
//     if (!name.trim()) return setError("Name is required.");
//     setError(""); setLoading(true);
//     try {
//       const res  = await fetch(`${SERVER}/api/auth/register`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ phone, otp, name, email, city }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Registration failed");
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user",  JSON.stringify(data.user));
//       navigate("/dashboard");
//     } catch (e) {
//       setError(e.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ── PASSWORD LOGIN (employees / owner) ── */
//   const passwordLogin = async () => {
//     if (phone.length !== 10) return setError("Enter a valid 10-digit phone number.");
//     if (!password)           return setError("Password is required.");
//     setError(""); setLoading(true);
//     try {
//       const res  = await fetch(`${SERVER}/api/auth/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ phone, password }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Login failed");
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user",  JSON.stringify(data.user));
//       navigate("/dashboard");
//     } catch (e) {
//       setError(e.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ── STEP LABEL ── */
//   const stepLabel = {
//     phone:   mode === "register" ? "Create account" : "Sign in",
//     otp:     "Verify phone",
//     profile: "Complete profile",
//   }[step];

//   const stepDesc = {
//     phone:   mode === "register"
//                ? "Enter your mobile number to get started."
//                : mode === "password"
//                ? "Sign in with your phone and password."
//                : "We'll send a one-time code to verify your number.",
//     otp:     `Code sent to +91 ${phone}. Check your messages.`,
//     profile: "Just a few more details and you're all set.",
//   }[step];

//   return (
//     <div className="ev-auth-page">

//       {/* ── LEFT PANEL (branding) ── */}
//       <div className="ev-auth-panel">
//         <div className="ev-auth-panel-inner">

//           <div
//             className="ev-nav-logo"
//             style={{ marginBottom: "var(--sp-2xl)", cursor: "default" }}
//           >
//             <div className="ev-nav-mark">
//               <svg viewBox="0 0 24 24" fill="white" width="14" height="14">
//                 <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
//               </svg>
//             </div>
//             EV CRM
//           </div>

//           <h2 className="ev-auth-panel-title">
//             Real estate, <br />
//             <span>simplified.</span>
//           </h2>
//           <p className="ev-auth-panel-sub">
//             Verified properties. Direct owner contact.
//             No brokers. No fake listings.
//           </p>

//           <div className="ev-auth-panel-badges">
//             {["Verified listings", "No broker fees", "OTP login"].map((b) => (
//               <div key={b} className="ev-badge">
//                 <div className="ev-badge-chk" />
//                 {b}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ── RIGHT PANEL (form) ── */}
//       <div className="ev-auth-form-side">
//         <div className="ev-auth-box">

//           {/* STEP INDICATOR */}
//           {(mode === "login" || mode === "register") && (
//             <div className="ev-auth-steps">
//               {["phone", "otp", ...(mode === "register" ? ["profile"] : [])].map((s, i, arr) => (
//                 <React.Fragment key={s}>
//                   <div className={`ev-auth-step-dot ${step === s ? "ev-auth-step-active" : arr.indexOf(s) < arr.indexOf(step) ? "ev-auth-step-done" : ""}`}>
//                     {arr.indexOf(s) < arr.indexOf(step) ? "✓" : i + 1}
//                   </div>
//                   {i < arr.length - 1 && (
//                     <div className={`ev-auth-step-line ${arr.indexOf(s) < arr.indexOf(step) ? "ev-auth-step-line-done" : ""}`} />
//                   )}
//                 </React.Fragment>
//               ))}
//             </div>
//           )}

//           {/* HEADING */}
//           <h1 className="ev-auth-title">{stepLabel}</h1>
//           <p  className="ev-auth-sub">{stepDesc}</p>

//           {/* ── FORM BODY ── */}

//           {/* PHONE STEP */}
//           {step === "phone" && (
//             <>
//               <div className="ev-auth-phone-wrap">
//                 <span className="ev-auth-dial">+91</span>
//                 <input
//                   className="ev-auth-input ev-auth-phone-input"
//                   type="tel"
//                   placeholder="10-digit mobile number"
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
//                   maxLength={10}
//                 />
//               </div>

//               {mode === "password" && (
//                 <Field
//                   label="Password"
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="Enter your password"
//                 />
//               )}

//               <Err msg={error} />

//               <button
//                 className="ev-btn ev-auth-submit"
//                 onClick={mode === "password" ? passwordLogin : sendOtp}
//                 disabled={loading}
//               >
//                 {loading
//                   ? "Please wait…"
//                   : mode === "password"
//                   ? "Sign In"
//                   : "Send OTP →"}
//               </button>
//             </>
//           )}

//           {/* OTP STEP */}
//           {step === "otp" && (
//             <>
//               <div className="ev-auth-otp-row">
//                 {Array.from({ length: 6 }).map((_, i) => (
//                   <input
//                     key={i}
//                     id={`otp-${i}`}
//                     className="ev-auth-otp-box"
//                     type="tel"
//                     maxLength={1}
//                     value={otp[i] || ""}
//                     onChange={(e) => {
//                       const val = e.target.value.replace(/\D/g, "");
//                       const arr = otp.split("");
//                       arr[i] = val;
//                       setOtp(arr.join("").slice(0, 6));
//                       if (val && i < 5) document.getElementById(`otp-${i + 1}`)?.focus();
//                     }}
//                     onKeyDown={(e) => {
//                       if (e.key === "Backspace" && !otp[i] && i > 0)
//                         document.getElementById(`otp-${i - 1}`)?.focus();
//                     }}
//                   />
//                 ))}
//               </div>

//               <Err msg={error} />

//               <button
//                 className="ev-btn ev-auth-submit"
//                 onClick={verifyOtp}
//                 disabled={loading || otp.length !== 6}
//               >
//                 {loading ? "Verifying…" : "Verify OTP →"}
//               </button>

//               <button className="ev-auth-link" onClick={() => { setStep("phone"); setOtp(""); setError(""); }}>
//                 ← Change number
//               </button>
//             </>
//           )}

//           {/* PROFILE STEP (register only) */}
//           {step === "profile" && (
//             <>
//               <Field
//                 label="Full name *"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 placeholder="Your name"
//               />
//               <Field
//                 label="Email (optional)"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="you@example.com"
//               />
//               <Field
//                 label="City (optional)"
//                 value={city}
//                 onChange={(e) => setCity(e.target.value)}
//                 placeholder="e.g. Noida"
//               />

//               <Err msg={error} />

//               <button
//                 className="ev-btn ev-auth-submit"
//                 onClick={completeRegister}
//                 disabled={loading}
//               >
//                 {loading ? "Creating account…" : "Create Account →"}
//               </button>
//             </>
//           )}

//           {/* ── MODE SWITCHER ── */}
//           <div className="ev-auth-switcher">
//             {mode !== "login" && (
//               <button className="ev-auth-link" onClick={() => switchMode("login")}>
//                 Already have an account? <strong>Sign in</strong>
//               </button>
//             )}
//             {mode !== "register" && (
//               <button className="ev-auth-link" onClick={() => switchMode("register")}>
//                 New here? <strong>Create account</strong>
//               </button>
//             )}
//             {mode !== "password" && (
//               <button className="ev-auth-link ev-auth-link-dim" onClick={() => switchMode("password")}>
//                 Employee / Owner login
//               </button>
//             )}
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Authentication;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

const SERVER = import.meta.env.VITE_SERVER_URL;

const Err = ({ msg }) =>
  msg ? <p className="ev-auth-err">{msg}</p> : null;

/* ── role config ── */
const ROLES = [
  {
    key:      "user",
    label:    "User",
    heading:  "User Login",
    sub:      "Sign in with your registered phone and password.",
    endpoint: `${SERVER}/api/auth/login`,
    redirect: (user) => "/listings",
  },
  {
    key:      "owner",
    label:    "Owner",
    heading:  "Owner Login",
    sub:      "Sign in to manage your properties and leads.",
    endpoint: `${SERVER}/api/auth/login`,
    redirect: (user) => "/owner/dashboard",
  },
  {
    key:      "employee",
    label:    "Employee",
    heading:  "Employee Login",
    sub:      "Sign in with your employee credentials.",
    endpoint: `${SERVER}/api/employee/login`,
    redirect: (user) => "/employee/home",
  },
];

const Authentication = () => {
  const navigate = useNavigate();

  const [role,     setRole]     = useState("user");
  const [mode,     setMode]     = useState("login");   // "login" | "register"
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [showPass, setShowPass] = useState(false);

  const [phone,    setPhone]    = useState("");
  const [password, setPassword] = useState("");
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [city,     setCity]     = useState("");

  const roleCfg = ROLES.find((r) => r.key === role);

  const resetForm = () => {
    setError("");
    setPhone(""); setPassword("");
    setName(""); setEmail(""); setCity("");
    setShowPass(false);
  };

  const switchRole = (r) => { setRole(r); setMode("login"); resetForm(); };
  const switchMode = (m) => { setMode(m); resetForm(); };

  /* ── LOGIN ── */
  const handleLogin = async () => {
    if (phone.length !== 10) return setError("Enter a valid 10-digit phone number.");
    if (!password)           return setError("Password is required.");
    setError(""); setLoading(true);

    try {
      const body = role === "owner"
        ? { phone, password, role: "owner" }
        : { phone, password };

      const res  = await fetch(roleCfg.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      /* role guard — make sure the returned role matches what was selected */
      const returnedRole = data.user?.role || data.employee?.role;
      if (role === "owner"    && returnedRole !== "owner")    throw new Error("Owner account not found.");
      if (role === "employee" && returnedRole !== "employee") throw new Error("Invalid employee credentials.");
      if (role === "user"     && returnedRole === "owner")    throw new Error("Please use Owner Login.");
      if (role === "user"     && returnedRole === "employee") throw new Error("Please use Employee Login.");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user",  JSON.stringify(data.user || data.employee));
      navigate(roleCfg.redirect(data.user || data.employee));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  /* ── REGISTER (users only) ── */
  const handleRegister = async () => {
    if (phone.length !== 10) return setError("Enter a valid 10-digit phone number.");
    if (!password)           return setError("Password is required.");
    if (!name.trim())        return setError("Name is required.");
    setError(""); setLoading(true);

    try {
      const res  = await fetch(`${SERVER}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password, name, email, city }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user",  JSON.stringify(data.user));
      navigate("/listings");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const isLogin    = mode === "login";
  const canRegister = role === "user"; // only users self-register

  return (
    <div className="ev-auth-page">

      {/* ── LEFT PANEL ── */}
      <div className="ev-auth-panel">
        <div className="ev-auth-panel-inner">

          <div className="ev-nav-logo" style={{ marginBottom: "var(--sp-2xl)", cursor: "default" }}>
            <div className="ev-nav-mark">
              <svg viewBox="0 0 24 24" fill="white" width="14" height="14">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
            </div>
            EV CRM
          </div>

          <h2 className="ev-auth-panel-title">
            Real estate, <br /><span>simplified.</span>
          </h2>
          <p className="ev-auth-panel-sub">
            Verified properties. Direct owner contact.
            No brokers. No fake listings.
          </p>

          {/* ROLE PICKER on panel */}
          <div className="ev-auth-role-list">
            {ROLES.map((r) => (
              <button
                key={r.key}
                className={`ev-auth-role-item ${role === r.key ? "ev-auth-role-item--active" : ""}`}
                onClick={() => switchRole(r.key)}
              >
                <span className="ev-auth-role-dot" />
                {r.label}
              </button>
            ))}
          </div>

          <div className="ev-auth-panel-badges" style={{ marginTop: "var(--sp-xl)" }}>
            {["Verified listings", "No broker fees", "Direct contact"].map((b) => (
              <div key={b} className="ev-badge">
                <div className="ev-badge-chk" />
                {b}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="ev-auth-form-side">
        <div className="ev-auth-box">

          {/* ROLE TABS (mobile — shown only on small screens) */}
          <div className="ev-auth-role-tabs">
            {ROLES.map((r) => (
              <button
                key={r.key}
                className={`ev-auth-role-tab ${role === r.key ? "ev-auth-role-tab--active" : ""}`}
                onClick={() => switchRole(r.key)}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* HEADING */}
          <div className="ev-auth-heading-block">
            <p className="ev-sec-label">
              {isLogin ? (role === "user" ? "Welcome back" : "Team login") : "Get started"}
            </p>
            <h1 className="ev-auth-title">
              {isLogin ? roleCfg.heading : "Create your account"}
            </h1>
            <p className="ev-auth-sub">
              {isLogin ? roleCfg.sub : "Fill in the details below to get started."}
            </p>
          </div>

          {/* NAME (register only) */}
          {!isLogin && (
            <div className="ev-auth-field">
              <label className="ev-auth-label">Full name *</label>
              <input
                className="ev-auth-input"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
              />
            </div>
          )}

          {/* PHONE */}
          <div className="ev-auth-field">
            <label className="ev-auth-label">Phone number</label>
            <div className="ev-auth-phone-wrap">
              <span className="ev-auth-dial">+91</span>
              <input
                className="ev-auth-input ev-auth-phone-input"
                type="tel"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                maxLength={10}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="ev-auth-field">
            <label className="ev-auth-label">Password</label>
            <div className="ev-auth-pass-wrap">
              <input
                className="ev-auth-input ev-auth-pass-input"
                type={showPass ? "text" : "password"}
                placeholder={isLogin ? "Enter your password" : "Create a password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
              <button
                type="button"
                className="ev-auth-pass-toggle"
                onClick={() => setShowPass((p) => !p)}
                tabIndex={-1}
              >
                {showPass ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* OPTIONAL FIELDS (register only) */}
          {!isLogin && (
            <>
              <div className="ev-auth-field">
                <label className="ev-auth-label">Email (optional)</label>
                <input className="ev-auth-input" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="off" />
              </div>
              <div className="ev-auth-field">
                <label className="ev-auth-label">City (optional)</label>
                <input className="ev-auth-input" type="text" placeholder="e.g. Noida" value={city} onChange={(e) => setCity(e.target.value)} autoComplete="off" />
              </div>
            </>
          )}

          <Err msg={error} />

          {/* SUBMIT */}
          <button
            className="ev-btn ev-auth-submit"
            onClick={isLogin ? handleLogin : handleRegister}
            disabled={loading}
          >
            {loading
              ? (isLogin ? "Signing in…" : "Creating account…")
              : (isLogin ? "Sign In →" : "Create Account →")}
          </button>

          {/* SWITCHER */}
          <div className="ev-auth-switcher">
            {canRegister && isLogin && (
              <button className="ev-auth-link" onClick={() => switchMode("register")}>
                New here? <strong>Create an account</strong>
              </button>
            )}
            {canRegister && !isLogin && (
              <button className="ev-auth-link" onClick={() => switchMode("login")}>
                Already have an account? <strong>Sign in</strong>
              </button>
            )}
            {!canRegister && (
              <p className="ev-auth-link" style={{ cursor: "default" }}>
                Contact your administrator to get access.
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Authentication;