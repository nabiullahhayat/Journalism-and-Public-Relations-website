import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/journalism_faculty',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};
