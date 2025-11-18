// src/app.js
const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const { connectDB } = require('./db'); // Import connectDB instead of sequelize

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use('/auth', authRoutes);

// Health check
app.get('/', (req, res) => res.send('User Service OK'));

app.get('/health', async (req, res) => {
  try {
    // Test database connection in health check
    const db = require('./db');
    await db.sequelize.authenticate();
    
    res.json({ 
      status: 'ok', 
      database: 'connected',
      time: new Date().toISOString() 
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'error', 
      database: 'disconnected',
      error: error.message,
      time: new Date().toISOString() 
    });
  }
});

const PORT = process.env.PORT || 4001;

// Start server and connect to DB
app.listen(PORT, async () => {
  console.log(`User Service @ :${PORT}`);
  
  // Initialize database connection
  const dbConnected = await connectDB();
  
  if (!dbConnected) {
    console.error('⚠️  Starting server without database connection');
  }
});