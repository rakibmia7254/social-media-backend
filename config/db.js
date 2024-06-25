const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('MONGO_DB_URL');
    console.log('MongoDB connected');
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
