/**
 * Simple logger utility for development and production
 */

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

/**
 * Get formatted timestamp
 * @returns {String} Formatted timestamp
 */
const getTimestamp = () => {
  return new Date().toISOString();
};

/**
 * Log info message
 * @param {String} message - Log message
 * @param {Object} meta - Additional metadata
 */
export const info = (message, meta = {}) => {
  const timestamp = getTimestamp();
  console.log(
    `${colors.blue}[INFO]${colors.reset} ${timestamp} - ${message}`,
    Object.keys(meta).length > 0 ? meta : ''
  );
};

/**
 * Log success message
 * @param {String} message - Log message
 * @param {Object} meta - Additional metadata
 */
export const success = (message, meta = {}) => {
  const timestamp = getTimestamp();
  console.log(
    `${colors.green}[SUCCESS]${colors.reset} ${timestamp} - ${message}`,
    Object.keys(meta).length > 0 ? meta : ''
  );
};

/**
 * Log warning message
 * @param {String} message - Log message
 * @param {Object} meta - Additional metadata
 */
export const warn = (message, meta = {}) => {
  const timestamp = getTimestamp();
  console.warn(
    `${colors.yellow}[WARN]${colors.reset} ${timestamp} - ${message}`,
    Object.keys(meta).length > 0 ? meta : ''
  );
};

/**
 * Log error message
 * @param {String} message - Log message
 * @param {Error} error - Error object
 */
export const error = (message, err = null) => {
  const timestamp = getTimestamp();
  console.error(
    `${colors.red}[ERROR]${colors.reset} ${timestamp} - ${message}`
  );
  
  if (err) {
    console.error(`${colors.red}Stack:${colors.reset}`, err.stack || err);
  }
};

/**
 * Log debug message (only in development)
 * @param {String} message - Log message
 * @param {Object} meta - Additional metadata
 */
export const debug = (message, meta = {}) => {
  if (process.env.NODE_ENV !== 'production') {
    const timestamp = getTimestamp();
    console.log(
      `${colors.magenta}[DEBUG]${colors.reset} ${timestamp} - ${message}`,
      Object.keys(meta).length > 0 ? meta : ''
    );
  }
};

/**
 * Log HTTP request
 * @param {Object} req - Express request object
 */
export const request = (req) => {
  const timestamp = getTimestamp();
  const method = req.method;
  const url = req.originalUrl || req.url;
  const ip = req.ip || req.connection.remoteAddress;
  
  console.log(
    `${colors.cyan}[REQUEST]${colors.reset} ${timestamp} - ${method} ${url} from ${ip}`
  );
};

/**
 * Log database query
 * @param {String} model - Model name
 * @param {String} operation - Operation type
 * @param {Object} query - Query object
 */
export const query = (model, operation, queryObj = {}) => {
  if (process.env.NODE_ENV !== 'production') {
    const timestamp = getTimestamp();
    console.log(
      `${colors.blue}[DB QUERY]${colors.reset} ${timestamp} - ${model}.${operation}`,
      Object.keys(queryObj).length > 0 ? queryObj : ''
    );
  }
};

// Aliases for convenience
export const logInfo = info;
export const logSuccess = success;
export const logWarning = warn;
export const logError = error;
export const logDebug = debug;

export default {
  info,
  success,
  warn,
  error,
  debug,
  request,
  query,
  logInfo,
  logSuccess,
  logWarning,
  logError,
  logDebug
};
