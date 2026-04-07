const Interest = require("../models/interest.model");

// ─── SAVE INTEREST ─────────────────
exports.addInterest = async (req, res) => {
  try {
    const userId = "testUser123"; // ✅ TEMP FIX
    const { listingId } = req.body;

    if (!listingId) {
      return res.status(400).json({ success: false, message: "Listing ID required" });
    }

    const existing = await Interest.findOne({
      user: userId,
      listing: listingId,
    });

    if (existing) {
      return res.json({ success: true, message: "Already interested" });
    }

    await Interest.create({
      user: userId,
      listing: listingId,
    });

    return res.json({ success: true, message: "Interest saved" });

  } catch (err) {
    console.error("Interest error:", err);
    res.status(500).json({ success: false });
  }
};

// ─── CHECK INTEREST ─────────────────
exports.checkInterest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { listingId } = req.params;

    const exists = await Interest.exists({
      user: userId,
      listing: listingId,
    });

    res.json({ interested: !!exists });

  } catch (err) {
    res.status(500).json({ success: false });
  }
};

// ─── GET ALL INTERESTS ─────────────────
exports.getMyInterests = async (req, res) => {
  try {
    const userId = req.user.id;

    const interests = await Interest.find({ user: userId })
      .populate("listing")
      .sort({ createdAt: -1 });

    const listings = interests.map((i) => i.listing);

    res.json({ success: true, listings });

  } catch (err) {
    res.status(500).json({ success: false });
  }
};