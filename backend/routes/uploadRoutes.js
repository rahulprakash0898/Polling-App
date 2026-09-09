const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");

// POST /api/upload
router.post("/", upload.single("image"), (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ message: "Image upload failed" });
  }

  res.status(200).json({ imageUrl: req.file.path }); // Cloudinary's secure_url
});

module.exports = router;