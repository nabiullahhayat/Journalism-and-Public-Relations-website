/**
 * Cookie utility functions for secure cookie management
 */

/**
 * Set authentication cookies (access and refresh tokens)
 * @param {Object} res - Express response object
 * @param {String} accessToken - JWT access token
 * @param {String} refreshToken - JWT refresh token
 */
export const setAuthCookies = (res, accessToken, refreshToken) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Set access token cookie
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 minutes
    path: '/'
  });

  // Set refresh token cookie
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/'
  });
};

/**
 * Clear authentication cookies
 * @param {Object} res - Express response object
 */
export const clearAuthCookies = (res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.clearCookie('access_token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    path: '/'
  });

  res.clearCookie('refresh_token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    path: '/'
  });
};

/**
 * Get cookies from request
 * @param {Object} req - Express request object
 * @returns {Object} Cookies object
 */
export const getCookies = (req) => {
  return req.cookies || {};
};

/**
 * Get specific cookie
 * @param {Object} req - Express request object
 * @param {String} name - Cookie name
 * @returns {String|undefined} Cookie value
 */
export const getCookie = (req, name) => {
  return req.cookies?.[name];
};

/**
 * Set custom cookie
 * @param {Object} res - Express response object
 * @param {String} name - Cookie name
 * @param {String} value - Cookie value
 * @param {Object} options - Cookie options
 */
export const setCookie = (res, name, value, options = {}) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  const defaultOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours by default
    path: '/'
  };

  res.cookie(name, value, { ...defaultOptions, ...options });
};

/**
 * Clear specific cookie
 * @param {Object} res - Express response object
 * @param {String} name - Cookie name
 * @param {Object} options - Cookie options
 */
export const clearCookie = (res, name, options = {}) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.clearCookie(name, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    path: '/',
    ...options
  });
};

/**
 * Check if cookies are enabled
 * @param {Object} req - Express request object
 * @returns {Boolean} True if cookies are available
 */
export const areCookiesEnabled = (req) => {
  return req.cookies && Object.keys(req.cookies).length > 0;
};

/**
 * Set session cookie
 * @param {Object} res - Express response object
 * @param {String} name - Cookie name
 * @param {String} value - Cookie value
 */
export const setSessionCookie = (res, name, value) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.cookie(name, value, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    path: '/'
    // No maxAge - session cookie
  });
};
