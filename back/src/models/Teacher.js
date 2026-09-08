import mongoose from 'mongoose';
import { applyToJSON } from './plugins/toJSON.js';

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    profileImage: { type: String, default: null },
    academicRankId: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicRank', default: null },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    whatsapp: { type: String, default: null },
    city: { type: String, required: true },
    schoolName: { type: String, required: true },
    schoolGraduationYear: { type: Number, required: true },
    bachelorUniversity: { type: String, required: true },
    bachelorGraduationYear: { type: Number, required: true },
    masterCountry: { type: String, default: null },
    masterUniversity: { type: String, default: null },
    masterGraduationYear: { type: Number, default: null },
    masterThesis: { type: String, default: null },
    phdCountry: { type: String, default: null },
    phdUniversity: { type: String, default: null },
    phdGraduationYear: { type: Number, default: null },
    phdThesis: { type: String, default: null },
    researchPapers: { type: [mongoose.Schema.Types.Mixed], default: [] },
    professionalCertificates: { type: [mongoose.Schema.Types.Mixed], default: [] },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', default: null },
    classes: { type: [String], default: [] },
    bio: { type: String, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

applyToJSON(teacherSchema);

const Teacher = mongoose.model('Teacher', teacherSchema);
export default Teacher;
