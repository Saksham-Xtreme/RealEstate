import { useState } from "react";
import axios from "axios";

const SERVER = import.meta.env.VITE_SERVER_URL || "http://localhost:8080";

const ListingForm = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    const formData = new FormData(e.target);

    try {
      await axios.post(`${SERVER}/api/listings`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Listing Created");
      e.target.reset();

    } catch (err) {
      console.error(err);
      alert("❌ Error creating listing");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* TITLE */}
      <input
        name="title"
        placeholder="Title"
        required
        className="w-full border p-2 rounded"
      />

      {/* PRICE */}
      <input
        name="price"
        type="number"
        placeholder="Price"
        required
        className="w-full border p-2 rounded"
      />

      {/* TYPE */}
      <select name="type" required className="w-full border p-2 rounded">
        <option value="">Select Type</option>
        <option value="buy">Buy</option>
        <option value="rent">Rent</option>
        <option value="commercial">Commercial</option>
      </select>

      {/* CITY */}
      <input
        name="location[city]"
        placeholder="City"
        className="w-full border p-2 rounded"
      />

      {/* BEDROOMS */}
      <input
        name="configuration[bedrooms]"
        type="number"
        placeholder="Bedrooms"
        className="w-full border p-2 rounded"
      />

      {/* AREA */}
      <input
        name="area[builtUp]"
        type="number"
        placeholder="Built-up Area"
        className="w-full border p-2 rounded"
      />

      {/* IMAGES */}
      <input
        name="images"
        type="file"
        multiple
        required
        className="w-full"
      />

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading ? "Creating..." : "Create Listing"}
      </button>
    </form>
  );
};

export default ListingForm;