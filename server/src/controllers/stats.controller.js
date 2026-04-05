// controllers/stats.controller.js
const Listing = require("../models/listing.model");

const getStats = async (req, res) => {
  try {
    const totalListings = await Listing.countDocuments({ status: "active" });

    const cities = await Listing.distinct("location.city");

    res.json({
      success: true,
      stats: {
        totalListings,
        totalCities: cities.length,
        verified: "100%"
      }
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

module.exports = { getStats };