const Listing = require("../models/listing.model");
const cloudinary = require("../config/cloudinary");

// 🔷 CREATE LISTING
const createListing = async (req, res) => {
  try {
    const files = req.files;

    let uploadedImages = [];

    if (files && files.length > 0) {
      const uploads = files.map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: "real-estate/listings",
        })
      );

      const results = await Promise.all(uploads);

      uploadedImages = results.map((img, index) => ({
        url: img.secure_url,
        publicId: img.public_id,
        isPrimary: index === 0,
      }));
    }

    const listing = await Listing.create({
      ...req.body,
      images: uploadedImages,
      createdBy: req.user.id,
      status: "active",
    });

    res.json({
      success: true,
      data: listing,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

// 🔷 GET ALL LISTINGS (PUBLIC)
const getListings = async (req, res) => {
  try {
    let {
      city,
      minPrice,
      maxPrice,
      type,
      bedrooms,
      page = 1,
      limit = 10,
      sort = "latest",
    } = req.query;

    page = Math.max(1, Number(page));
    limit = Math.min(50, Number(limit));

    let query = { status: "active" };

    if (city) query["location.city"] = city;
    if (type) query.type = type;
    if (bedrooms) query["configuration.bedrooms"] = Number(bedrooms);

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = {};
    if (sort === "price_asc") sortOption.price = 1;
    else if (sort === "price_desc") sortOption.price = -1;
    else sortOption.createdAt = -1;

    const skip = (page - 1) * limit;

    const listings = await Listing.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .select("title price location images configuration type");

    const total = await Listing.countDocuments(query);

    res.json({
      success: true,
      listings,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔷 GET SINGLE LISTING
const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      "society",
      "name location"
    );

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    res.json({ success: true, listing });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔷 GET EMPLOYEE LISTINGS
const getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({
      createdBy: req.user.id,
    })
      .sort({ createdAt: -1 })
      .select("title price location images type");

    res.json({
      success: true,
      data: listings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};


// helper
const parseJSON = (data) => {
  try {
    return typeof data === "string" ? JSON.parse(data) : data;
  } catch {
    return {};
  }
};
// const Listing = require("../models/listing.model");
// const cloudinary = require("../config/cloudinary");

// // helper
// const parseJSON = (data) => {
//   try {
//     return typeof data === "string" ? JSON.parse(data) : data;
//   } catch {
//     return {};
//   }
// };

const updateListing = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findOne({
      _id: id,
      createdBy: req.user.id
    });

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found"
      });
    }

    // 🔥 SAFE BODY
    const body = req.body || {};

    console.log("BODY:", body);
    console.log("FILES:", req.files);

    // ─────────────────────────────
    // BASIC FIELDS
    // ─────────────────────────────
    listing.title = body.title ?? listing.title;
    listing.price = body.price ?? listing.price;
    listing.type = body.type ?? listing.type;
    listing.status = body.status ?? listing.status;
    listing.description = body.description ?? listing.description;

    // ─────────────────────────────
    // PARSE JSON FIELDS
    // ─────────────────────────────
    const location = parseJSON(body.location);
    const configuration = parseJSON(body.configuration);
    const area = parseJSON(body.area);
    const details = parseJSON(body.details);
    const nearby = parseJSON(body.nearby);
    const amenities = parseJSON(body.amenities);

    if (body.location) {
      listing.location = {
        ...listing.location.toObject(),
        ...location
      };
    }

    if (body.configuration) {
      listing.configuration = {
        ...listing.configuration.toObject(),
        ...configuration
      };
    }

    if (body.area) {
      listing.area = {
        ...listing.area.toObject(),
        ...area
      };
    }

    if (body.details) {
      const cleanDetails = { ...details };

      if (!cleanDetails.furnishing) delete cleanDetails.furnishing;
      if (!cleanDetails.ownership) delete cleanDetails.ownership;

      listing.details = {
        ...listing.details.toObject(),
        ...cleanDetails
      };
    }

    if (body.nearby) listing.nearby = nearby;
    if (body.amenities) listing.amenities = amenities;

    // ─────────────────────────────
    // IMAGE HANDLING
    // ─────────────────────────────

    let existingImages = [];

    if (body.existingImages) {
      existingImages = Array.isArray(body.existingImages)
        ? body.existingImages
        : [body.existingImages];
    }

    // keep old images
    const formattedExisting = existingImages.map((url) => ({
      url,
      publicId: null,
      isPrimary: false
    }));

    // upload new images
    let newImages = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "real-estate/listings"
        });

        newImages.push({
          url: result.secure_url,
          publicId: result.public_id,
          isPrimary: false
        });
      }
    }

    // merge images
    let finalImages = [...formattedExisting, ...newImages];

    // primary image
    const primaryIndex = Number(body.primaryImageIndex);

    if (!isNaN(primaryIndex) && finalImages[primaryIndex]) {
      finalImages = finalImages.map((img, i) => ({
        ...img,
        isPrimary: i === primaryIndex
      }));
    } else if (finalImages.length > 0) {
      finalImages[0].isPrimary = true;
    }

    if (finalImages.length > 0) {
      listing.images = finalImages;
    }

    // ─────────────────────────────
    await listing.save();

    res.json({
      success: true,
      data: listing
    });

  } catch (err) {
    console.error("UPDATE ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

module.exports = { updateListing };


// 🔷 EXPORT
module.exports = {
  createListing,
  getListings,
  getListingById,
  getMyListings,
  updateListing, // ✅ IMPORTANT
};
