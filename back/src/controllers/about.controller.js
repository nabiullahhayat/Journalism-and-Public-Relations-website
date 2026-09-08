import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import About from '../models/About.js';
import { toPlain } from '../utils/mongo.js';

const getOrCreateAbout = async () => {
  let about = await About.findOne();
  if (!about) {
    about = await About.create({
      facultyDescription: 'The Faculty of Journalism is dedicated to educating and training future journalists with the highest ethical standards and professional skills. Our programs are designed to prepare students for careers in print, digital, broadcast, and multimedia journalism in a rapidly changing media landscape.',
      facultyVision: 'To be a leading journalism education provider in the region, producing graduates who uphold the highest standards of ethical journalism and serve the public interest through accurate and responsible reporting.',
      facultyMission: 'To educate and train future journalists with ethical standards and professional skills, fostering critical thinking, media literacy, and a commitment to truth and public service in all forms of journalism.',
      requirements: [],
    });
  }
  return about;
};

export const getAbout = asyncHandler(async (req, res) => {
  const about = await getOrCreateAbout();
  return sendSuccess(res, 200, 'About information retrieved successfully', toPlain(about));
});

export const updateAbout = asyncHandler(async (req, res) => {
  const { facultyDescription, facultyVision, facultyMission, requirements } = req.body;

  let about = await About.findOne();

  const data = {
    lastUpdatedById: req.user?.id || null,
    ...(facultyDescription && { facultyDescription }),
    ...(facultyVision && { facultyVision }),
    ...(facultyMission && { facultyMission }),
    ...(requirements !== undefined && { requirements: Array.isArray(requirements) ? requirements : requirements }),
  };

  if (!about) {
    about = await About.create(data);
  } else {
    about = await About.findByIdAndUpdate(about._id, data, { new: true, runValidators: true });
  }

  return sendSuccess(res, 200, 'About information updated successfully', toPlain(about));
});

export default { getAbout, updateAbout };
