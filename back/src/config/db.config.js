import mongoose from 'mongoose';
import { logInfo, logError } from '../utils/logger.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/journalism_faculty';

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  try {
    mongoose.set('strictQuery', true);
    const conn = await mongoose.connect(MONGODB_URI);
    logInfo(`✅ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    logError(`❌ MongoDB connection failed: ${error.message}`);
    throw error;
  }
};

export const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};

export default connectDB;
