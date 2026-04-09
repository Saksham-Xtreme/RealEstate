import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/listing-form.css";

const SERVER = import.meta.env.VITE_SERVER_URL || "http://localhost:8080";

/* ── helpers ── */
const Field = ({ label, hint, children }) => (
  <div className="ev-lf-field">
    <label className="ev-lf-label">
      {label}
      {hint && <span className="ev-lf-hint">{hint}</span>}
    </label>
    {children}
  </div>
);

const Input = ({ name, value, onChange, placeholder, type = "text", min }) => (
  <input
    className="ev-lf-input"
    name={name} value={value || ""} onChange={onChange}
    placeholder={placeholder} type={type} min={min}
    autoComplete="off"
  />
);

const Select = ({ name, value, onChange, children }) => (
  <select className="ev-lf-input ev-lf-select" name={name} value={value || ""} onChange={onChange}>
    {children}
  </select>
);

const SectionHead = ({ step, title, sub }) => (
  <div className="ev-lf-section-head">
    <span className="ev-lf-step">{step}</span>
    <div>
      <div className="ev-lf-section-title">{title}</div>
      {sub && <div className="ev-lf-section-sub">{sub}</div>}
    </div>
  </div>
);

/* ════════════════════════════════════════════════════════ */

const ListingForm = ({ editData = null, listingId = null }) => {
  const navigate     = useNavigate();
  const fileInputRef = useRef(null);

  const [loading,    setLoading]    = useState(false);
  const [success,    setSuccess]    = useState(false);
  const [error,      setError]      = useState("");

  /* images: array of { file, url, isPrimary } */
  const [images, setImages] = useState([]);

  const [form, setForm] = useState({
    title: "", price: "", type: "",
    bedrooms: 0, bathrooms: 0, balconies: 0,
    builtUp: "", carpet: "",
    address: "", city: "", state: "", pincode: "", sector: "",
    furnishing: "", parking: 0, facing: "", floor: "", totalFloors: "", ownership: "",
    description: "", status: "active",
    amenities: "", schools: "", metro: "", hospitals: "", malls: ""
  });

  /* prefill edit mode */
  useEffect(() => {
    if (!editData) return;
    setForm({
      title:       editData.title                        || "",
      price:       editData.price                        || "",
      type:        editData.type                         || "",
      bedrooms:    editData.configuration?.bedrooms      || 0,
      bathrooms:   editData.configuration?.bathrooms     || 0,
      balconies:   editData.configuration?.balconies     || 0,
      builtUp:     editData.area?.builtUp                || "",
      carpet:      editData.area?.carpet                 || "",
      address:     editData.location?.address            || "",
      city:        editData.location?.city               || "",
      state:       editData.location?.state              || "",
      pincode:     editData.location?.pincode            || "",
      sector:      editData.location?.sector             || "",
      furnishing:  editData.details?.furnishing          || "",
      parking:     editData.details?.parking             || 0,
      facing:      editData.details?.facing              || "",
      floor:       editData.details?.floor               || "",
      totalFloors: editData.details?.totalFloors         || "",
      ownership:   editData.details?.ownership           || "",
      description: editData.description                  || "",
      status:      editData.status                       || "active",
      amenities:   (editData.amenities            || []).join(", "),
      schools:     (editData.nearby?.schools      || []).join(", "),
      metro:       (editData.nearby?.metro        || []).join(", "),
      hospitals:   (editData.nearby?.hospitals    || []).join(", "),
      malls:       (editData.nearby?.malls        || []).join(", "),
    });
    /* prefill existing images */
    if (editData.images?.length) {
      setImages(
        editData.images.map((img) =>
          typeof img === "string"
            ? { file: null, url: img, isPrimary: false }
            : { file: null, ...img }
        )
      );
    }
  }, [editData]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  /* ── IMAGE UPLOAD LOGIC (Optimized for FormData) ── */
  const processFiles = (files) => {
    if (!files.length) return;

    /* max 8 images total */
    const remaining = 8 - images.length;
    if (remaining <= 0) return setError("Maximum 8 images allowed.");
    const toAdd = files.slice(0, remaining);

    setError("");

    // Create local object URLs for instant preview
    const newImageObjects = toAdd.map((file) => ({
      file: file,
      url: URL.createObjectURL(file), 
      isPrimary: false
    }));

    setImages((prev) => {
      const merged = [...prev, ...newImageObjects];
      /* first image is always primary */
      return merged.map((img, i) => ({ ...img, isPrimary: i === 0 }));
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const removeImage = (idx) => {
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      // Ensure local preview URLs are revoked to prevent memory leaks
      if (prev[idx].file) URL.revokeObjectURL(prev[idx].url);
      return next.map((img, i) => ({ ...img, isPrimary: i === 0 }));
    });
  };

  const setPrimary = (idx) => {
    setImages((prev) =>
      prev.map((img, i) => ({ ...img, isPrimary: i === idx }))
    );
  };

  /* drag-to-reorder */
  const dragIdx = useRef(null);
  const onDragStart = (i) => { dragIdx.current = i; };
  const onDropOrder = (i) => {
    if (dragIdx.current === null || dragIdx.current === i) return;
    setImages((prev) => {
      const arr = [...prev];
      const [moved] = arr.splice(dragIdx.current, 1);
      arr.splice(i, 0, moved);
      return arr.map((img, idx) => ({ ...img, isPrimary: idx === 0 }));
    });
    dragIdx.current = null;
  };

  /* ── SUBMIT ── */
  const splitCSV = (str) => {
    if (!str || typeof str !== "string") return [];
    return str.split(",").map((s) => s.trim()).filter(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) return setError("Title is required.");
    if (!form.price)  return setError("Price is required.");
    if (!form.type)   return setError("Listing type is required.");
    if (!form.city)   return setError("City is required.");

    setError(""); setLoading(true);

    const token = localStorage.getItem("token");
    const formData = new FormData();

    // 1. Append base fields
    formData.append("title", form.title);
    formData.append("price", form.price);
    formData.append("type", form.type);
    formData.append("description", form.description);
    formData.append("status", form.status);

    // 2. Append stringified JSON for nested objects 
    // (This guarantees complex data stays intact when transitioning to Multipart)
    formData.append("configuration", JSON.stringify({
      bedrooms:  Number(form.bedrooms) || 0,
      bathrooms: Number(form.bathrooms) || 0,
      balconies: Number(form.balconies) || 0,
    }));
    
    formData.append("area", JSON.stringify({
      builtUp: Number(form.builtUp) || 0, 
      carpet: Number(form.carpet) || 0 
    }));

    formData.append("location", JSON.stringify({
      address: form.address, city: form.city,
      state: form.state, pincode: form.pincode, sector: form.sector,
    }));

    formData.append("details", JSON.stringify({
      furnishing:  form.furnishing  || undefined,
      ownership:   form.ownership   || undefined,
      parking:     Number(form.parking) || 0,
      facing:      form.facing,
      floor:       Number(form.floor) || 0,
      totalFloors: Number(form.totalFloors) || 0,
    }));

    formData.append("amenities", JSON.stringify(splitCSV(form.amenities)));
    
    formData.append("nearby", JSON.stringify({
      schools:   splitCSV(form.schools),
      metro:     splitCSV(form.metro),
      hospitals: splitCSV(form.hospitals),
      malls:     splitCSV(form.malls),
    }));

    // 3. Append images
    images.forEach((img) => {
      if (img.file) {
        formData.append("images", img.file);
      } else if (img.url) {
        // Appending existing URLs so the backend retains them during edit mode
        formData.append("existingImages", img.url);
      }
    });

    // Determine the primary image index based on the final array state
    const primaryIdx = images.findIndex((img) => img.isPrimary);
    if (primaryIdx !== -1) {
      formData.append("primaryImageIndex", primaryIdx);
    }

    try {
      if (listingId) {
        await axios.put(`${SERVER}/api/listings/${listingId}`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data" 
          },
        });
      } else {
        await axios.post(`${SERVER}/api/listings`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data" 
          },
        });
      }
      setSuccess(true);
      setTimeout(() => navigate("/employee/home"), 1400);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save listing.");
    } finally {
      setLoading(false);
    }
  };

  /* ════ RENDER ════ */
  return (
    <div className="ev-lf-page">

      {/* ── TOPBAR ── */}
      <header className="ev-ed-topbar">
        <div className="ev-ed-topbar-inner">
          <div className="ev-nav-logo" style={{ cursor: "default" }}>
            <div className="ev-nav-mark">
              <svg viewBox="0 0 24 24" fill="white" width="14" height="14">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
            </div>
            EV CRM
          </div>
          <button className="ev-lf-back-btn" type="button" onClick={() => navigate("/employee/home")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back
          </button>
        </div>
      </header>

      <div className="ev-lf-wrap ev-inner">

        {/* PAGE HEADER */}
        <div className="ev-lf-page-header">
          <p className="ev-sec-label">{listingId ? "Edit listing" : "New listing"}</p>
          <h1 className="ev-sec-title">{listingId ? "Update Property" : "Create Property"}</h1>
          <p className="ev-sec-desc">Fields marked * are required.</p>
        </div>

        <form onSubmit={handleSubmit} className="ev-lf-form" noValidate>

          {/* ── 1. BASIC INFO ── */}
          <div className="ev-lf-card">
            <SectionHead step="1" title="Basic Info" sub="Core listing details" />
            <div className="ev-lf-grid-2">
              <Field label="Title *">
                <Input name="title" value={form.title} onChange={handleChange} placeholder="e.g. 3BHK Apartment in Sector 62" />
              </Field>
              <Field label="Price *">
                <Input name="price" value={form.price} onChange={handleChange} placeholder="e.g. 8500000" type="number" min="0" />
              </Field>
            </div>
            <div className="ev-lf-grid-2">
              <Field label="Listing Type *">
                <Select name="type" value={form.type} onChange={handleChange}>
                  <option value="">Select type</option>
                  <option value="buy">Buy</option>
                  <option value="rent">Rent</option>
                  <option value="commercial">Commercial</option>
                </Select>
              </Field>
              <Field label="Status">
                <Select name="status" value={form.status} onChange={handleChange}>
                  <option value="active">Active</option>
                  <option value="sold">Sold</option>
                  <option value="inactive">Inactive</option>
                </Select>
              </Field>
            </div>
          </div>

          {/* ── 2. IMAGES ── */}
          <div className="ev-lf-card">
            <SectionHead step="2" title="Photos" sub="Up to 8 images. Drag to reorder. First image is the cover." />

            {/* DROP ZONE */}
            <div
              className="ev-lf-dropzone"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <div className="ev-lf-dropzone-inner">
                <div className="ev-lf-dropzone-ico">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <div className="ev-lf-dropzone-text">
                  <span className="ev-lf-dropzone-cta">Tap to upload</span> or drag & drop
                </div>
                <div className="ev-lf-dropzone-hint">JPG, PNG, WEBP — max 8 images</div>
              </div>
            </div>

            {/* PREVIEW GRID */}
            {images.length > 0 && (
              <div className="ev-lf-img-grid">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className={`ev-lf-img-thumb ${img.isPrimary ? "ev-lf-img-thumb--primary" : ""}`}
                    draggable
                    onDragStart={() => onDragStart(i)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => onDropOrder(i)}
                  >
                    <img src={img.url} alt={`Photo ${i + 1}`} />

                    {img.isPrimary && (
                      <span className="ev-lf-img-cover-badge">Cover</span>
                    )}

                    <div className="ev-lf-img-actions">
                      {!img.isPrimary && (
                        <button
                          type="button"
                          className="ev-lf-img-btn ev-lf-img-btn--primary"
                          onClick={(e) => { e.stopPropagation(); setPrimary(i); }}
                          title="Set as cover"
                        >
                          ★
                        </button>
                      )}
                      <button
                        type="button"
                        className="ev-lf-img-btn ev-lf-img-btn--remove"
                        onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}

                {/* add more slot */}
                {images.length < 8 && (
                  <button
                    type="button"
                    className="ev-lf-img-add"
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add more
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ── 3. CONFIGURATION ── */}
          <div className="ev-lf-card">
            <SectionHead step="3" title="Configuration" sub="Rooms and spaces" />
            <div className="ev-lf-grid-3">
              <Field label="Bedrooms">
                <Input name="bedrooms" value={form.bedrooms} onChange={handleChange} placeholder="0" type="number" min="0" />
              </Field>
              <Field label="Bathrooms">
                <Input name="bathrooms" value={form.bathrooms} onChange={handleChange} placeholder="0" type="number" min="0" />
              </Field>
              <Field label="Balconies">
                <Input name="balconies" value={form.balconies} onChange={handleChange} placeholder="0" type="number" min="0" />
              </Field>
            </div>
          </div>

          {/* ── 4. AREA ── */}
          <div className="ev-lf-card">
            <SectionHead step="4" title="Area" sub="Square footage details" />
            <div className="ev-lf-grid-2">
              <Field label="Built-up Area" hint="sq.ft">
                <Input name="builtUp" value={form.builtUp} onChange={handleChange} placeholder="e.g. 1450" type="number" min="0" />
              </Field>
              <Field label="Carpet Area" hint="sq.ft">
                <Input name="carpet" value={form.carpet} onChange={handleChange} placeholder="e.g. 1200" type="number" min="0" />
              </Field>
            </div>
          </div>

          {/* ── 5. LOCATION ── */}
          <div className="ev-lf-card">
            <SectionHead step="5" title="Location" sub="Where is this property?" />
            <Field label="Address">
              <Input name="address" value={form.address} onChange={handleChange} placeholder="Street / Society name" />
            </Field>
            <div className="ev-lf-grid-2">
              <Field label="City *">
                <Input name="city" value={form.city} onChange={handleChange} placeholder="e.g. Noida" />
              </Field>
              <Field label="State">
                <Input name="state" value={form.state} onChange={handleChange} placeholder="e.g. Uttar Pradesh" />
              </Field>
            </div>
            <div className="ev-lf-grid-2">
              <Field label="Pincode">
                <Input name="pincode" value={form.pincode} onChange={handleChange} placeholder="e.g. 201309" />
              </Field>
              <Field label="Sector">
                <Input name="sector" value={form.sector} onChange={handleChange} placeholder="e.g. 62" />
              </Field>
            </div>
          </div>

          {/* ── 6. PROPERTY DETAILS ── */}
          <div className="ev-lf-card">
            <SectionHead step="6" title="Property Details" sub="Furnishing, floor, ownership" />
            <div className="ev-lf-grid-3">
              <Field label="Furnishing">
                <Select name="furnishing" value={form.furnishing} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="furnished">Furnished</option>
                  <option value="semi-furnished">Semi-Furnished</option>
                  <option value="unfurnished">Unfurnished</option>
                </Select>
              </Field>
              <Field label="Facing">
                <Select name="facing" value={form.facing} onChange={handleChange}>
                  <option value="">Select</option>
                  {["North","South","East","West","North-East","North-West","South-East","South-West"].map((d) => (
                    <option key={d} value={d.toLowerCase()}>{d}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Ownership">
                <Select name="ownership" value={form.ownership} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="freehold">Freehold</option>
                  <option value="leasehold">Leasehold</option>
                  <option value="cooperative">Co-operative</option>
                </Select>
              </Field>
            </div>
            <div className="ev-lf-grid-3">
              <Field label="Floor">
                <Input name="floor" value={form.floor} onChange={handleChange} placeholder="e.g. 5" type="number" min="0" />
              </Field>
              <Field label="Total Floors">
                <Input name="totalFloors" value={form.totalFloors} onChange={handleChange} placeholder="e.g. 14" type="number" min="0" />
              </Field>
              <Field label="Parking Spots">
                <Input name="parking" value={form.parking} onChange={handleChange} placeholder="0" type="number" min="0" />
              </Field>
            </div>
          </div>

          {/* ── 7. AMENITIES & NEARBY ── */}
          <div className="ev-lf-card">
            <SectionHead step="7" title="Amenities & Nearby" sub="Comma-separated values" />
            <Field label="Amenities" hint="comma-separated">
              <Input name="amenities" value={form.amenities} onChange={handleChange} placeholder="lift, parking, security, power backup" />
            </Field>
            <div className="ev-lf-grid-2">
              <Field label="Schools nearby">
                <Input name="schools" value={form.schools} onChange={handleChange} placeholder="Delhi Public School" />
              </Field>
              <Field label="Metro stations">
                <Input name="metro" value={form.metro} onChange={handleChange} placeholder="Noida Electronic City" />
              </Field>
            </div>
            <div className="ev-lf-grid-2">
              <Field label="Hospitals nearby">
                <Input name="hospitals" value={form.hospitals} onChange={handleChange} placeholder="Fortis Hospital" />
              </Field>
              <Field label="Malls nearby">
                <Input name="malls" value={form.malls} onChange={handleChange} placeholder="Shipra Mall" />
              </Field>
            </div>
          </div>

          {/* ── 8. DESCRIPTION ── */}
          <div className="ev-lf-card">
            <SectionHead step="8" title="Description" sub="What makes this property special?" />
            <div className="ev-lf-field">
              <label className="ev-lf-label">Property Description</label>
              <textarea
                className="ev-lf-input ev-lf-textarea"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the property — highlights, view, surroundings…"
                rows={5}
              />
            </div>
          </div>

          {/* ERROR / SUCCESS */}
          {error && (
            <div className="ev-lf-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}
          {success && (
            <div className="ev-lf-success">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              {listingId ? "Listing updated!" : "Listing created!"} Redirecting…
            </div>
          )}

          {/* ACTIONS */}
          <div className="ev-lf-actions">
            <button type="button" className="ev-btn-outline ev-lf-cancel" onClick={() => navigate("/employee/home")} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="ev-btn ev-lf-submit" disabled={loading || success}>
              {loading ? "Saving…" : success ? "Saved ✓" : listingId ? "Update Listing" : "Create Listing"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ListingForm;