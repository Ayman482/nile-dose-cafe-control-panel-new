const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categories');

// مسارات التصنيفات
router.route('/')
  .get(getCategories)
  .post(protect, authorize('admin', 'editor'), createCategory);

router.route('/:id')
  .get(getCategory)
  .put(protect, authorize('admin', 'editor'), updateCategory)
  .delete(protect, authorize('admin'), deleteCategory);

module.exports = router;
