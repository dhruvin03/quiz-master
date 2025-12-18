/*
* Connect to MongoDB using mongoose.
* Use process.env.DB_CONN and process.env.DB_PASSWORD for connecting with mongodb database.
* Replace <db_password> with process.env.DB_PASSWORD in the connection string.
* Log success and error messages to the console.
* Export the connectDB function.
*/

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