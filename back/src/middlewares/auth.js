import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendError } from '../utils/response.js';
import Admin from '../models/Admin.js';
import { toPlain } from '../utils/mongo.js';

export const verifyToken = asyncHandler(async (req, res, next) => {
  let token;
  if (req.cookies?.accessToken) token = req.cookies.accessToken;
  else if (req.headers.authorization?.startsWith('Bearer ')) token = req.headers.authorization.split(' ')[1];

  if (!token) return sendError(res, 401, 'Authentication required. Please login.');

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await Admin.findById(decoded.id).select('username email fullName role isActive departmentId');
    if (!user) return sendError(res, 401, 'User not found. Please login again.');
    if (!user.isActive) return sendError(res, 403, 'Account deactivated. Contact administrator.');
    req.user = toPlain(user);
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') return sendError(res, 401, 'Token has expired. Please login again.');
    if (err.name === 'JsonWebTokenError') return sendError(res, 401, 'Invalid token. Please login again.');
    return sendError(res, 401, 'Authentication failed.');
  }
});

export const verifyRefreshToken = asyncHandler(async (req, res, next) => {
  let token;
  if (req.cookies?.refreshToken) token = req.cookies.refreshToken;
  else if (req.body?.refreshToken) token = req.body.refreshToken;

  if (!token) return sendError(res, 401, 'Refresh token required.');

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await Admin.findById(decoded.id).select('+refreshToken');

    if (!user) return sendError(res, 401, 'User not found.');
    if (user.refreshToken !== token) return sendError(res, 401, 'Invalid refresh token.');
    if (!user.isActive) return sendError(res, 403, 'Account deactivated.');

    req.user = toPlain(user);
    req.refreshToken = token;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') return sendError(res, 401, 'Refresh token expired. Please login again.');
    return sendError(res, 401, 'Token verification failed.');
  }
});

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user) return sendError(res, 401, 'Authentication required.');
  if (!roles.includes(req.user.role)) return sendError(res, 403, `Required roles: ${roles.join(', ')}`);
  next();
};

export const isSuperAdmin = (req, res, next) => {
  if (!req.user) return sendError(res, 401, 'Authentication required.');
  if (req.user.role !== 'superadmin') return sendError(res, 403, 'Superadmin privileges required.');
  next();
};

export const isAdmin = (req, res, next) => {
  if (!req.user) return sendError(res, 401, 'Authentication required.');
  if (!['admin', 'superadmin'].includes(req.user.role)) return sendError(res, 403, 'Admin privileges required.');
  next();
};

export const isEditor = (req, res, next) => {
  if (!req.user) return sendError(res, 401, 'Authentication required.');
  if (!['editor', 'admin', 'superadmin'].includes(req.user.role)) return sendError(res, 403, 'Editor privileges required.');
  next();
};

export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;
  if (req.cookies?.accessToken) token = req.cookies.accessToken;
  else if (req.headers.authorization?.startsWith('Bearer ')) token = req.headers.authorization.split(' ')[1];
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await Admin.findById(decoded.id).select('username email role isActive');
    if (user?.isActive) req.user = toPlain(user);
  } catch { /* silent */ }
  next();
});

export const isOwnerOrAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user) return sendError(res, 401, 'Authentication required.');
  if (['admin', 'superadmin'].includes(req.user.role)) return next();
  const resourceOwnerId = req.params.id || req.body.id;
  if (req.user.id === resourceOwnerId) return next();
  return sendError(res, 403, 'Access denied. You can only modify your own resources.');
});

export default {
  verifyToken, verifyRefreshToken, authorize, isSuperAdmin, isAdmin, isEditor, optionalAuth, isOwnerOrAdmin,
};
