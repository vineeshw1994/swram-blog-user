// src/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.MYSQL_DB,      // e.g. blogdb
  process.env.MYSQL_USER,    // e.g. bloguser
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,   // "mysql" (service name in swarm)
    dialect: 'mysql',
    logging: true,                 // set true if you want SQL logs
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
  }
);

// Import models
const User = require('./models/User')(sequelize);

// Sync (creates table if missing – use only in dev or with migrations in prod)
sequelize.sync({ alter: true }).catch((err) => console.error('Sequelize sync error:', err));

module.exports = { sequelize, User };