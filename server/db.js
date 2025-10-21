// server/db.js
const mongoose = require('mongoose');

async function connectDB(uri) {
  if (!uri) {
    console.warn('⚠️  MONGO_URI missing, skip DB connection.');
    return;
  }
  try {
    const conn = await mongoose.connect(uri);
    console.log('✅ MongoDB connected:', conn.connection.host);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
}

module.exports = { connectDB, mongoose };