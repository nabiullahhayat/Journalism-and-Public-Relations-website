import jwt from 'jsonwebtoken';
import crypto from 'crypto';

/**
 * Generate access token
 * @param {Object} payload - Token payload (id, email, role)
 * @returns {String} JWT access token
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
  );
};

/**
 * Generate refresh token
 * @param {Object} payload - Token payload (id)
 * @returns {String} JWT refresh token
 */
export const generateRefreshToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
};

/**
 * Verify access token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

// Alias for backward compatibility
export const verifyToken = verifyAccessToken;

/**
 * Verify refresh token
 * @param {String} token - JWT refresh token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

/**
 * Decode token without verification
 * @param {String} token - JWT token to decode
 * @returns {Object|null} Decoded token payload or null
 */
export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

/**
 * Generate secure random token
 * @param {Number} length - Token length in bytes (default: 32)
 * @returns {String} Secure random token in hex format
 */
export const generateSecureToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Check if token is expired
 * @param {String} token - JWT token to check
 * @returns {Boolean} True if token is expired
 */
export const isTokenExpired = (token) => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  } catch (error) {
    return true;
  }
};

/**
 * Extract token from authorization header
 * @param {String} authHeader - Authorization header value
 * @returns {String|null} Token or null if not found
 */
export const extractTokenFromHeader = (authHeader) => {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    return parts[1];
  }
  
  return null;
};

/**
 * Generate both access and refresh tokens
 * @param {Object} user - User object with id, email, role
 * @returns {Object} Object containing access and refresh tokens
 */
export const generateTokenPair = (user) => {
  const accessToken = generateAccessToken({
    id: user._id || user.id,
    email: user.email,
    role: user.role
  });

  const refreshToken = generateRefreshToken({
    id: user._id || user.id
  });

  return { accessToken, refreshToken };
};
