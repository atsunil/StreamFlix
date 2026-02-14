require('dotenv').config(); // load .env early

const mongoose = require('mongoose');

const uri = process.env.DATABASE_URL || process.env.MONGO_URI;

if (!uri) {
  throw new Error('Missing DATABASE_URL / MONGO_URI in environment. Set it in backend/.env');
}

module.exports = async function connectDB() {
  return mongoose.connect(uri);
};