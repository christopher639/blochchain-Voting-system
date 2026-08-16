const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.databaseName;
  if (!uri) {
    console.error('MONGODB_URI not set in environment');
    process.exit(1);
  }
  try {
    await mongoose.connect(uri, { dbName, useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`MongoDB connected to ${dbName || 'default database'}`);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
