import { validationResult } from 'express-validator';
import { sendError } from '../utils/response.js';

/**
 * Validate request and send errors if any
 * This middleware should be used after express-validator validation chains
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const extractedErrors = [];
    const errorMap = {};
    
    errors.array().forEach(err => {
      // Group errors by field
      if (!errorMap[err.path || err.param]) {
        errorMap[err.path || err.param] = [];
      }
      errorMap[err.path || err.param].push(err.msg);
      
      extractedErrors.push({
        field: err.path || err.param,
        message: err.msg,
        value: err.value
      });
    });
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: extractedErrors,
      errorsByField: errorMap
    });
  }
  
  next();
};

/**
 * Sanitize and validate pagination parameters
 */
export const validatePagination = (req, res, next) => {
  // Default pagination values  
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  // Validate pagination values
  if (page < 1) {
    return sendError(res, 400, 'Page number must be greater than 0');
  }
  
  if (limit < 1) {
    return sendError(res, 400, 'Limit must be greater than 0');
  }
  
  if (limit > 100) {
    return sendError(res, 400, 'Limit cannot exceed 100');
  }
  
  // Attach pagination to request (don't modify req.query directly)
  req.pagination = {
    page,
    limit,
    skip
  };
  
  next();
};

/**
 * Validate integer ID parameter (Prisma/SQLite uses integer IDs)
 */
export const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];

    if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
      return sendError(res, 400, `Invalid ${paramName} format`);
    }

    // Coerce to integer so controllers can use it directly
    req.params[paramName] = String(parseInt(id));
    next();
  };
};

/**
 * Validate array of integer IDs
 */
export const validateObjectIdArray = (fieldName) => {
  return (req, res, next) => {
    const ids = req.body[fieldName];

    if (!ids || !Array.isArray(ids)) {
      return sendError(res, 400, `${fieldName} must be an array`);
    }

    const invalidIds = ids.filter(id => isNaN(parseInt(id)) || parseInt(id) <= 0);
    if (invalidIds.length > 0) {
      return sendError(res, 400, `Invalid ID format in ${fieldName}`);
    }

    next();
  };
};

/**
 * Validate sort parameters
 */
export const validateSort = (req, res, next) => {
  const { sort } = req.query;
  
  if (!sort) {
    req.sort = { createdAt: -1 }; // Default sort
    return next();
  }
  
  const sortObj = {};
  const sortFields = sort.split(',');
  
  sortFields.forEach(field => {
    if (field.startsWith('-')) {
      sortObj[field.substring(1)] = -1; // Descending
    } else {
      sortObj[field] = 1; // Ascending
    }
  });
  
  req.sort = sortObj;
  next();
};

/**
 * Validate select/fields parameters
 */
export const validateFields = (req, res, next) => {
  const { fields, select } = req.query;
  const selectedFields = fields || select;
  
  if (!selectedFields) {
    req.fields = null;
    return next();
  }
  
  // Convert comma-separated string to space-separated (Mongoose format)
  req.fields = selectedFields.split(',').join(' ');
  
  next();
};

/**
 * Validate search parameters
 */
export const validateSearch = (allowedFields = []) => {
  return (req, res, next) => {
    const { search, searchField } = req.query;
    
    if (!search) {
      req.search = null;
      return next();
    }
    
    // If searchField is specified, validate it
    if (searchField && allowedFields.length > 0) {
      if (!allowedFields.includes(searchField)) {
        return sendError(
          res,
          400,
          `Search field must be one of: ${allowedFields.join(', ')}`
        );
      }
    }
    
    req.search = {
      query: search,
      field: searchField || allowedFields[0] || 'name'
    };
    
    next();
  };
};

/**
 * Validate filter parameters
 */
export const validateFilter = (allowedFilters = []) => {
  return (req, res, next) => {
    const filters = {};
    
    Object.keys(req.query).forEach(key => {
      // Skip pagination, sort, search, and field selection parameters
      if (['page', 'limit', 'sort', 'search', 'searchField', 'fields', 'select'].includes(key)) {
        return;
      }
      
      // If allowedFilters is specified, only allow those filters
      if (allowedFilters.length > 0 && !allowedFilters.includes(key)) {
        return;
      }
      
      filters[key] = req.query[key];
    });
    
    req.filters = filters;
    next();
  };
};

/**
 * Validate date range parameters
 */
export const validateDateRange = (req, res, next) => {
  const { startDate, endDate } = req.query;
  
  if (startDate && isNaN(Date.parse(startDate))) {
    return sendError(res, 'Invalid start date format', 400);
  }
  
  if (endDate && isNaN(Date.parse(endDate))) {
    return sendError(res, 'Invalid end date format', 400);
  }
  
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      return sendError(res, 'Start date must be before end date', 400);
    }
  }
  
  req.dateRange = {
    startDate: startDate ? new Date(startDate) : null,
    endDate: endDate ? new Date(endDate) : null
  };
  
  next();
};

/**
 * Validate file upload
 */
export const validateFileUpload = (req, res, next) => {
  if (!req.file && !req.files) {
    return sendError(res, 'No file uploaded', 400);
  }
  
  next();
};

/**
 * Validate optional file upload
 */
export const validateOptionalFileUpload = (req, res, next) => {
  // Just pass through - file upload is optional
  next();
};

/**
 * Sanitize HTML content to prevent XSS
 * This is a basic implementation - consider using a library like DOMPurify for production
 */
export const sanitizeHtml = (fields = []) => {
  return (req, res, next) => {
    fields.forEach(field => {
      if (req.body[field]) {
        // Remove script tags and event handlers
        req.body[field] = req.body[field]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/on\w+="[^"]*"/gi, '')
          .replace(/on\w+='[^']*'/gi, '');
      }
    });
    
    next();
  };
};

/**
 * Validate enum values
 */
export const validateEnum = (field, allowedValues) => {
  return (req, res, next) => {
    const value = req.body[field];
    
    if (value && !allowedValues.includes(value)) {
      return sendError(
        res,
        400,
        `${field} must be one of: ${allowedValues.join(', ')}`
      );
    }
    
    next();
  };
};

/**
 * Validate required fields
 */
export const validateRequired = (fields = []) => {
  return (req, res, next) => {
    const missingFields = [];
    
    fields.forEach(field => {
      if (!req.body[field] && req.body[field] !== 0 && req.body[field] !== false) {
        missingFields.push(field);
      }
    });
    
    if (missingFields.length > 0) {
      return sendError(
        res,
        400,
        `Missing required fields: ${missingFields.join(', ')}`
      );
    }
    
    next();
  };
};

/**
 * Validate URL format
 */
export const validateUrl = (fields = []) => {
  return (req, res, next) => {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    
    const invalidFields = [];
    
    fields.forEach(field => {
      const value = req.body[field];
      if (value && !urlPattern.test(value)) {
        invalidFields.push(field);
      }
    });
    
    if (invalidFields.length > 0) {
      return sendError(
        res,
        400,
        `Invalid URL format in fields: ${invalidFields.join(', ')}`
      );
    }
    
    next();
  };
};

/**
 * Validate email format
 */
export const validateEmail = (field = 'email') => {
  return (req, res, next) => {
    const email = req.body[field];
    
    if (!email) {
      return next();
    }
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailPattern.test(email)) {
      return sendError(res, 'Invalid email format', 400);
    }
    
    next();
  };
};

/**
 * Validate phone number format
 */
export const validatePhone = (field = 'phone') => {
  return (req, res, next) => {
    const phone = req.body[field];
    
    if (!phone) {
      return next();
    }
    
    // Basic phone validation - adjust pattern based on your requirements
    const phonePattern = /^[\d\s\-\+\(\)]+$/;
    
    if (!phonePattern.test(phone) || phone.length < 10) {
      return sendError(res, 'Invalid phone number format', 400);
    }
    
    next();
  };
};

/**
 * Trim string fields
 */
export const trimFields = (fields = []) => {
  return (req, res, next) => {
    fields.forEach(field => {
      if (req.body[field] && typeof req.body[field] === 'string') {
        req.body[field] = req.body[field].trim();
      }
    });
    
    next();
  };
};

/**
 * Convert string to lowercase
 */
export const toLowercase = (fields = []) => {
  return (req, res, next) => {
    fields.forEach(field => {
      if (req.body[field] && typeof req.body[field] === 'string') {
        req.body[field] = req.body[field].toLowerCase();
      }
    });
    
    next();
  };
};

/**
 * Validate password strength
 */
export const validatePasswordStrength = (field = 'password') => {
  return (req, res, next) => {
    const password = req.body[field];
    
    if (!password) {
      return next();
    }
    
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[@$!%*?&#]/.test(password)) {
      errors.push('Password must contain at least one special character (@$!%*?&#)');
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Password does not meet requirements',
        errors
      });
    }
    
    next();
  };
};

/**
 * Export all validation middleware
 */
export default {
  validate,
  validatePagination,
  validateObjectId,
  validateObjectIdArray,
  validateSort,
  validateFields,
  validateSearch,
  validateFilter,
  validateDateRange,
  validateFileUpload,
  validateOptionalFileUpload,
  sanitizeHtml,
  validateEnum,
  validateRequired,
  validateUrl,
  validateEmail,
  validatePhone,
  trimFields,
  toLowercase,
  validatePasswordStrength
};
