const Listing = require("../models/listing.model");


// 🔷 CREATE LISTING
const createListing = async (req, res) => {
  try {
    const data = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const listing = await Listing.create({
      ...data,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      listing
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// 🔷 GET ALL LISTINGS (FILTER + PAGINATION)
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
      sort = "latest"
    } = req.query;

    // 🔷 SANITIZE INPUT
    page = Math.max(1, Number(page));
    limit = Math.min(50, Number(limit)); // cap limit (important)

    let query = {};

    // 🔹 LOCATION FILTER
    if (city) {
      query["location.city"] = city;
    }

    // 🔹 TYPE FILTER
    if (type) {
      query.type = type;
    }

    // 🔹 BEDROOM FILTER
    if (bedrooms) {
      query["configuration.bedrooms"] = Number(bedrooms);
    }

    // 🔹 PRICE FILTER
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 🔹 STATUS FILTER (IMPORTANT)
    query.status = "active";

    // 🔹 SORTING
    let sortOption = {};
    if (sort === "price_asc") sortOption.price = 1;
    else if (sort === "price_desc") sortOption.price = -1;
    else sortOption.createdAt = -1;

    // 🔹 PAGINATION
    const skip = (page - 1) * limit;

    const listings = await Listing.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .select("title price location images configuration");

    const total = await Listing.countDocuments(query);

    res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      listings
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// 🔷 GET SINGLE LISTING
const getListingById = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id)
      .populate("society", "name location");

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found"
      });
    }

    res.json({
      success: true,
      listing
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// 🔷 EXPORT
module.exports = {
  createListing,
  getListings,
  getListingById
};