import { asyncHandler } from '../utils/asyncHandler.js';
import { generateAccessToken, generateRefreshToken, verifyToken, verifyRefreshToken as verifyRefreshJwt } from '../utils/jwt.js';
import { setAuthCookies, clearAuthCookies } from '../utils/cookie.js';
import { comparePassword } from '../utils/password.js';
import { sendSuccess, sendError } from '../utils/response.js';
import Admin from '../models/Admin.js';
import { toPlain } from '../utils/mongo.js';

const adminProfileSelect = '-password -refreshToken';

export const register = asyncHandler(async (req, res) => {
  const { username, email, password, fullName, role = 'admin' } = req.body;

  const adminCount = await Admin.countDocuments();

  if (adminCount > 0 && (!req.user || req.user.role !== 'superadmin')) {
    return sendError(res, 403, 'Only superadmin can create new admin accounts');
  }

  const existingAdmin = await Admin.findOne({ $or: [{ email }, { username }] });
  if (existingAdmin) {
    const field = existingAdmin.email === email ? 'email' : 'username';
    return sendError(res, 409, `Admin with this ${field} already exists`);
  }

  const admin = await Admin.create({
    username,
    email,
    password,
    fullName,
    role: adminCount === 0 ? 'superadmin' : role,
  });

  const accessToken = generateAccessToken({ id: admin.id, email: admin.email, role: admin.role });
  const refreshToken = generateRefreshToken({ id: admin.id });

  admin.refreshToken = refreshToken;
  await admin.save();

  setAuthCookies(res, accessToken, refreshToken);

  return sendSuccess(res, 201, 'Admin registered successfully', {
    admin: toPlain(admin),
    accessToken,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password, username } = req.body;
  const identifier = email || username;

  const admin = await Admin.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  }).select('+password +refreshToken');

  if (!admin) return sendError(res, 401, 'Invalid credentials');
  if (!admin.isActive) return sendError(res, 403, 'Account is deactivated. Please contact administrator');

  const isPasswordValid = await comparePassword(password, admin.password);
  if (!isPasswordValid) return sendError(res, 401, 'Invalid credentials');

  const accessToken = generateAccessToken({ id: admin.id, email: admin.email, role: admin.role });
  const refreshToken = generateRefreshToken({ id: admin.id });

  admin.refreshToken = refreshToken;
  admin.lastLogin = new Date();
  await admin.save();

  setAuthCookies(res, accessToken, refreshToken);

  return sendSuccess(res, 200, 'Login successful', {
    admin: toPlain(admin),
    accessToken,
    refreshToken,
  });
});

export const logout = asyncHandler(async (req, res) => {
  if (req.user?.id) {
    await Admin.findByIdAndUpdate(req.user.id, { refreshToken: null });
  }
  clearAuthCookies(res);
  return sendSuccess(res, 200, 'Logout successful');
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.refreshToken || req.cookies?.refreshToken || req.body?.refreshToken;
  if (!refreshToken) return sendError(res, 401, 'Refresh token required');

  // Middleware already verified the refresh token; use req.user when available
  const adminId = req.user?.id;
  let admin;

  if (adminId) {
    admin = await Admin.findOne({ _id: adminId, refreshToken }).select('+refreshToken');
  } else {
    let decoded;
    try {
      decoded = verifyRefreshJwt(refreshToken);
    } catch {
      clearAuthCookies(res);
      return sendError(res, 401, 'Invalid or expired refresh token');
    }
    admin = await Admin.findOne({ _id: decoded.id, refreshToken }).select('+refreshToken');
  }
  if (!admin || !admin.isActive) {
    clearAuthCookies(res);
    return sendError(res, 401, 'Invalid refresh token or account deactivated');
  }

  const newAccessToken = generateAccessToken({ id: admin.id, email: admin.email, role: admin.role });
  const newRefreshToken = generateRefreshToken({ id: admin.id });

  admin.refreshToken = newRefreshToken;
  await admin.save();
  setAuthCookies(res, newAccessToken, newRefreshToken);

  return sendSuccess(res, 200, 'Token refreshed successfully', {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.user.id)
    .select(adminProfileSelect)
    .populate('departmentId', 'name');
  if (!admin) return sendError(res, 404, 'Admin not found');

  const profile = toPlain(admin);
  if (profile.departmentId && typeof profile.departmentId === 'object') {
    profile.department = profile.departmentId;
    profile.departmentId = profile.department.id;
  }

  return sendSuccess(res, 200, 'Profile retrieved successfully', profile);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, email, username, phone } = req.body;

  if (email) {
    const conflict = await Admin.findOne({ email, _id: { $ne: req.user.id } });
    if (conflict) return sendError(res, 409, 'Email already in use');
  }
  if (username) {
    const conflict = await Admin.findOne({ username, _id: { $ne: req.user.id } });
    if (conflict) return sendError(res, 409, 'Username already in use');
  }

  const admin = await Admin.findByIdAndUpdate(
    req.user.id,
    {
      ...(fullName && { fullName }),
      ...(email && { email }),
      ...(username && { username }),
      ...(phone !== undefined && { phone }),
    },
    { new: true, runValidators: true }
  ).select(adminProfileSelect);

  return sendSuccess(res, 200, 'Profile updated successfully', toPlain(admin));
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const admin = await Admin.findById(req.user.id).select('+password');
  if (!admin) return sendError(res, 404, 'Admin not found');

  const isValid = await comparePassword(currentPassword, admin.password);
  if (!isValid) return sendError(res, 401, 'Current password is incorrect');

  admin.password = newPassword;
  admin.refreshToken = null;
  await admin.save();

  clearAuthCookies(res);
  return sendSuccess(res, 200, 'Password changed successfully. Please login again');
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const admin = await Admin.findOne({ email });

  if (!admin) {
    return sendSuccess(res, 200, 'If an account exists with this email, you will receive a password reset link');
  }

  const resetToken = generateAccessToken({ id: admin.id, type: 'password_reset' }, '1h');
  const responseData = process.env.NODE_ENV === 'development'
    ? { resetToken, resetLink: `${process.env.CLIENT_URL}/reset-password?token=${resetToken}` }
    : undefined;

  return sendSuccess(res, 200, 'Password reset instructions sent to email', responseData);
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return sendError(res, 400, 'Token and new password are required');

  let decoded;
  try {
    decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET);
    if (decoded.type !== 'password_reset') return sendError(res, 401, 'Invalid reset token');
  } catch {
    return sendError(res, 401, 'Invalid or expired reset token');
  }

  const admin = await Admin.findById(decoded.id);
  if (!admin) return sendError(res, 404, 'Admin not found');
  if (!admin.isActive) return sendError(res, 403, 'Account is deactivated');

  admin.password = newPassword;
  admin.refreshToken = null;
  await admin.save();

  return sendSuccess(res, 200, 'Password reset successful. Please login with your new password');
});

export const checkAuth = asyncHandler(async (req, res) => {
  const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(200).json({ success: true, authenticated: false });

  try {
    const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET);
    const admin = await Admin.findById(decoded.id).select('username email role fullName isActive');
    if (!admin || !admin.isActive) return res.status(200).json({ success: true, authenticated: false });
    return res.status(200).json({ success: true, authenticated: true, user: toPlain(admin) });
  } catch {
    return res.status(200).json({ success: true, authenticated: false });
  }
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;
  let decoded;
  try {
    decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET);
    if (decoded.type !== 'email_verification') return sendError(res, 401, 'Invalid verification token');
  } catch {
    return sendError(res, 401, 'Invalid or expired verification token');
  }

  const admin = await Admin.findById(decoded.id);
  if (!admin) return sendError(res, 404, 'Admin not found');
  if (admin.emailVerified) return sendSuccess(res, 200, 'Email already verified');

  admin.emailVerified = true;
  admin.emailVerifiedAt = new Date();
  await admin.save();

  return sendSuccess(res, 200, 'Email verified successfully');
});

export default {
  register, login, logout, refreshAccessToken, getProfile,
  updateProfile, changePassword, forgotPassword, resetPassword, checkAuth, verifyEmail,
};
