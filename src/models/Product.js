const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: [true, 'الرجاء إدخال اسم المنتج']
  },
  nameEn: {
    type: String,
    required: [true, 'الرجاء إدخال اسم المنتج بالإنجليزية']
  },
  description: {
    type: String,
    required: [true, 'الرجاء إدخال وصف المنتج']
  },
  descriptionEn: {
    type: String,
    required: [true, 'الرجاء إدخال وصف المنتج بالإنجليزية']
  },
  price: {
    type: Number,
    required: [true, 'الرجاء إدخال سعر المنتج']
  },
  image: {
    type: String,
    default: 'no-image.jpg'
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'الرجاء اختيار تصنيف للمنتج']
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', ProductSchema);
