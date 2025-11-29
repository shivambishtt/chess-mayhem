import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

export const connectDB = async () => {
  try {
    if (!MONGODB_URL) {
      throw new Error("MONGODB_URL is not defined in env variables");
    }
    await mongoose.connect(MONGODB_URL);
  } catch (error) {
    console.log("Error occured connecting to MONGO DB", error);
    process.exit(1);
  }
};
