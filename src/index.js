// src/app.js
const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const { sequelize } = require('./db');

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use('/auth', authRoutes);

// health check
app.get('/', (req, res) => res.send('User Service OK'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, async () => {
  console.log(`User Service @ :${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('MySQL connected via Sequelize');
  } catch (e) {
    console.error('MySQL connection error:', e);
  }
});