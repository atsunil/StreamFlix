const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'StreamFlix', // The name of the folder in Cloudinary
    allowed_formats: ['jpg', 'png', 'mp4'], // Allowed file formats
  },
});

// Create multer upload middleware
const upload = multer({ storage: storage });

// Function to handle file uploads
const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.status(200).json({ url: req.file.path });
};

module.exports = {
  upload,
  uploadFile,
};