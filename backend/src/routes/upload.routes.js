const express = require('express');
const router = express.Router();
const { upload, uploadFile } = require('../services/upload.service');
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware');

// Route to upload a single file (like a poster or video)
router.post('/', authMiddleware, adminMiddleware, upload.single('file'), uploadFile);

module.exports = router;
