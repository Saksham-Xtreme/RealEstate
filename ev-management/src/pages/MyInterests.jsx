import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MyInterests = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const token = localStorage.getItem("token");
  
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/interests`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        const data = await res.json();
  
        setListings(data.listings || []);
  
      } catch (err) {
        console.error("Failed to load interests");
      } finally {
        setLoading(false);
      }
    };
  
    fetchInterests();
  }, []);

  return (
    <div>
      <Navbar />

      <div style={{ padding: 20 }}>
        <h2>My Interested Properties</h2>

        {loading && <p>Loading...</p>}

        {!loading && listings.length === 0 && (
          <p>No interests yet</p>
        )}

        <div style={{ display: "grid", gap: 16 }}>
          {listings.map((l) => (
            <div key={l._id} style={{
              border: "1px solid #ddd",
              padding: 12,
              borderRadius: 8,
            }}>
              <div>{l.title}</div>
              <div>{l.location?.city}</div>
              <div>₹{l.price}</div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MyInterests;