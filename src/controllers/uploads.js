const path = require('path');
const fs = require('fs');

// @desc    تحميل صورة
// @route   POST /api/uploads
// @access  Private
exports.uploadFile = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'لم يتم تحديد ملف للتحميل'
      });
    }

    const file = req.files.file;
    
    // التحقق من نوع الملف
    if (!file.mimetype.startsWith('image')) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء تحميل صورة فقط'
      });
    }
    
    // التحقق من حجم الملف
    if (file.size > 2000000) {
      return res.status(400).json({
        success: false,
        message: 'حجم الصورة يجب أن يكون أقل من 2 ميجابايت'
      });
    }
    
    // إنشاء اسم ملف فريد
    file.name = `upload_${Date.now()}${path.parse(file.name).ext}`;
    
    // تحديد مجلد التحميل
    const uploadDir = req.query.type === 'products' ? 'products' : 
                     req.query.type === 'categories' ? 'categories' : 'general';
    
    // التأكد من وجود المجلد
    const uploadPath = `${process.cwd()}/src/uploads/${uploadDir}`;
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    // نقل الملف
    file.mv(`${uploadPath}/${file.name}`, async err => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          message: 'حدث خطأ أثناء تحميل الملف'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'تم تحميل الملف بنجاح',
        data: {
          fileName: file.name,
          filePath: `${uploadDir}/${file.name}`
        }
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم'
    });
  }
};
