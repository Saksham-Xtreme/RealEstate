const Listing = require("../models/listing.model");
const Employee = require("../models/employee.model");
const cloudinary = require("../config/cloudinary");

// ============================================================
// CREATE LISTING
// ============================================================

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
    console.error("CREATE LISTING ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// ============================================================
// GET ALL LISTINGS - PUBLIC
// Only ACTIVE + NON-ARCHIVED listings are visible
// ============================================================

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

    const query = {
      status: "active",
      $or: [
        { "archive.isArchived": false },
        { "archive.isArchived": { $exists: false } },
      ],
    };

    if (city) {
      query["location.city"] = city;
    }

    if (type) {
      query.type = type;
    }

    if (bedrooms) {
      query["configuration.bedrooms"] = Number(bedrooms);
    }

    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

    let sortOption = {};

    if (sort === "price_asc") {
      sortOption.price = 1;
    } else if (sort === "price_desc") {
      sortOption.price = -1;
    } else {
      sortOption.createdAt = -1;
    }

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
    console.error("GET LISTINGS ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// ============================================================
// GET SINGLE LISTING - PUBLIC
// Archived / sold / inactive listings cannot be accessed
// ============================================================

const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findOne({
      _id: req.params.id,
      status: "active",
      $or: [
        { "archive.isArchived": false },
        { "archive.isArchived": { $exists: false } },
      ],
    }).populate(
      "society",
      "name location"
    );

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    res.json({
      success: true,
      listing,
    });
  } catch (err) {
    console.error("GET LISTING ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// ============================================================
// GET MY LISTINGS - EMPLOYEE
// ============================================================

const getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({
      createdBy: req.user.id,
    })
      .sort({ createdAt: -1 })
      .select(
        "title price location images type status archive createdAt"
      );

    res.json({
      success: true,
      data: listings,
    });
  } catch (err) {
    console.error("GET MY LISTINGS ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// ============================================================
// GET ARCHIVED LISTINGS
// OWNER + EMPLOYEE
// ============================================================

const getArchivedListings = async (req, res) => {
  try {
    const listings = await Listing.find({
      "archive.isArchived": true,
    })
      .sort({ "archive.archivedAt": -1 })
      .select(
        "title price location images configuration type status archive createdAt"
      );

    res.json({
      success: true,
      data: listings,
    });
  } catch (err) {
    console.error("GET ARCHIVED LISTINGS ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// ============================================================
// ARCHIVE LISTING
// OWNER + EMPLOYEE
// ============================================================

const archiveListing = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      reason,
      sold,
      soldThrough,
    } = req.body;

    // --------------------------------------------------------
    // VALIDATE REASON
    // --------------------------------------------------------

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Archive reason is required",
      });
    }

    // --------------------------------------------------------
    // FIND LISTING
    // --------------------------------------------------------

    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    if (listing.archive?.isArchived) {
      return res.status(400).json({
        success: false,
        message: "Listing is already archived",
      });
    }

    // --------------------------------------------------------
    // CURRENT AUTHENTICATED USER
    // protect middleware has already loaded req.user
    // --------------------------------------------------------

    const user = req.user;

    if (!user || !user.role) {
      return res.status(401).json({
        success: false,
        message: "Authenticated user not found",
      });
    }

    if (!["owner", "employee"].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to archive listings",
      });
    }

    // --------------------------------------------------------
    // EMPLOYEE SOLD FLOW
    // --------------------------------------------------------

    let soldEmployee = null;

    const isEmployee = user.role === "employee";
    const isSold = sold === true;

    if (isEmployee && isSold) {
      if (!soldThrough) {
        return res.status(400).json({
          success: false,
          message:
            "Please select the employee who handled the sale",
        });
      }

      soldEmployee = await Employee.findOne({
        _id: soldThrough,
        role: "employee",
      }).select("name role");

      if (!soldEmployee) {
        return res.status(400).json({
          success: false,
          message: "Invalid employee selected",
        });
      }
    }

    // --------------------------------------------------------
    // OWNER FLOW
    // Owner does not use sold-through information
    // --------------------------------------------------------

    if (!isEmployee && soldThrough) {
      return res.status(400).json({
        success: false,
        message:
          "Sold-through employee can only be selected by an employee",
      });
    }

    // --------------------------------------------------------
    // SET LISTING STATUS
    // --------------------------------------------------------

    listing.status = isSold
      ? "sold"
      : "inactive";

    // --------------------------------------------------------
    // DETERMINE PERSON TYPE
    //
    // Employee -> Employee collection
    // Owner    -> User collection
    // --------------------------------------------------------

    const archivedByType =
      req.userType === "employee"
        ? "Employee"
        : "User";

    // --------------------------------------------------------
    // SAVE ARCHIVE INFORMATION
    // --------------------------------------------------------

    listing.archive = {
      isArchived: true,

      archivedAt: new Date(),

      archivedBy: {
        id: user._id,
        type: archivedByType,
      },

      archivedByName: user.name,

      archivedByRole: user.role,

      reason: reason.trim(),

      soldThrough: soldEmployee
        ? {
            id: soldEmployee._id,
            type: "Employee",
          }
        : {
            id: null,
            type: null,
          },

      soldThroughName:
        soldEmployee?.name || null,
    };

    await listing.save();

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    res.json({
      success: true,
      message: isSold
        ? "Listing archived as sold successfully"
        : "Listing archived successfully",
      data: listing,
    });

  } catch (err) {
    console.error("ARCHIVE LISTING ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// ============================================================
// RESTORE LISTING
// OWNER + EMPLOYEE
// ============================================================

const restoreListing = async (req, res) => {
  try {
    const { id } = req.params;

    const user = req.user;

    if (!user || !user.role) {
      return res.status(401).json({
        success: false,
        message: "Authenticated user not found",
      });
    }

    if (!["owner", "employee"].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to restore listings",
      });
    }

    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    if (!listing.archive?.isArchived) {
      return res.status(400).json({
        success: false,
        message: "Listing is not archived",
      });
    }

    // --------------------------------------------------------
    // SOLD PROPERTIES ARE LOCKED
    // --------------------------------------------------------

    if (listing.status === "sold") {
      return res.status(400).json({
        success: false,
        message:
          "Sold properties cannot be restored directly.",
      });
    }

    // --------------------------------------------------------
    // RESTORE
    // --------------------------------------------------------

    listing.status = "active";

    listing.archive = {
      isArchived: false,

      archivedAt: null,

      archivedBy: {
        id: null,
        type: null,
      },

      archivedByName: null,

      archivedByRole: null,

      reason: null,

      soldThrough: {
        id: null,
        type: null,
      },

      soldThroughName: null,
    };

    await listing.save();

    res.json({
      success: true,
      message: "Listing restored successfully",
      data: listing,
    });

  } catch (err) {
    console.error("RESTORE LISTING ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// ============================================================
// HELPER
// ============================================================

const parseJSON = (data) => {
  try {
    return typeof data === "string"
      ? JSON.parse(data)
      : data;
  } catch {
    return {};
  }
};


// ============================================================
// UPDATE LISTING
// EMPLOYEE ONLY
// ============================================================

const updateListing = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findOne({
      _id: id,
      createdBy: req.user.id,
    });

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    // --------------------------------------------------------
    // DO NOT EDIT ARCHIVED LISTINGS
    // --------------------------------------------------------

    if (listing.archive?.isArchived) {
      return res.status(400).json({
        success: false,
        message:
          "Archived listings cannot be edited.",
      });
    }

    const body = req.body || {};

    // --------------------------------------------------------
    // BASIC FIELDS
    // --------------------------------------------------------

    listing.title =
      body.title ?? listing.title;

    listing.price =
      body.price ?? listing.price;

    listing.type =
      body.type ?? listing.type;

    // IMPORTANT:
    // Status is NOT editable here.
    // Archive / restore controls status.

    listing.description =
      body.description ?? listing.description;

    // --------------------------------------------------------
    // PARSE JSON FIELDS
    // --------------------------------------------------------

    const location =
      parseJSON(body.location);

    const configuration =
      parseJSON(body.configuration);

    const area =
      parseJSON(body.area);

    const details =
      parseJSON(body.details);

    const nearby =
      parseJSON(body.nearby);

    const amenities =
      parseJSON(body.amenities);

    // --------------------------------------------------------
    // LOCATION
    // --------------------------------------------------------

    if (body.location) {
      listing.location = {
        ...listing.location?.toObject(),
        ...location,
      };
    }

    // --------------------------------------------------------
    // CONFIGURATION
    // --------------------------------------------------------

    if (body.configuration) {
      listing.configuration = {
        ...listing.configuration?.toObject(),
        ...configuration,
      };
    }

    // --------------------------------------------------------
    // AREA
    // --------------------------------------------------------

    if (body.area) {
      listing.area = {
        ...listing.area?.toObject(),
        ...area,
      };
    }

    // --------------------------------------------------------
    // DETAILS
    // --------------------------------------------------------

    if (body.details) {
      const cleanDetails = {
        ...details,
      };

      if (!cleanDetails.furnishing) {
        delete cleanDetails.furnishing;
      }

      if (!cleanDetails.ownership) {
        delete cleanDetails.ownership;
      }

      listing.details = {
        ...listing.details?.toObject(),
        ...cleanDetails,
      };
    }

    // --------------------------------------------------------
    // NEARBY + AMENITIES
    // --------------------------------------------------------

    if (body.nearby) {
      listing.nearby = nearby;
    }

    if (body.amenities) {
      listing.amenities = amenities;
    }

    // --------------------------------------------------------
    // IMAGE HANDLING
    // --------------------------------------------------------

    let existingImages = [];

    if (body.existingImages) {
      existingImages =
        Array.isArray(body.existingImages)
          ? body.existingImages
          : [body.existingImages];
    }

    const formattedExisting =
      existingImages.map((url) => ({
        url,
        publicId: null,
        isPrimary: false,
      }));

    let newImages = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result =
          await cloudinary.uploader.upload(
            file.path,
            {
              folder:
                "real-estate/listings",
            }
          );

        newImages.push({
          url: result.secure_url,
          publicId: result.public_id,
          isPrimary: false,
        });
      }
    }

    let finalImages = [
      ...formattedExisting,
      ...newImages,
    ];

    const primaryIndex =
      Number(body.primaryImageIndex);

    if (
      !isNaN(primaryIndex) &&
      finalImages[primaryIndex]
    ) {
      finalImages = finalImages.map(
        (img, i) => ({
          ...img,
          isPrimary:
            i === primaryIndex,
        })
      );
    } else if (finalImages.length > 0) {
      finalImages[0].isPrimary = true;
    }

    if (finalImages.length > 0) {
      listing.images = finalImages;
    }

    // --------------------------------------------------------
    // SAVE
    // --------------------------------------------------------

    await listing.save();

    res.json({
      success: true,
      data: listing,
    });

  } catch (err) {
    console.error("UPDATE ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {
  createListing,
  getListings,
  getListingById,
  getMyListings,
  getArchivedListings,
  updateListing,
  archiveListing,
  restoreListing,
};