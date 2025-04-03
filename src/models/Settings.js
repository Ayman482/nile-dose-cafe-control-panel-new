const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SettingsSchema = new Schema({
  siteName: {
    type: String,
    default: 'كافيه النيل دوز'
  },
  siteNameEn: {
    type: String,
    default: 'Nile Dose Cafe'
  },
  logo: {
    type: String,
    default: 'logo.png'
  },
  primaryColor: {
    type: String,
    default: '#0077b6'
  },
  secondaryColor: {
    type: String,
    default: '#e9c46a'
  },
  phone: {
    type: String,
    default: '+966 5XXXXXXXX'
  },
  email: {
    type: String,
    default: 'info@niledosecafe.com'
  },
  address: {
    type: String,
    default: 'الرياض، المملكة العربية السعودية'
  },
  addressEn: {
    type: String,
    default: 'Riyadh, Saudi Arabia'
  },
  instagram: {
    type: String,
    default: 'https://www.instagram.com/niledose_cafe'
  },
  twitter: {
    type: String,
    default: '#'
  },
  facebook: {
    type: String,
    default: '#'
  },
  workingHours: {
    type: String,
    default: 'من 7 صباحاً حتى 12 منتصف الليل'
  },
  workingHoursEn: {
    type: String,
    default: '7 AM to 12 AM'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Settings', SettingsSchema);
