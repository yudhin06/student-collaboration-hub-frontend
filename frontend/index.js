const express = require('express');
const cors = require('cors');
// const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('../backend/routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('College Student Resource Hub Backend Running');
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend is running successfully',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

// Start server without MongoDB dependency for now
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Backend API available at http://localhost:${PORT}`);
  console.log(`Auth endpoints available at http://localhost:${PORT}/api/auth`);
});

// MongoDB connection (commented out for now)
/*
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/collegehub', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});
*/ 