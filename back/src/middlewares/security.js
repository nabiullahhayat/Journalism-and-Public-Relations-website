import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';

/**
 * Configure Helmet for security headers
 * Helmet helps secure Express apps by setting various HTTP headers
 */
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
});

/**
 * Configure CORS (Cross-Origin Resource Sharing)
 * Allows controlled access from specified origins
 */
export const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = process.env.CLIENT_URL 
      ? process.env.CLIENT_URL.split(',').map(url => url.trim())
      : ['http://localhost:3000', 'http://localhost:5173'];
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['X-Total-Count', 'X-Page', 'X-Limit'],
  maxAge: 86400 // 24 hours
};

export const corsMiddleware = cors(corsOptions);

/**
 * Rate limiting configurations
 */

// General API rate limiter - 100 requests per 15 minutes
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for certain IPs (optional)
  skip: (req) => {
    const skipIPs = process.env.RATE_LIMIT_SKIP_IPS?.split(',') || [];
    return skipIPs.includes(req.ip);
  }
});

// Strict rate limiter for authentication routes - 5 requests per 15 minutes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    message: 'Too many login attempts, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true // Don't count successful requests
});

// Create account rate limiter - 3 accounts per hour per IP
export const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    success: false,
    message: 'Too many accounts created from this IP, please try again after an hour'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Password reset rate limiter - 3 requests per hour
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    success: false,
    message: 'Too many password reset requests, please try again after an hour'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// File upload rate limiter - 10 uploads per hour
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    success: false,
    message: 'Too many file uploads, please try again after an hour'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// API read rate limiter (for public endpoints) - 300 requests per 15 minutes
export const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Input sanitization (replaces mongo-sanitize — strips $ and . from keys)
 */
export const sanitizeMiddleware = (req, res, next) => {
  const sanitize = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    Object.keys(obj).forEach(key => {
      if (/^\$|\./.test(key)) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        sanitize(obj[key]);
      }
    });
  };
  sanitize(req.body);
  sanitize(req.query);
  sanitize(req.params);
  next();
};

/**
 * XSS (Cross-Site Scripting) protection
 * Sanitizes user input to prevent XSS attacks
 */
export const xssMiddleware = xss();

/**
 * HTTP Parameter Pollution (HPP) protection
 * Custom implementation to prevent parameter pollution attacks
 * Ensures only the last value is used for duplicate parameters
 */
export const hppMiddleware = (req, res, next) => {
  // Whitelist: parameters that are allowed to be arrays
  const whitelist = [
    'sort',
    'fields',
    'page',
    'limit',
    'search',
    'filter',
    'category',
    'status',
    'tags',
    'departments',
    'academicRank'
  ];
  
  // Process query parameters
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      // If parameter is not in whitelist and is an array, use only the last value
      if (!whitelist.includes(key) && Array.isArray(req.query[key])) {
        req.query[key] = req.query[key][req.query[key].length - 1];
      }
    });
  }
  
  // Process body parameters
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      // If parameter is not in whitelist and is an array, use only the last value
      if (!whitelist.includes(key) && Array.isArray(req.body[key])) {
        req.body[key] = req.body[key][req.body[key].length - 1];
      }
    });
  }
  
  next();
};

/**
 * Security headers middleware
 * Additional custom security headers
 */
export const securityHeaders = (req, res, next) => {
  // Remove X-Powered-By header (already done by helmet, but added for redundancy)
  res.removeHeader('X-Powered-By');
  
  // Add custom security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Download-Options', 'noopen');
  
  // Prevent clickjacking
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  
  next();
};

/**
 * Trust proxy configuration
 * For apps behind a reverse proxy (nginx, Apache, etc.)
 */
export const configureTrustProxy = (app) => {
  const trustProxy = process.env.TRUST_PROXY || 'false';
  
  if (trustProxy === 'true') {
    app.set('trust proxy', 1);
    console.log('✅ Trust proxy enabled');
  } else if (trustProxy !== 'false') {
    app.set('trust proxy', trustProxy);
    console.log(`✅ Trust proxy configured: ${trustProxy}`);
  }
};

/**
 * API key validation middleware (optional)
 * For additional security on specific routes
 */
export const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const validApiKey = process.env.API_KEY;
  
  // Skip if no API key is configured
  if (!validApiKey) {
    return next();
  }
  
  if (!apiKey || apiKey !== validApiKey) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or missing API key'
    });
  }
  
  next();
};

/**
 * Content-Type validation middleware
 * Ensures requests with body have proper Content-Type
 */
export const validateContentType = (req, res, next) => {
  // Only check POST, PUT, PATCH requests
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.headers['content-type'];
    
    // Allow multipart/form-data for file uploads
    if (contentType && contentType.includes('multipart/form-data')) {
      return next();
    }
    
    // Require application/json for other requests
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(415).json({
        success: false,
        message: 'Content-Type must be application/json'
      });
    }
  }
  
  next();
};

/**
 * Request sanitization middleware
 * Additional sanitization for request data
 */
export const sanitizeRequest = (req, res, next) => {
  // Sanitize query parameters
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = req.query[key].trim();
      }
    });
  }
  
  // Sanitize body parameters
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }
  
  next();
};

/**
 * All security middleware combined
 * Use this to apply all security measures at once
 */
export const applySecurityMiddleware = (app) => {
  configureTrustProxy(app);
  app.use(helmetMiddleware);
  app.use(corsMiddleware);
  // sanitizeMiddleware, xssMiddleware, hppMiddleware removed — applied after body parsing in server.js
  app.use(securityHeaders);
  console.log('✅ All security middleware applied');
};

/**
 * Export all security middleware
 */
export default {
  helmetMiddleware,
  corsMiddleware,
  corsOptions,
  generalLimiter,
  authLimiter,
  createAccountLimiter,
  passwordResetLimiter,
  uploadLimiter,
  publicLimiter,
  sanitizeMiddleware,
  xssMiddleware,
  hppMiddleware,
  securityHeaders,
  configureTrustProxy,
  validateApiKey,
  validateContentType,
  sanitizeRequest,
  applySecurityMiddleware
};
