import mongoose from 'mongoose';
import { applyToJSON } from './plugins/toJSON.js';

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    content: { type: String, default: null },
    excerpt: { type: String, default: null },
    image: { type: String, default: null },
    imagePublicId: { type: String, default: null },
    category: { type: String, default: 'general' },
    author: { type: String, default: 'Faculty Administration' },
    isPublished: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
    views: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    slug: { type: String, unique: true, sparse: true, default: null },
    status: { type: String, default: 'published' },
    createdById: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
  },
  { timestamps: true }
);

applyToJSON(newsSchema);

const News = mongoose.model('News', newsSchema);
export default News;
