import mongoose from 'mongoose';
import { applyToJSON } from './plugins/toJSON.js';

const monographSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true, trim: true },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', default: null },
    supervisor: { type: String, required: true },
    year: { type: Number, required: true },
    issue: { type: String, required: true },
    title: { type: String, default: null },
    abstract: { type: String, default: null },
    keywords: { type: [String], default: [] },
    documentUrl: { type: String, default: null },
    pages: { type: Number, default: null },
    grade: { type: String, default: null },
    isPublished: { type: Boolean, default: true },
    degree: { type: String, default: null },
    downloads: { type: Number, default: 0 },
    createdById: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
  },
  { timestamps: true }
);

applyToJSON(monographSchema);

const Monograph = mongoose.model('Monograph', monographSchema);
export default Monograph;
