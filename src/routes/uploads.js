const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { uploadFile } = require('../controllers/uploads');

// مسارات تحميل الملفات
router.post('/', protect, authorize('admin', 'editor'), uploadFile);

module.exports = router;
