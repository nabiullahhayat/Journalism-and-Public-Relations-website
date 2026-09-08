import dotenv from 'dotenv';
import { connectDB } from '../config/db.config.js';
import { logInfo, logSuccess, logError } from '../utils/logger.js';
import Teacher from '../models/Teacher.js';
import { writeTeacherPortraitFiles, getTeacherImageMap } from './teacherImages.js';

dotenv.config();

const seedTeacherImages = async () => {
  try {
    logInfo('🖼️  Seeding teacher profile images...');
    await connectDB();
    writeTeacherPortraitFiles();

    const imageMap = getTeacherImageMap();
    let updated = 0;

    for (const [email, profileImage] of Object.entries(imageMap)) {
      const result = await Teacher.findOneAndUpdate({ email }, { profileImage }, { new: true });
      if (result) updated += 1;
    }

    logSuccess(`✅ Teacher profile images ready (${updated} teachers updated)`);
    process.exit(0);
  } catch (error) {
    logError('❌ Failed to seed teacher images:', error.message);
    process.exit(1);
  }
};

seedTeacherImages();
