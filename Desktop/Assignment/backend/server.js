const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
});

// Database connection
try {
  const connectDB = require('./src/config/database');
  connectDB();
  console.log('✅ Database connection imported successfully');
} catch (error) {
  console.log('⚠️  Database connection optional:', error.message);
}

// Import and use routes
console.log('📁 Importing routes...');

try {
  const authRoutes = require('./src/routes/auth');
  app.use('/api/auth', authRoutes);
  console.log('✅ Auth routes imported and mounted successfully');
} catch (error) {
  console.error('❌ Auth routes error:', error.message);
}

try {
  const projectRoutes = require('./src/routes/projects');
  app.use('/api/projects', projectRoutes);
  console.log('✅ Project routes imported and mounted successfully');
} catch (error) {
  console.error('❌ Project routes error:', error.message);
}

try {
  const taskRoutes = require('./src/routes/tasks');
  app.use('/api/tasks', taskRoutes);
  console.log('✅ Task routes imported and mounted successfully');
} catch (error) {
  console.error('❌ Task routes error:', error.message);
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Handle 404 - PROPER WAY (without problematic wildcard)
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Test: http://localhost:${PORT}/api/test`);
  console.log(`🔍 Health: http://localhost:${PORT}/api/health`);
});