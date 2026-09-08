import bcrypt from 'bcryptjs';

/**
 * Hash password using bcrypt
 * @param {String} password - Plain text password
 * @param {Number} saltRounds - Number of salt rounds (default: 10)
 * @returns {Promise<String>} Hashed password
 */
export const hashPassword = async (password, saltRounds = 10) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error('Error hashing password');
  }
};

/**
 * Compare password with hash
 * @param {String} password - Plain text password
 * @param {String} hash - Hashed password
 * @returns {Promise<Boolean>} True if password matches
 */
export const comparePassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    throw new Error('Error comparing password');
  }
};

/**
 * Validate password strength
 * @param {String} password - Password to validate
 * @returns {Object} Validation result with isValid and errors array
 */
export const validatePasswordStrength = (password) => {
  const errors = [];
  
  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Generate random password
 * @param {Number} length - Password length (default: 12)
 * @returns {String} Random password
 */
export const generateRandomPassword = (length = 12) => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*()';
  const all = uppercase + lowercase + numbers + special;
  
  let password = '';
  
  // Ensure at least one of each type
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

/**
 * Check if password is common/weak
 * @param {String} password - Password to check
 * @returns {Boolean} True if password is common
 */
export const isCommonPassword = (password) => {
  const commonPasswords = [
    'password', 'password123', '123456', '12345678', '123456789',
    'qwerty', 'abc123', 'letmein', 'welcome', 'monkey', 'dragon',
    'master', 'sunshine', 'princess', 'football', 'shadow', 'michael',
    'jennifer', 'computer', 'password1', 'admin', 'admin123'
  ];
  
  return commonPasswords.includes(password.toLowerCase());
};

/**
 * Generate password reset token
 * @returns {String} Random token for password reset
 */
export const generateResetToken = () => {
  const crypto = require('crypto');
  return crypto.randomBytes(32).toString('hex');
};
