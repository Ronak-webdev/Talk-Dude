import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Critical: Error in connecting to MongoDB", error.message);
    // Removed process.exit(1) to allow better error reporting in frontend
  }
};
