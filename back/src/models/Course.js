import mongoose from 'mongoose';
import { applyToJSON } from './plugins/toJSON.js';

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, unique: true, sparse: true, default: null },
    description: { type: String, default: null },
    details: { type: String, default: null },
    level: { type: String, default: null },
    semester: { type: Number, default: null },
    credits: { type: Number, default: null },
    type: { type: String, default: null },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', default: null },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', default: null },
    time: { type: Number, default: null },
    date: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

applyToJSON(courseSchema);

const Course = mongoose.model('Course', courseSchema);
export default Course;
