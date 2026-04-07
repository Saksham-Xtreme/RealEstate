const mongoose = require("mongoose");

const interestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
  },
  { timestamps: true }
);

// 🔥 prevent duplicate interest
interestSchema.index({ user: 1, listing: 1 }, { unique: true });

module.exports = mongoose.model("Interest", interestSchema);