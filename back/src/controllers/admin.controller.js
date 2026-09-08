import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/response.js';
import Admin from '../models/Admin.js';
import { buildSearchFilter, paginateOptions, toPlain } from '../utils/mongo.js';

const populateDepartment = { path: 'departmentId', select: 'name code' };

export const getAllAdmins = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, role, isActive } = req.query;
  const { skip, page: pageNum, limit: limitNum } = paginateOptions(page, limit);

  const filter = { ...buildSearchFilter(['username', 'email', 'fullName'], search) };
  if (role) filter.role = role;
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  const [admins, total] = await Promise.all([
    Admin.find(filter)
      .select('-password -refreshToken')
      .populate(populateDepartment)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Admin.countDocuments(filter),
  ]);

  return sendPaginated(res, toPlain(admins), pageNum, limitNum, total, 'Admins retrieved successfully');
});

export const getAdminById = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.params.id)
    .select('-password -refreshToken')
    .populate(populateDepartment);
  if (!admin) return sendError(res, 404, 'Admin not found');
  return sendSuccess(res, 200, 'Admin retrieved successfully', toPlain(admin));
});

export const createAdmin = asyncHandler(async (req, res) => {
  const { username, email, password, fullName, role, phone, departmentId } = req.body;

  const existing = await Admin.findOne({ $or: [{ email }, { username }] });
  if (existing) {
    const field = existing.email === email ? 'email' : 'username';
    return sendError(res, 409, `Admin with this ${field} already exists`);
  }

  const admin = await Admin.create({
    username,
    email,
    password,
    fullName,
    role: role || 'admin',
    phone,
    departmentId: departmentId || null,
  });

  const populated = await Admin.findById(admin._id)
    .select('-password -refreshToken')
    .populate(populateDepartment);

  return sendSuccess(res, 201, 'Admin created successfully', toPlain(populated));
});

export const updateAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { username, email, fullName, role, phone, departmentId, isActive } = req.body;

  const admin = await Admin.findById(id);
  if (!admin) return sendError(res, 404, 'Admin not found');

  if (req.user.role !== 'superadmin' && req.user.id !== id) {
    return sendError(res, 403, 'You can only update your own account');
  }
  if (req.user.role !== 'superadmin') {
    if (role && role !== admin.role) return sendError(res, 403, 'You cannot change your own role');
    if (isActive !== undefined && isActive !== admin.isActive) {
      return sendError(res, 403, 'You cannot change your own active status');
    }
  }

  if (email && email !== admin.email) {
    const conflict = await Admin.findOne({ email, _id: { $ne: id } });
    if (conflict) return sendError(res, 409, 'Email already in use');
  }
  if (username && username !== admin.username) {
    const conflict = await Admin.findOne({ username, _id: { $ne: id } });
    if (conflict) return sendError(res, 409, 'Username already in use');
  }

  const updated = await Admin.findByIdAndUpdate(
    id,
    {
      ...(fullName && { fullName }),
      ...(email && { email }),
      ...(username && { username }),
      ...(phone !== undefined && { phone }),
      ...(role && req.user.role === 'superadmin' && { role }),
      ...(departmentId !== undefined && { departmentId: departmentId || null }),
      ...(isActive !== undefined && req.user.role === 'superadmin' && { isActive }),
    },
    { new: true, runValidators: true }
  )
    .select('-password -refreshToken')
    .populate(populateDepartment);

  return sendSuccess(res, 200, 'Admin updated successfully', toPlain(updated));
});

export const deleteAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const admin = await Admin.findById(id);
  if (!admin) return sendError(res, 404, 'Admin not found');
  if (admin.role === 'superadmin') return sendError(res, 403, 'Cannot delete superadmin account');
  if (id === req.user.id) return sendError(res, 403, 'You cannot delete your own account');

  await Admin.findByIdAndDelete(id);
  return sendSuccess(res, 200, 'Admin deleted successfully');
});

export const changeAdminPassword = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.params.id);
  if (!admin) return sendError(res, 404, 'Admin not found');

  admin.password = req.body.newPassword;
  admin.refreshToken = null;
  await admin.save();

  return sendSuccess(res, 200, 'Admin password changed successfully');
});

export const toggleAdminStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const admin = await Admin.findById(id);
  if (!admin) return sendError(res, 404, 'Admin not found');
  if (admin.role === 'superadmin') return sendError(res, 403, 'Cannot disable superadmin account');
  if (id === req.user.id) return sendError(res, 403, 'You cannot disable your own account');

  admin.isActive = !admin.isActive;
  await admin.save();

  return sendSuccess(res, 200, `Admin ${admin.isActive ? 'activated' : 'deactivated'} successfully`, {
    isActive: admin.isActive,
  });
});

export const getAdminStats = asyncHandler(async (req, res) => {
  const [total, active, byRole] = await Promise.all([
    Admin.countDocuments(),
    Admin.countDocuments({ isActive: true }),
    Admin.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
  ]);

  const roleMap = Object.fromEntries(byRole.map((r) => [r._id, r.count]));
  return sendSuccess(res, 200, 'Admin statistics retrieved successfully', {
    totalAdmins: total,
    activeAdmins: active,
    inactiveAdmins: total - active,
    superadmins: roleMap.superadmin || 0,
    admins: roleMap.admin || 0,
    editors: roleMap.editor || 0,
    viewers: roleMap.viewer || 0,
  });
});

export default {
  getAllAdmins, getAdminById, createAdmin, updateAdmin, deleteAdmin,
  changeAdminPassword, toggleAdminStatus, getAdminStats,
};
