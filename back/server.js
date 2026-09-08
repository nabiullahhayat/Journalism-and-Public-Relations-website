import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

import { connectDB } from './src/config/db.config.js';
import './src/models/index.js';
import apiRoutes from './src/routes/index.js';
import { applySecurityMiddleware, sanitizeMiddleware, hppMiddleware, sanitizeRequest } from './src/middlewares/security.js';
import errorHandler, {
  notFound,
  handleUncaughtException,
  handleUnhandledRejection,
  handleSIGTERM,
} from './src/middlewares/errorHandler.js';
import { logInfo, logError } from './src/utils/logger.js';
import { UPLOADS_ROOT } from './src/utils/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

handleUncaughtException();

const app = express();

if (process.env.TRUST_PROXY === 'true') app.set('trust proxy', 1);

applySecurityMiddleware(app);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(sanitizeMiddleware);
app.use(hppMiddleware);
app.use(sanitizeRequest);
app.use(process.env.NODE_ENV === 'development' ? morgan('dev') : morgan('combined'));

// Serve uploaded images from local folders
app.use('/uploads', express.static(UPLOADS_ROOT));

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Faculty Management System API',
    version: '1.0.0',
    database: 'MongoDB',
  });
});

app.use('/api/v1', apiRoutes);
app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 3000;
    const server = app.listen(PORT, () => {
      logInfo(`🚀 Server is running on port ${PORT}`);
      logInfo(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      logInfo(`📍 API URL: http://localhost:${PORT}/api/v1`);
      logInfo(`💓 Health Check: http://localhost:${PORT}/api/v1/health`);
    });

    handleUnhandledRejection(server);
    handleSIGTERM(server);
  } catch (error) {
    logError(`❌ Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
export default app;
