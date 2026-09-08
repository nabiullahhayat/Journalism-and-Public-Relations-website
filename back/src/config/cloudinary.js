import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Cloudinary configuration
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

/**
 * Validate Cloudinary configuration
 */
const validateCloudinaryConfig = () => {
  const requiredConfig = [
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET'
  ];

  const missingConfig = requiredConfig.filter(key => !process.env[key]);

  if (missingConfig.length > 0) {
    console.warn('⚠️  Cloudinary configuration warning:', {
      message: 'Some Cloudinary environment variables are missing',
      missing: missingConfig,
      note: 'Image upload features will not work until configured'
    });
    return false;
  } else {
    console.log('✅ Cloudinary configured successfully');
    return true;
  }
};

// Validate configuration on import
validateCloudinaryConfig();

/**
 * Test Cloudinary connection
 * @returns {Promise<Object>} Connection test result
 */
export const testCloudinaryConnection = async () => {
  try {
    const result = await cloudinary.api.ping();
    return {
      success: true,
      message: 'Cloudinary connection successful',
      data: result
    };
  } catch (error) {
    return {
      success: false,
      message: 'Cloudinary connection failed',
      error: error.message
    };
  }
};

/**
 * Upload options presets for different file types
 */
export const uploadOptions = {
  // Profile images
  profile: {
    folder: 'journalism-faculty/profiles',
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face' }
    ],
    format: 'webp',
    quality: 'auto'
  },
  
  // News images
  news: {
    folder: 'journalism-faculty/news',
    transformation: [
      { width: 1200, height: 630, crop: 'fill' }
    ],
    format: 'webp',
    quality: 'auto'
  },
  
  // Banner images
  banner: {
    folder: 'journalism-faculty/banners',
    transformation: [
      { width: 1920, height: 600, crop: 'fill' }
    ],
    format: 'webp',
    quality: 'auto'
  },
  
  // Document thumbnails
  document: {
    folder: 'journalism-faculty/documents',
    transformation: [
      { width: 800, height: 1000, crop: 'limit' }
    ],
    format: 'webp',
    quality: 'auto'
  },
  
  // General images
  general: {
    folder: 'journalism-faculty/general',
    transformation: [
      { width: 800, height: 600, crop: 'limit' }
    ],
    format: 'webp',
    quality: 'auto'
  }
};

/**
 * Generate secure URL with transformations
 * @param {String} publicId - Cloudinary public ID
 * @param {String} preset - Preset name from uploadOptions
 * @returns {String} Secure URL
 */
export const generateSecureUrl = (publicId, preset = 'general') => {
  const options = uploadOptions[preset] || uploadOptions.general;
  return cloudinary.url(publicId, { ...options, secure: true });
};

/**
 * Delete file from Cloudinary
 * @param {String} publicId - Cloudinary public ID
 * @returns {Promise<Object>} Delete result
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: result.result === 'ok',
      message: result.result === 'ok' ? 'File deleted successfully' : 'File not found',
      data: result
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error deleting file',
      error: error.message
    };
  }
};

/**
 * Delete multiple files from Cloudinary
 * @param {Array<String>} publicIds - Array of public IDs to delete
 * @returns {Promise<Array>} Array of delete results
 */
export const deleteMultipleFiles = async (publicIds) => {
  const results = [];
  
  for (const publicId of publicIds) {
    const result = await deleteFromCloudinary(publicId);
    results.push({
      publicId,
      ...result
    });
  }
  
  return results;
};

/**
 * Get resource information from Cloudinary
 * @param {String} publicId - Cloudinary public ID
 * @returns {Promise<Object>} Resource information
 */
export const getResourceInfo = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId);
    return {
      success: true,
      data: result
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Upload image to Cloudinary
 * @param {String} fileBuffer - File buffer or file path
 * @param {String} folder - Cloudinary folder
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Upload result
 */
export const uploadToCloudinary = async (fileBuffer, folder = 'journalism-faculty', options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        ...options
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

export default cloudinary;
