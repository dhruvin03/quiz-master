const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connectionString = process.env.DB_CONN.replace(
      '<db_password>',
      process.env.DB_PASSWORD
    );

    await mongoose.connect(connectionString);

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;