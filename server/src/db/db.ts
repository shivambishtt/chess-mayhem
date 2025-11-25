import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URL as string);
    console.log("MONGODB connected successfully");
    
  } catch (error) {
    console.log("Error occured connecting to MONGO DB", error);
    process.exit(1); 
  }
};
