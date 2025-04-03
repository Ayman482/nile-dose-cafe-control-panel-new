const Settings = require('../models/Settings');

// @desc    الحصول على إعدادات الموقع
// @route   GET /api/settings
// @access  Public
exports.getSettings = async (req, res) => {
  try {
    // البحث عن الإعدادات أو إنشاء إعدادات افتراضية إذا لم تكن موجودة
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = await Settings.create({});
    }
    
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم'
    });
  }
};

// @desc    تحديث إعدادات الموقع
// @route   PUT /api/settings
// @access  Private
exports.updateSettings = async (req, res) => {
  try {
    // البحث عن الإعدادات أو إنشاء إعدادات افتراضية إذا لم تكن موجودة
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = await Settings.create({});
    }
    
    // تحديث الإعدادات
    settings = await Settings.findByIdAndUpdate(settings._id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      message: 'تم تحديث الإعدادات بنجاح',
      data: settings
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم'
    });
  }
};
