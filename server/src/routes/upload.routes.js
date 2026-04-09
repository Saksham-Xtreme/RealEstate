const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "real-estate/listings",
    });

    res.json({
      url: result.secure_url,
    });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({
      message: "Image upload failed",
    });
  }
});

module.exports = router;