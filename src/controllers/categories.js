const Category = require('../models/Category');
const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');

// @desc    الحصول على جميع التصنيفات
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort('order');
    
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم'
    });
  }
};

// @desc    الحصول على تصنيف واحد
// @route   GET /api/categories/:id
// @access  Public
exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'لم يتم العثور على التصنيف'
      });
    }
    
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم'
    });
  }
};

// @desc    إنشاء تصنيف جديد
// @route   POST /api/categories
// @access  Private
exports.createCategory = async (req, res) => {
  try {
    // معالجة الصورة إذا تم تحميلها
    if (req.files && req.files.image) {
      const file = req.files.image;
      
      // التحقق من نوع الملف
      if (!file.mimetype.startsWith('image')) {
        return res.status(400).json({
          success: false,
          message: 'الرجاء تحميل صورة'
        });
      }
      
      // التحقق من حجم الملف
      if (file.size > 1000000) {
        return res.status(400).json({
          success: false,
          message: 'حجم الصورة يجب أن يكون أقل من 1 ميجابايت'
        });
      }
      
      // إنشاء اسم ملف فريد
      file.name = `category_${Date.now()}${path.parse(file.name).ext}`;
      
      // نقل الملف
      file.mv(`${process.cwd()}/src/uploads/categories/${file.name}`, async err => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء تحميل الصورة'
          });
        }
        
        // إنشاء التصنيف مع الصورة
        req.body.image = `categories/${file.name}`;
        const category = await Category.create(req.body);
        
        res.status(201).json({
          success: true,
          message: 'تم إنشاء التصنيف بنجاح',
          data: category
        });
      });
    } else {
      // إنشاء التصنيف بدون صورة
      const category = await Category.create(req.body);
      
      res.status(201).json({
        success: true,
        message: 'تم إنشاء التصنيف بنجاح',
        data: category
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم'
    });
  }
};

// @desc    تحديث تصنيف
// @route   PUT /api/categories/:id
// @access  Private
exports.updateCategory = async (req, res) => {
  try {
    let category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'لم يتم العثور على التصنيف'
      });
    }
    
    // معالجة الصورة إذا تم تحميلها
    if (req.files && req.files.image) {
      const file = req.files.image;
      
      // التحقق من نوع الملف
      if (!file.mimetype.startsWith('image')) {
        return res.status(400).json({
          success: false,
          message: 'الرجاء تحميل صورة'
        });
      }
      
      // التحقق من حجم الملف
      if (file.size > 1000000) {
        return res.status(400).json({
          success: false,
          message: 'حجم الصورة يجب أن يكون أقل من 1 ميجابايت'
        });
      }
      
      // إنشاء اسم ملف فريد
      file.name = `category_${Date.now()}${path.parse(file.name).ext}`;
      
      // نقل الملف
      file.mv(`${process.cwd()}/src/uploads/categories/${file.name}`, async err => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء تحميل الصورة'
          });
        }
        
        // حذف الصورة القديمة إذا كانت موجودة
        if (category.image && category.image !== 'no-image.jpg') {
          const oldImagePath = `${process.cwd()}/src/uploads/${category.image}`;
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        
        // تحديث التصنيف مع الصورة الجديدة
        req.body.image = `categories/${file.name}`;
        category = await Category.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true
        });
        
        res.status(200).json({
          success: true,
          message: 'تم تحديث التصنيف بنجاح',
          data: category
        });
      });
    } else {
      // تحديث التصنيف بدون تغيير الصورة
      category = await Category.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      
      res.status(200).json({
        success: true,
        message: 'تم تحديث التصنيف بنجاح',
        data: category
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم'
    });
  }
};

// @desc    حذف تصنيف
// @route   DELETE /api/categories/:id
// @access  Private
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'لم يتم العثور على التصنيف'
      });
    }
    
    // التحقق من وجود منتجات مرتبطة بهذا التصنيف
    const products = await Product.find({ category: req.params.id });
    
    if (products.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'لا يمكن حذف هذا التصنيف لأنه يحتوي على منتجات'
      });
    }
    
    // حذف الصورة إذا كانت موجودة
    if (category.image && category.image !== 'no-image.jpg') {
      const imagePath = `${process.cwd()}/src/uploads/${category.image}`;
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await category.remove();
    
    res.status(200).json({
      success: true,
      message: 'تم حذف التصنيف بنجاح',
      data: {}
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم'
    });
  }
};
