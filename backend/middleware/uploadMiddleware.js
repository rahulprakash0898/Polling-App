const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Define Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "polling-app-profile-images", // Cloudinary folder name
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

// Create multer instance using Cloudinary storage
const upload = multer({ storage });

module.exports = upload;