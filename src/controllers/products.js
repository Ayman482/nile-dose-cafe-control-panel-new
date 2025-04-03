const Product = require('../models/Product');
const Category = require('../models/Category');
const path = require('path');
const fs = require('fs');

// @desc    الحصول على جميع المنتجات
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    // تنفيذ البحث والفلترة
    let query;
    
    // نسخة من req.query
    const reqQuery = { ...req.query };
    
    // حقول للاستبعاد
    const removeFields = ['select', 'sort', 'page', 'limit'];
    
    // حذف الحقول من reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    
    // إنشاء سلسلة البحث
    let queryStr = JSON.stringify(reqQuery);
    
    // إنشاء عوامل التشغيل ($gt, $gte, الخ)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    // البحث مع الربط بالتصنيف
    query = Product.find(JSON.parse(queryStr)).populate('category');
    
    // اختيار حقول معينة
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }
    
    // الترتيب
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    
    // الصفحات
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Product.countDocuments();
    
    query = query.skip(startIndex).limit(limit);
    
    // تنفيذ الاستعلام
    const products = await query;
    
    // الصفحات
    const pagination = {};
    
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    
    res.status(200).json({
      success: true,
      count: products.length,
      pagination,
      data: products
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم'
    });
  }
};

// @desc    الحصول على منتج واحد
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'لم يتم العثور على المنتج'
      });
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم'
    });
  }
};

// @desc    إنشاء منتج جديد
// @route   POST /api/products
// @access  Private
exports.createProduct = async (req, res) => {
  try {
    // التحقق من وجود التصنيف
    const category = await Category.findById(req.body.category);
    
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
      file.name = `product_${Date.now()}${path.parse(file.name).ext}`;
      
      // نقل الملف
      file.mv(`${process.cwd()}/src/uploads/products/${file.name}`, async err => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء تحميل الصورة'
          });
        }
        
        // إنشاء المنتج مع الصورة
        req.body.image = `products/${file.name}`;
        const product = await Product.create(req.body);
        
        res.status(201).json({
          success: true,
          message: 'تم إنشاء المنتج بنجاح',
          data: product
        });
      });
    } else {
      // إنشاء المنتج بدون صورة
      const product = await Product.create(req.body);
      
      res.status(201).json({
        success: true,
        message: 'تم إنشاء المنتج بنجاح',
        data: product
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

// @desc    تحديث منتج
// @route   PUT /api/products/:id
// @access  Private
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'لم يتم العثور على المنتج'
      });
    }
    
    // التحقق من وجود التصنيف إذا تم تغييره
    if (req.body.category) {
      const category = await Category.findById(req.body.category);
      
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'لم يتم العثور على التصنيف'
        });
      }
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
      file.name = `product_${Date.now()}${path.parse(file.name).ext}`;
      
      // نقل الملف
      file.mv(`${process.cwd()}/src/uploads/products/${file.name}`, async err => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء تحميل الصورة'
          });
        }
        
        // حذف الصورة القديمة إذا كانت موجودة
        if (product.image && product.image !== 'no-image.jpg') {
          const oldImagePath = `${process.cwd()}/src/uploads/${product.image}`;
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        
        // تحديث المنتج مع الصورة الجديدة
        req.body.image = `products/${file.name}`;
        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true
        });
        
        res.status(200).json({
          success: true,
          message: 'تم تحديث المنتج بنجاح',
          data: product
        });
      });
    } else {
      // تحديث المنتج بدون تغيير الصورة
      product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      
      res.status(200).json({
        success: true,
        message: 'تم تحديث المنتج بنجاح',
        data: product
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

// @desc    حذف منتج
// @route   DELETE /api/products/:id
// @access  Private
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'لم يتم العثور على المنتج'
      });
    }
    
    // حذف الصورة إذا كانت موجودة
    if (product.image && product.image !== 'no-image.jpg') {
      const imagePath = `${process.cwd()}/src/uploads/${product.image}`;
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await product.remove();
    
    res.status(200).json({
      success: true,
      message: 'تم حذف المنتج بنجاح',
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
