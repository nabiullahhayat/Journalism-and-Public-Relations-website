import mongoose from 'mongoose';
import { applyToJSON } from './plugins/toJSON.js';

const aboutSchema = new mongoose.Schema(
  {
    facultyDescription: { type: String, required: true },
    facultyVision: { type: String, required: true },
    facultyMission: { type: String, required: true },
    requirements: { type: [String], default: [] },
    version: { type: Number, default: 1 },
    lastUpdatedById: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
  },
  { timestamps: true }
);

applyToJSON(aboutSchema);

const About = mongoose.model('About', aboutSchema);
export default About;
