const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const authRoutes = require('./routes/auth');

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use('/auth', authRoutes);

const MONGO_URI =  'mongodb://10.47.255.255:27017/swram-blog-userdb';
mongoose.connect(MONGO_URI)
  .then(() => console.log('User DB connected'))
  .catch(err => console.error(err));

const PORT = 4001;
app.listen(PORT, () => console.log(`User Service @ :${PORT}`));