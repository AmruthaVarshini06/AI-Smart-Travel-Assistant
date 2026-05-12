import mongoose from "mongoose";

let lastConnectionError = null;

const timeoutAfter = (ms) =>
  new Promise((_, reject) => {
    setTimeout(() => {
      reject(
        new Error(`MongoDB connection timed out after ${ms / 1000} seconds`)
      );
    }, ms);
  });

const connectDB = async () => {

  try {
    const mongoUri =
      process.env.MONGO_URI ||
      process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error(
        "Missing MONGO_URI. Add your MongoDB connection string to .env."
      );
    }

    const options = {
      serverSelectionTimeoutMS: 10000,
      ...(process.env.MONGO_DB_NAME
        ? { dbName: process.env.MONGO_DB_NAME }
        : {})
    };

    await Promise.race(
      [
        mongoose.connect(
          mongoUri,
          options
        ),
        timeoutAfter(12000)
      ]
    );

    lastConnectionError = null;

    console.log(
      `MongoDB Connected: ${mongoose.connection.name}`
    );

    return true;

  } catch (error) {
    lastConnectionError =
      error.message;

    console.log(
      "MongoDB Error:",
      error.message
    );

    return false;
  }
};

export const getDBStatus = () => ({
  connected:
    mongoose.connection.readyState === 1,
  name:
    mongoose.connection.name || null,
  host:
    mongoose.connection.host || null,
  readyState:
    mongoose.connection.readyState,
  error:
    lastConnectionError
});

export default connectDB;
