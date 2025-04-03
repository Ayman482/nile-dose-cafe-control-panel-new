const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/products');

// مسارات المنتجات
router.route('/')
  .get(getProducts)
  .post(protect, authorize('admin', 'editor'), createProduct);

router.route('/:id')
  .get(getProduct)
  .put(protect, authorize('admin', 'editor'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

module.exports = router;
