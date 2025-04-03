const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'الرجاء إدخال اسم التصنيف']
  },
  nameEn: {
    type: String,
    required: [true, 'الرجاء إدخال اسم التصنيف بالإنجليزية']
  },
  description: {
    type: String
  },
  descriptionEn: {
    type: String
  },
  image: {
    type: String,
    default: 'no-image.jpg'
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Category', CategorySchema);
