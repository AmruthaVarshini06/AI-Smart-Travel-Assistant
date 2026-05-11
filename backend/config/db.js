import mongoose from "mongoose";

const connectDB = async () => {
<<<<<<< HEAD
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri || typeof mongoUri !== 'string') {
    console.error('Error: MONGO_URI is not set in backend/.env');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
=======

  try {

    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "MongoDB Connected"
    );

>>>>>>> origin/main
  } catch (error) {

    console.log(
      "MongoDB Error:",
      error.message
    );

    process.exit(1);
  }
};

export default connectDB;