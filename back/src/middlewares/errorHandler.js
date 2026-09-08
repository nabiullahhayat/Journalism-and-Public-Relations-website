import { logError } from '../utils/logger.js';

/**
 * Custom Error Class for operational errors
 */
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle MongoDB Cast Error (Invalid ObjectId)
 */
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

/**
 * Handle MongoDB Duplicate Key Error
 */
const handleDuplicateFieldsDB = (err) => {
  // Extract field name and value from error message
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `Duplicate field value: ${field} = '${value}'. Please use another value.`;
  return new AppError(message, 400);
};

/**
 * Handle MongoDB Validation Error
 */
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

/**
 * Handle JWT Error
 */
const handleJWTError = () => 
  new AppError('Invalid token. Please log in again.', 401);

/**
 * Handle JWT Expired Error
 */
const handleJWTExpiredError = () => 
  new AppError('Your token has expired. Please log in again.', 401);

/**
 * Handle Multer File Size Error
 */
const handleMulterFileSizeError = () =>
  new AppError('File too large. Maximum file size is 5MB.', 400);

/**
 * Handle Multer File Type Error
 */
const handleMulterFileTypeError = () =>
  new AppError('Invalid file type. Please upload a valid file.', 400);

/**
 * Send error response in development
 */
const sendErrorDev = (err, req, res) => {
  // API Error
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }
  
  // Non-API Error
  console.error('ERROR 💥:', err);
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
    error: err,
    stack: err.stack
  });
};

/**
 * Send error response in production
 */
const sendErrorProd = (err, req, res) => {
  // API Error
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        success: false,
        status: err.status,
        message: err.message
      });
    }
    
    // Programming or unknown error: don't leak error details
    console.error('ERROR 💥:', err);
    return res.status(500).json({
      success: false,
      status: 'error',
      message: 'Something went wrong. Please try again later.'
    });
  }
  
  // Non-API Error
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }
  
  console.error('ERROR 💥:', err);
  return res.status(500).json({
    success: false,
    message: 'Something went wrong. Please try again later.'
  });
};

/**
 * Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error
  logError(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    // Handle specific MongoDB errors
    if (err.name === 'CastError') error = handleCastErrorDB(err);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
    
    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
    
    // Handle Multer errors
    if (err.code === 'LIMIT_FILE_SIZE') error = handleMulterFileSizeError();
    if (err.code === 'LIMIT_UNEXPECTED_FILE') error = handleMulterFileTypeError();

    sendErrorProd(error, req, res);
  }
};

/**
 * Handle 404 Not Found errors
 */
export const notFound = (req, res, next) => {
  const message = `Cannot find ${req.originalUrl} on this server`;
  const err = new AppError(message, 404);
  next(err);
};

/**
 * Handle unhandled promise rejections
 */
export const handleUnhandledRejection = (server) => {
  process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    logError(`Unhandled Rejection: ${err.message}`);
    
    // Close server gracefully
    server.close(() => {
      process.exit(1);
    });
  });
};

/**
 * Handle uncaught exceptions
 */
export const handleUncaughtException = () => {
  process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    logError(`Uncaught Exception: ${err.message}`);
    
    // Exit immediately on uncaught exception
    process.exit(1);
  });
};

/**
 * Handle SIGTERM signal (Graceful shutdown)
 */
export const handleSIGTERM = (server) => {
  process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully...');
    
    server.close(() => {
      console.log('💥 Process terminated!');
    });
  });
};

/**
 * Async error wrapper for route handlers
 * Automatically catches async errors and passes them to error handler
 */
export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

/**
 * Create and throw operational error
 */
export const throwError = (message, statusCode = 500) => {
  throw new AppError(message, statusCode);
};

/**
 * Validation error handler
 */
export const handleValidationError = (errors) => {
  const messages = errors.map(err => err.msg || err.message).join(', ');
  return new AppError(`Validation Error: ${messages}`, 400);
};

/**
 * Database connection error handler
 */
export const handleDBConnectionError = (err) => {
  console.error('DATABASE CONNECTION ERROR! 💥');
  console.error(err);
  logError(`Database Connection Error: ${err.message}`);
  
  if (process.env.NODE_ENV === 'production') {
    console.log('Retrying connection in 5 seconds...');
    // You can implement retry logic here
  } else {
    process.exit(1);
  }
};

/**
 * Rate limit error handler
 */
export const handleRateLimitError = (req, res) => {
  return res.status(429).json({
    success: false,
    message: 'Too many requests from this IP. Please try again later.',
    retryAfter: req.rateLimit?.resetTime || '15 minutes'
  });
};

/**
 * CORS error handler
 */
export const handleCORSError = (err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS policy: Access denied from this origin',
      origin: req.headers.origin
    });
  }
  next(err);
};

/**
 * File upload error handler
 */
export const handleFileUploadError = (err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File too large. Maximum file size is 5MB.'
    });
  }
  
  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      success: false,
      message: 'Too many files. Maximum is 5 files.'
    });
  }
  
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'Unexpected field name in file upload.'
    });
  }
  
  if (err.message && err.message.includes('file')) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  next(err);
};

/**
 * MongoDB duplicate key error helper
 */
export const isDuplicateKeyError = (err) => {
  return err.code === 11000 || err.code === 11001;
};

/**
 * Check if error is operational
 */
export const isOperationalError = (err) => {
  return err.isOperational || false;
};

/**
 * Format error for logging
 */
export const formatErrorForLog = (err) => {
  return {
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode,
    status: err.status,
    isOperational: err.isOperational,
    timestamp: new Date().toISOString()
  };
};

/**
 * Send validation error response
 */
export const sendValidationError = (res, errors) => {
  return res.status(400).json({
    success: false,
    message: 'Validation failed',
    errors: Array.isArray(errors) ? errors : [errors]
  });
};

/**
 * Send not found error response
 */
export const sendNotFoundError = (res, resource = 'Resource') => {
  return res.status(404).json({
    success: false,
    message: `${resource} not found`
  });
};

/**
 * Send unauthorized error response
 */
export const sendUnauthorizedError = (res, message = 'Unauthorized access') => {
  return res.status(401).json({
    success: false,
    message
  });
};

/**
 * Send forbidden error response
 */
export const sendForbiddenError = (res, message = 'Access forbidden') => {
  return res.status(403).json({
    success: false,
    message
  });
};

/**
 * Send server error response
 */
export const sendServerError = (res, message = 'Internal server error') => {
  return res.status(500).json({
    success: false,
    message
  });
};

/**
 * Export error handler and utilities
 */
export default errorHandler;
