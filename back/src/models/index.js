/**
 * Import all models so Mongoose registers schemas before populate() runs.
 * Without this, refs like AcademicRank fail with MissingSchemaError.
 */
import Admin from './Admin.js';
import AcademicRank from './AcademicRank.js';
import Department from './Department.js';
import Teacher from './Teacher.js';
import Course from './Course.js';
import News from './News.js';
import Monograph from './Monograph.js';
import Contact from './Contact.js';
import About from './About.js';

export {
  Admin,
  AcademicRank,
  Department,
  Teacher,
  Course,
  News,
  Monograph,
  Contact,
  About,
};
