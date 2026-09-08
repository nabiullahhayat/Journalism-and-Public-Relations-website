/**
 * Standardized API response utilities
 */

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Success message
 * @param {*} data - Response data
 * @param {Object} meta - Additional metadata (pagination, etc.)
 */
export const sendSuccess = (res, statusCode = 200, message = 'Success', data = null, meta = null) => {
  const response = {
    success: true,
    message,
    data
  };

  if (meta) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Error message
 * @param {Array} errors - Array of error details
 */
export const sendError = (res, statusCode = 500, message = 'Internal server error', errors = null) => {
  const response = {
    success: false,
    message
  };

  if (errors) {
    response.errors = errors;
  }

  if (process.env.NODE_ENV === 'development' && errors) {
    response.stack = errors.stack;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send validation error response
 * @param {Object} res - Express response object
 * @param {Array} errors - Validation errors array
 */
export const sendValidationError = (res, errors) => {
  return sendError(res, 400, 'Validation failed', errors);
};

/**
 * Send not found response
 * @param {Object} res - Express response object
 * @param {String} resource - Resource name
 */
export const sendNotFound = (res, resource = 'Resource') => {
  return sendError(res, 404, `${resource} not found`);
};

/**
 * Send unauthorized response
 * @param {Object} res - Express response object
 * @param {String} message - Custom message
 */
export const sendUnauthorized = (res, message = 'Authentication required') => {
  return sendError(res, 401, message);
};

/**
 * Send forbidden response
 * @param {Object} res - Express response object
 * @param {String} message - Custom message
 */
export const sendForbidden = (res, message = 'Access forbidden') => {
  return sendError(res, 403, message);
};

/**
 * Send created response
 * @param {Object} res - Express response object
 * @param {String} message - Success message
 * @param {*} data - Created resource data
 */
export const sendCreated = (res, message = 'Resource created successfully', data = null) => {
  return sendSuccess(res, 201, message, data);
};

/**
 * Send deleted response
 * @param {Object} res - Express response object
 * @param {String} message - Success message
 */
export const sendDeleted = (res, message = 'Resource deleted successfully') => {
  return sendSuccess(res, 200, message);
};

/**
 * Send updated response
 * @param {Object} res - Express response object
 * @param {String} message - Success message
 * @param {*} data - Updated resource data
 */
export const sendUpdated = (res, message = 'Resource updated successfully', data = null) => {
  return sendSuccess(res, 200, message, data);
};

/**
 * Send paginated response
 * @param {Object} res - Express response object
 * @param {Array} data - Array of items
 * @param {Number} page - Current page
 * @param {Number} limit - Items per page
 * @param {Number} total - Total items count
 * @param {String} message - Success message
 */
export const sendPaginated = (res, data, page, limit, total, message = 'Data retrieved successfully') => {
  const totalPages = Math.ceil(total / limit);
  
  const meta = {
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };

  return sendSuccess(res, 200, message, data, meta);
};

// Alias for backward compatibility
export const sendPaginatedResponse = sendPaginated;

/**
 * Send conflict response
 * @param {Object} res - Express response object
 * @param {String} message - Conflict message
 */
export const sendConflict = (res, message = 'Resource already exists') => {
  return sendError(res, 409, message);
};

/**
 * Send bad request response
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 */
export const sendBadRequest = (res, message = 'Bad request') => {
  return sendError(res, 400, message);
};
