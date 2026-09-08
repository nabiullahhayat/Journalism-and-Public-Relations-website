import { body } from 'express-validator';

export const updateContactValidator = [
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('phoneNumber')
    .optional()
    .trim()
    .matches(/^[\d\s\-\+\(\)]+$/).withMessage('Invalid phone number format'),

  body('whatsapp')
    .optional()
    .trim()
    .matches(/^[\d\s\-\+\(\)]+$/).withMessage('Invalid WhatsApp number format'),

  body('address')
    .optional()
    .trim()
    .isLength({ min: 5, max: 500 }).withMessage('Address must be between 5 and 500 characters'),

  body('workingHours')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Working hours cannot exceed 500 characters'),

  body('facebookUrl')
    .optional()
    .trim()
    .isURL().withMessage('Invalid Facebook URL'),

  body('twitterUrl')
    .optional()
    .trim()
    .isURL().withMessage('Invalid Twitter URL'),

  body('instagramUrl')
    .optional()
    .trim()
    .isURL().withMessage('Invalid Instagram URL'),

  body('linkedinUrl')
    .optional()
    .trim()
    .isURL().withMessage('Invalid LinkedIn URL'),

  body('youtubeUrl')
    .optional()
    .trim()
    .isURL().withMessage('Invalid YouTube URL'),

  body('mapEmbedUrl')
    .optional()
    .trim(),
];

export const contactMessageValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required')
    .isLength({ min: 5, max: 200 }).withMessage('Subject must be between 5 and 200 characters'),

  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10 and 2000 characters'),

  body('phone')
    .optional()
    .trim()
    .matches(/^[\d\s\-\+\(\)]+$/).withMessage('Invalid phone number format'),
];

export default {
  updateContactValidator,
  contactMessageValidator,
};
