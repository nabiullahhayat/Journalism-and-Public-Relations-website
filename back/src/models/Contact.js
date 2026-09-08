import mongoose from 'mongoose';
import { applyToJSON } from './plugins/toJSON.js';

const contactSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, required: true },
    whatsapp: { type: String, required: true },
    facebookUrl: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, default: null },
    workingHours: { type: String, default: null },
    mapEmbedUrl: { type: String, default: null },
    twitterUrl: { type: String, default: null },
    linkedinUrl: { type: String, default: null },
    instagramUrl: { type: String, default: null },
    youtubeUrl: { type: String, default: null },
    lastUpdatedById: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
  },
  { timestamps: true }
);

applyToJSON(contactSchema);

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;
