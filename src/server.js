// Server file for Nile Dose Cafe Control Panel
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');

// Import database connection
const connectDB = require('./database');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const settingsRoutes = require('./routes/settings');
const uploadRoutes = require('./routes/uploads');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  createParentPath: true
}));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
connectDB()
  .then(() => console.log('تم الاتصال بقاعدة البيانات بنجاح'))
  .catch(err => console.error('خطأ في الاتصال بقاعدة البيانات:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/uploads', uploadRoutes);

// Serve admin panel frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'حدث خطأ في الخادم',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`الخادم يعمل على المنفذ ${PORT}`);
});
