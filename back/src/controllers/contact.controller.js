import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import Contact from '../models/Contact.js';
import { toPlain } from '../utils/mongo.js';

const getOrCreateContact = async () => {
  let contact = await Contact.findOne();
  if (!contact) {
    contact = await Contact.create({
      phoneNumber: '+1234567890',
      whatsapp: '+1234567890',
      facebookUrl: 'https://facebook.com/faculty',
      email: 'faculty@example.com',
      address: 'Faculty Address, City, Country',
      workingHours: 'Sunday - Thursday: 8:00 AM - 4:00 PM',
    });
  }
  return contact;
};

export const getContact = asyncHandler(async (req, res) => {
  const contact = await getOrCreateContact();
  return sendSuccess(res, 200, 'Contact information retrieved successfully', toPlain(contact));
});

export const updateContact = asyncHandler(async (req, res) => {
  const fields = ['phoneNumber', 'whatsapp', 'facebookUrl', 'email', 'address',
    'workingHours', 'mapEmbedUrl', 'twitterUrl', 'linkedinUrl', 'instagramUrl', 'youtubeUrl'];

  const data = { lastUpdatedById: req.user?.id || null };
  fields.forEach((f) => { if (req.body[f] !== undefined) data[f] = req.body[f]; });

  let contact = await Contact.findOne();
  if (!contact) {
    contact = await Contact.create(data);
  } else {
    contact = await Contact.findByIdAndUpdate(contact._id, data, { new: true, runValidators: true });
  }

  return sendSuccess(res, 200, 'Contact information updated successfully', toPlain(contact));
});

export const sendContactMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;
  return sendSuccess(res, 200, 'Message sent successfully. We will get back to you soon.', {
    name, email, subject, sentAt: new Date(),
  });
});

export default { getContact, updateContact, sendContactMessage };
