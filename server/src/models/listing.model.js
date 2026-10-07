const mongoose = require("mongoose");


// 🔷 IMAGE SCHEMA
const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: String,
  isPrimary: { type: Boolean, default: false }
});


// 🔷 MAIN LISTING SCHEMA
const listingSchema = new mongoose.Schema({

  // BASIC INFO
  title: { type: String, required: true, trim: true },
  price: { type: Number, required: true },

  type: {
    type: String,
    enum: ["buy", "rent", "commercial"],
    required: true
  },

  // 🔷 CONFIGURATION
  configuration: {
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    balconies: { type: Number, default: 0 }
  },

  // 🔷 AREA
  area: {
    builtUp: Number,
    carpet: Number,
    unit: { type: String, default: "sqft" }
  },

  // 🔷 LOCATION
  location: {
    address: String,
    city: { type: String, index: true },
    state: String,
    pincode: String,
    sector: String,

    coordinates: {
      lat: Number,
      lng: Number
    }
  },

  // 🔷 RELATION
  society: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Society"
  },

  // 🔷 MEDIA
  images: [imageSchema],

  // 🔷 DETAILS
  details: {
    furnishing: {
      type: String,
      enum: ["furnished", "semi-furnished", "unfurnished"]
    },

    parking: { type: Number, default: 0 },
    facing: String,
    floor: Number,
    totalFloors: Number,

    ownership: {
      type: String,
      enum: ["freehold", "leasehold"]
    }
  },

  // 🔷 AMENITIES
  amenities: [String],

  // 🔷 NEARBY
  nearby: {
    schools: [String],
    metro: [String],
    hospitals: [String],
    malls: [String]
  },

  // 🔷 DESCRIPTION
  description: String,

  // 🔷 STATUS
  status: {
    type: String,
    enum: ["active", "sold", "inactive"],
    default: "active",
    index: true
  },

  // 🔷 ARCHIVE INFORMATION
  archive: {
    isArchived: {
      type: Boolean,
      default: false,
      index: true
    },

    archivedAt: {
      type: Date,
      default: null
    },

    archivedBy: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
      },

      type: {
        type: String,
        enum: ["User", "Employee"],
        default: null
      }
    },

    archivedByName: {
      type: String,
      default: null
    },

    archivedByRole: {
      type: String,
      enum: ["owner", "employee"],
      default: null
    },

    reason: {
      type: String,
      trim: true,
      default: null
    },

    // Employee who handled the sale
    soldThrough: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
      },

      type: {
        type: String,
        enum: ["User", "Employee"],
        default: null
      }
    },

    soldThroughName: {
      type: String,
      default: null
    }
  },

  // 🔷 CREATED BY
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

}, { timestamps: true });


// 🔷 INDEXES (IMPORTANT FOR FILTER PERFORMANCE)
listingSchema.index({ price: 1 });
listingSchema.index({ "configuration.bedrooms": 1 });


// 🔷 EXPORT
module.exports = mongoose.model("Listing", listingSchema);