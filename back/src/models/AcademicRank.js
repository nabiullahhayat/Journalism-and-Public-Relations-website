import mongoose from 'mongoose';
import { applyToJSON } from './plugins/toJSON.js';

const academicRankSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    level: { type: Number, required: true, unique: true },
    description: { type: String, default: null },
    requirements: { type: [String], default: [] },
    isDefault: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

applyToJSON(academicRankSchema);

const AcademicRank = mongoose.model('AcademicRank', academicRankSchema);
export default AcademicRank;
