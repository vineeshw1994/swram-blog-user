// src/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.MYSQL_DB || 'blogdb',
  process.env.MYSQL_USER || 'bloguser',
  process.env.MYSQL_PASSWORD || 'UserPass123!',
  {
    host: process.env.MYSQL_HOST || 'mysql',
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development',
    pool: { 
      max: 5, 
      min: 0, 
      acquire: 30000, 
      idle: 10000 
    },
    retry: {
      max: 3,
    }
  }
);

// Import models
const User = require('./models/User')(sequelize);

// Database connection with retry logic
const connectDB = async (retries = 5, delay = 5000) => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL connected via Sequelize');
    
    // Safe sync only in development or if explicitly enabled
    if (process.env.NODE_ENV === 'development' || process.env.DB_SYNC === 'true') {
      await sequelize.sync({ alter: process.env.DB_SYNC === 'alter' });
      console.log('✅ Database sync completed');
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Database connection failed (${retries} retries left):`, error.message);
    
    if (retries > 0) {
      console.log(`🔄 Retrying in ${delay/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return connectDB(retries - 1, delay);
    } else {
      console.error('💥 All database connection retries failed');
      return false;
    }
  }
};

// Export connect function for app.js to use
module.exports = { sequelize, User, connectDB };