const mongoose = require("mongoose");
const Interest = require("../models/interest.model");

// ─── ADD INTEREST ─────────────────
exports.addInterest = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const { listingId } = req.body;

    if (!listingId) {
      return res.status(400).json({
        success: false,
        message: "Listing ID required",
      });
    }

    const listingIdObj = new mongoose.Types.ObjectId(listingId);

    const existing = await Interest.findOne({
      user: userId,
      listing: listingIdObj,
    });

    if (existing) {
      return res.json({
        success: true,
        message: "Already interested",
      });
    }

    await Interest.create({
      user: userId,
      listing: listingIdObj,
    });

    return res.json({
      success: true,
      message: "Interest saved",
    });

  } catch (err) {
    console.error("Add Interest Error:", err);
    res.status(500).json({ success: false });
  }
};

// ─── CHECK INTEREST ─────────────────
exports.checkInterest = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const { listingId } = req.params;

    const listingIdObj = new mongoose.Types.ObjectId(listingId);

    const exists = await Interest.exists({
      user: userId,
      listing: listingIdObj,
    });

    res.json({ interested: !!exists });

  } catch (err) {
    console.error("Check Interest Error:", err);
    res.status(500).json({ success: false });
  }
};

// ─── GET MY INTERESTS ─────────────────
exports.getMyInterests = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const interests = await Interest.find({ user: userId })
      .populate("listing")
      .sort({ createdAt: -1 });

    const listings = interests.map((i) => i.listing);

    res.json({
      success: true,
      listings,
    });

  } catch (err) {
    console.error("Get Interests Error:", err);
    res.status(500).json({ success: false });
  }
};