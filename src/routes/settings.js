const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getSettings,
  updateSettings
} = require('../controllers/settings');

// مسارات إعدادات الموقع
router.route('/')
  .get(getSettings)
  .put(protect, authorize('admin'), updateSettings);

module.exports = router;
