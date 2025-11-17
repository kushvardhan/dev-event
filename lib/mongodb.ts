import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI not found in .env file");
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);

    isConnected = db.connection.readyState === 1;

    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.log("MongoDB Connection Error => ", err);
    throw err;
  }
};

export default connectDB;
