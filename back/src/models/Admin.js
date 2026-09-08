import mongoose from 'mongoose';
import { hashPassword } from '../utils/password.js';
import { applyToJSON } from './plugins/toJSON.js';

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, select: true },
    fullName: { type: String, default: null },
    phone: { type: String, default: null },
    role: { type: String, default: 'admin', enum: ['superadmin', 'admin', 'editor', 'viewer'] },
    isActive: { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: false },
    emailVerifiedAt: { type: Date, default: null },
    lastLogin: { type: Date, default: null },
    refreshToken: { type: String, default: null, select: true },
    failedLoginAttempts: { type: Number, default: 0 },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', default: null },
  },
  { timestamps: true }
);

adminSchema.pre('save', async function hashAdminPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await hashPassword(this.password);
  next();
});

applyToJSON(adminSchema);

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
