import mongoose from 'mongoose';
import { applyToJSON } from './plugins/toJSON.js';

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    code: { type: String, default: null },
    description: { type: String, default: null },
    headId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', default: null },
    established: { type: Date, default: null },
    email: { type: String, default: null },
    phone: { type: String, default: null },
    location: { type: String, default: null },
    website: { type: String, default: null },
    vision: { type: String, default: null },
    mission: { type: String, default: null },
    objectives: { type: [String], default: [] },
    programs: { type: [mongoose.Schema.Types.Mixed], default: [] },
    socialLinks: { type: mongoose.Schema.Types.Mixed, default: {} },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

applyToJSON(departmentSchema);

const Department = mongoose.model('Department', departmentSchema);
export default Department;
