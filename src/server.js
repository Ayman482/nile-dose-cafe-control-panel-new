// Server file for Nile Dose Cafe Control Panel
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const settingsRoutes = require('./routes/settings');
const uploadRoutes = require('./routes/uploads');

const app = express();
const PORT = process.env.PORT || 5000;

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
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://admin:admin@cluster0.mongodb.net/niledosecafe?retryWrites=true&w=majority';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  family: 4,  // Force IPv4
  connectTimeoutMS: 30000,
  keepAlive: true,
  keepAliveInitialDelay: 300000
})
.then(() => console.log('تم الاتصال بقاعدة البيانات بنجاح'))
.catch(err => {
  console.error('خطأ في الاتصال بقاعدة البيانات:', err);
  // Try alternative connection if SRV fails
  const fallbackURI = MONGO_URI.replace('mongodb+srv://', 'mongodb://');
  console.log('Attempting fallback connection...');
  return mongoose.connect(fallbackURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    family: 4
  });
})
.then(() => console.log('Connection successful (possibly via fallback)'))
.catch(err => console.error('All connection attempts failed:', err));

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
