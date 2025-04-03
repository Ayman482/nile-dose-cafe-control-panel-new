const jwt = require('jsonwebtoken');
const User = require('../models/User');

// حماية المسارات - التحقق من تسجيل الدخول
exports.protect = async (req, res, next) => {
  let token;

  // التحقق من وجود التوكن في الهيدر
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // التحقق من وجود التوكن
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'غير مصرح لك بالوصول إلى هذه الصفحة، الرجاء تسجيل الدخول'
    });
  }

  try {
    // التحقق من صحة التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'niledosecafesecret');

    // البحث عن المستخدم بواسطة الآيدي
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'لم يتم العثور على المستخدم'
      });
    }

    // إضافة المستخدم إلى الريكويست
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'غير مصرح لك بالوصول إلى هذه الصفحة، الرجاء تسجيل الدخول مرة أخرى'
    });
  }
};

// التحقق من صلاحيات المستخدم
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح لك بالوصول إلى هذه الصفحة'
      });
    }
    next();
  };
};
