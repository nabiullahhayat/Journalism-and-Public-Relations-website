import dotenv from 'dotenv';
import { connectDB } from '../config/db.config.js';
import { logInfo, logError, logSuccess, logWarning } from '../utils/logger.js';
import Admin from '../models/Admin.js';
import AcademicRank from '../models/AcademicRank.js';
import Department from '../models/Department.js';
import Teacher from '../models/Teacher.js';
import Course from '../models/Course.js';
import News from '../models/News.js';
import Monograph from '../models/Monograph.js';
import Contact from '../models/Contact.js';
import About from '../models/About.js';
import { writeTeacherPortraitFiles, getTeacherImageMap } from './teacherImages.js';

dotenv.config();

const slugify = (title) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const academicRanks = [
  { name: 'Professor', level: 7, description: 'Highest academic rank with significant research and teaching experience' },
  { name: 'Associate Professor', level: 6, description: 'Senior academic rank with substantial research contributions' },
  { name: 'Assistant Professor', level: 5, description: 'Entry-level tenure-track position' },
  { name: 'Senior Lecturer', level: 4, description: 'Experienced teaching-focused position' },
  { name: 'Lecturer', level: 3, description: 'Teaching-focused position' },
  { name: 'Instructor', level: 2, description: 'Entry-level teaching position' },
  { name: 'Teaching Assistant', level: 1, description: 'Graduate student or junior teaching position' },
];

const defaultAdmin = {
  username: 'superadmin',
  email: 'admin@journalism-faculty.edu',
  password: 'Admin@123456',
  fullName: 'System Administrator',
  role: 'superadmin',
  isActive: true,
};

const sampleDepartments = [
  {
    name: 'Journalism Department',
    code: 'JRN',
    description: 'Print, digital, and broadcast journalism — training reporters, editors, and newsroom leaders with strong ethical foundations.',
    established: new Date('2000-01-01'),
    email: 'journalism@kandahar-university.edu.af',
    phone: '+93-30-111-1001',
    location: 'Building A, 2nd Floor, Kandahar University',
    vision: 'To be the leading journalism education center in southern Afghanistan.',
    mission: 'To educate ethical journalists equipped for modern newsrooms and digital media.',
    objectives: ['Investigative reporting skills', 'Multimedia storytelling', 'Media law and ethics'],
    isActive: true,
  },
  {
    name: 'Media Studies Department',
    code: 'MST',
    description: 'Media theory, digital culture, audience analysis, and the social impact of communication technologies.',
    established: new Date('2005-01-01'),
    email: 'media@kandahar-university.edu.af',
    phone: '+93-30-111-1002',
    location: 'Building B, 1st Floor, Kandahar University',
    vision: 'To advance critical media literacy and research in the region.',
    mission: 'To provide comprehensive media studies education and research opportunities.',
    objectives: ['Media literacy', 'Digital culture studies', 'Communication research methods'],
    isActive: true,
  },
  {
    name: 'Public Relations Department',
    code: 'PR',
    description: 'Strategic communication, corporate messaging, crisis communication, and public affairs for organizations and institutions.',
    established: new Date('2010-01-01'),
    email: 'pr@kandahar-university.edu.af',
    phone: '+93-30-111-1003',
    location: 'Building A, 3rd Floor, Kandahar University',
    vision: 'To develop professional communicators who serve the public interest.',
    mission: 'To train PR specialists in strategic planning, writing, and stakeholder engagement.',
    objectives: ['Strategic communication', 'Crisis management', 'Public affairs writing'],
    isActive: true,
  },
];

const defaultContact = {
  phoneNumber: '+93-30-123-4567',
  whatsapp: '+93-70-987-6543',
  facebookUrl: 'https://facebook.com/kandahar-journalism-faculty',
  email: 'info@journalism-faculty.edu.af',
  address: 'Faculty of Journalism & Public Relations, Kandahar University, Darwazagi, Kandahar, Afghanistan',
  workingHours: 'Saturday – Thursday: 8:00 AM – 5:00 PM | Friday: Closed',
  twitterUrl: 'https://twitter.com/ku_journalism',
  instagramUrl: 'https://instagram.com/ku_journalism',
  linkedinUrl: 'https://linkedin.com/school/kandahar-university-journalism',
  youtubeUrl: 'https://youtube.com/@kandahar-university-journalism',
};

const defaultAbout = {
  facultyDescription:
    'The Faculty of Journalism and Public Relations at Kandahar University prepares students for careers in news media, digital communication, and public affairs.\n\nSince our founding, we have combined classroom instruction with practical newsroom experience, internships, and community reporting projects across Kandahar province.',
  facultyVision: 'To be a nationally recognized center of excellence in journalism education, ethical reporting, and strategic communication.',
  facultyMission:
    'We provide rigorous academic programs, foster critical thinking, and prepare graduates who serve the public through truthful, responsible communication.',
  requirements: [
    'Deliver accredited journalism and PR degree programs',
    'Promote press freedom and ethical reporting standards',
    'Support faculty research and student publications',
    'Partner with media organizations for internships and training',
    'Serve the community through public interest journalism',
  ],
};

const getTeachersData = () => [
  {
    name: 'Dr. Ahmad Shah Zaland',
    email: 'ahmad.zaland@journalism-faculty.edu.af',
    phone: '+93-70-111-0001',
    city: 'Kandahar',
    schoolName: 'Mirwais Hotaki High School',
    schoolGraduationYear: 2002,
    bachelorUniversity: 'Kandahar University',
    bachelorGraduationYear: 2006,
    masterCountry: 'Afghanistan',
    masterUniversity: 'Kabul University',
    masterGraduationYear: 2010,
    masterThesis: 'Investigative Journalism in Post-Conflict Afghanistan',
    bio: 'Specializes in investigative reporting and media ethics. Former editor at a national daily newspaper.',
    departmentName: 'Journalism Department',
    rankName: 'Professor',
    researchPapers: [{ title: 'Press Freedom in Afghanistan', year: 2021, journal: 'Asian Journalism Review' }],
  },
  {
    name: 'Dr. Fatima Ahmadi',
    email: 'fatima.ahmadi@journalism-faculty.edu.af',
    phone: '+93-70-111-0002',
    city: 'Kandahar',
    schoolName: 'Aisha Siddiqa High School',
    schoolGraduationYear: 2004,
    bachelorUniversity: 'Herat University',
    bachelorGraduationYear: 2008,
    masterCountry: 'Pakistan',
    masterUniversity: 'University of Karachi',
    masterGraduationYear: 2012,
    masterThesis: 'Women in Afghan Media',
    bio: 'Research focus on gender representation in media and community radio development.',
    departmentName: 'Media Studies Department',
    rankName: 'Associate Professor',
    researchPapers: [{ title: 'Gender and Media in Afghanistan', year: 2022, journal: 'Media Culture Journal' }],
  },
  {
    name: 'Mohammad Omar Hotaki',
    email: 'mohammad.hotaki@journalism-faculty.edu.af',
    phone: '+93-70-111-0003',
    city: 'Kandahar',
    schoolName: 'Kandahar High School',
    schoolGraduationYear: 2008,
    bachelorUniversity: 'Kandahar University',
    bachelorGraduationYear: 2012,
    masterCountry: 'Afghanistan',
    masterUniversity: 'Kabul University',
    masterGraduationYear: 2016,
    masterThesis: 'Digital News Consumption Among Afghan Youth',
    bio: 'Teaches multimedia journalism, video production, and social media reporting.',
    departmentName: 'Journalism Department',
    rankName: 'Assistant Professor',
    researchPapers: [{ title: 'Mobile Journalism in Rural Areas', year: 2023, journal: 'Digital Media Studies' }],
  },
  {
    name: 'Sara Noori',
    email: 'sara.noori@journalism-faculty.edu.af',
    phone: '+93-70-111-0004',
    city: 'Kandahar',
    schoolName: 'Malalai High School',
    schoolGraduationYear: 2010,
    bachelorUniversity: 'Kandahar University',
    bachelorGraduationYear: 2014,
    bio: 'PR practitioner with experience in NGO communication and campaign management.',
    departmentName: 'Public Relations Department',
    rankName: 'Senior Lecturer',
    researchPapers: [],
  },
  {
    name: 'Haji Gul Ahmad',
    email: 'gul.ahmad@journalism-faculty.edu.af',
    phone: '+93-70-111-0005',
    city: 'Kandahar',
    schoolName: 'Ahmad Shah Baba High School',
    schoolGraduationYear: 1998,
    bachelorUniversity: 'Kabul University',
    bachelorGraduationYear: 2002,
    bio: 'Veteran broadcast journalist with 20 years of radio and television experience.',
    departmentName: 'Journalism Department',
    rankName: 'Senior Lecturer',
    researchPapers: [{ title: 'Community Radio in Southern Afghanistan', year: 2019, journal: 'Broadcast Quarterly' }],
  },
  {
    name: 'Zainab Karimi',
    email: 'zainab.karimi@journalism-faculty.edu.af',
    phone: '+93-70-111-0006',
    city: 'Kandahar',
    schoolName: 'Kandahar Girls High School',
    schoolGraduationYear: 2012,
    bachelorUniversity: 'Kandahar University',
    bachelorGraduationYear: 2016,
    masterCountry: 'India',
    masterUniversity: 'Jamia Millia Islamia',
    masterGraduationYear: 2019,
    masterThesis: 'Social Media and Political Communication',
    bio: 'Teaches media theory, communication research methods, and data journalism basics.',
    departmentName: 'Media Studies Department',
    rankName: 'Lecturer',
    researchPapers: [{ title: 'Social Media Literacy Among Students', year: 2024, journal: 'Communication Education' }],
  },
];

const getCoursesData = () => [
  { name: 'Introduction to Journalism', code: 'JRN-101', description: 'Foundations of news writing, reporting ethics, and the role of journalism in democracy.', level: 'bachelor', semester: 1, credits: 3, departmentName: 'Journalism Department', teacherEmail: 'ahmad.zaland@journalism-faculty.edu.af' },
  { name: 'News Writing & Reporting', code: 'JRN-201', description: 'Hands-on reporting assignments covering campus and community stories.', level: 'bachelor', semester: 3, credits: 4, departmentName: 'Journalism Department', teacherEmail: 'mohammad.hotaki@journalism-faculty.edu.af' },
  { name: 'Broadcast Journalism', code: 'JRN-301', description: 'Television and radio news production, scripting, and on-air presentation.', level: 'bachelor', semester: 5, credits: 4, departmentName: 'Journalism Department', teacherEmail: 'gul.ahmad@journalism-faculty.edu.af' },
  { name: 'Investigative Reporting', code: 'JRN-401', description: 'Advanced techniques in source development, document analysis, and long-form reporting.', level: 'master', semester: 2, credits: 3, departmentName: 'Journalism Department', teacherEmail: 'ahmad.zaland@journalism-faculty.edu.af' },
  { name: 'Media Theory & Society', code: 'MST-101', description: 'Critical analysis of media systems, audiences, and cultural impact.', level: 'bachelor', semester: 2, credits: 3, departmentName: 'Media Studies Department', teacherEmail: 'fatima.ahmadi@journalism-faculty.edu.af' },
  { name: 'Digital Media Production', code: 'MST-201', description: 'Creating multimedia content for web, social platforms, and mobile audiences.', level: 'bachelor', semester: 4, credits: 4, departmentName: 'Media Studies Department', teacherEmail: 'zainab.karimi@journalism-faculty.edu.af' },
  { name: 'Communication Research Methods', code: 'MST-301', description: 'Survey design, content analysis, and qualitative research in media studies.', level: 'master', semester: 1, credits: 3, departmentName: 'Media Studies Department', teacherEmail: 'zainab.karimi@journalism-faculty.edu.af' },
  { name: 'Principles of Public Relations', code: 'PR-101', description: 'Introduction to PR planning, messaging, and stakeholder communication.', level: 'bachelor', semester: 1, credits: 3, departmentName: 'Public Relations Department', teacherEmail: 'sara.noori@journalism-faculty.edu.af' },
  { name: 'Crisis Communication', code: 'PR-301', description: 'Managing organizational reputation during emergencies and public scrutiny.', level: 'bachelor', semester: 5, credits: 3, departmentName: 'Public Relations Department', teacherEmail: 'sara.noori@journalism-faculty.edu.af' },
  { name: 'Media Law & Ethics', code: 'JRN-302', description: 'Legal frameworks, defamation, privacy, and professional codes of conduct.', level: 'bachelor', semester: 6, credits: 3, departmentName: 'Journalism Department', teacherEmail: 'ahmad.zaland@journalism-faculty.edu.af' },
];

const sampleNews = [
  {
    title: 'Faculty Welcomes New Class of Journalism Students',
    description: 'Over 120 new students enrolled in journalism and public relations programs for the 2025 academic year.',
    content: 'The Faculty of Journalism and Public Relations at Kandahar University officially welcomed more than 120 new students during an orientation ceremony held on campus. Dean Dr. Ahmad Shah Zaland encouraged students to pursue truth, accuracy, and ethical reporting throughout their studies.',
    excerpt: 'More than 120 new students join journalism and PR programs this semester.',
    category: 'academic',
    author: 'Faculty Administration',
    featured: true,
    status: 'published',
    tags: ['admissions', 'students', 'orientation'],
  },
  {
    title: 'Student Newspaper Wins Regional Media Award',
    description: 'The campus student publication received recognition for outstanding community reporting.',
    content: 'Kandahar University\'s student-run newspaper was honored at the Regional Student Media Awards for its investigative series on local healthcare access. The award highlights the faculty\'s commitment to hands-on journalism training.',
    excerpt: 'Campus newspaper recognized for community investigative reporting.',
    category: 'achievement',
    author: 'Communications Office',
    featured: true,
    status: 'published',
    tags: ['students', 'awards', 'newspaper'],
  },
  {
    title: 'International Media Workshop Held on Campus',
    description: 'Visiting journalists conducted a three-day workshop on digital storytelling and mobile journalism.',
    content: 'Journalists from international news organizations led workshops covering mobile reporting, video editing, and social media verification. Over 80 students and faculty members participated in the sessions.',
    excerpt: 'Three-day workshop on digital storytelling attracts 80 participants.',
    category: 'events',
    author: 'Events Committee',
    featured: true,
    status: 'published',
    tags: ['workshop', 'digital media', 'training'],
  },
  {
    title: 'Research Seminar on Press Freedom in Afghanistan',
    description: 'Faculty members presented latest research findings on media independence and safety.',
    content: 'The Media Studies Department hosted a research seminar examining press freedom trends, journalist safety, and regulatory challenges facing Afghan media. Dr. Fatima Ahmadi presented findings from her ongoing gender and media study.',
    excerpt: 'Faculty research seminar explores press freedom and journalist safety.',
    category: 'research',
    author: 'Research Office',
    featured: false,
    status: 'published',
    tags: ['research', 'press freedom', 'seminar'],
  },
  {
    title: 'PR Students Launch Community Awareness Campaign',
    description: 'Public relations students designed a campaign promoting literacy in rural districts.',
    content: 'Students in the Public Relations Department partnered with local NGOs to create a multi-channel awareness campaign on adult literacy. The project applied classroom theory to real-world strategic communication planning.',
    excerpt: 'PR students apply classroom skills to community literacy campaign.',
    category: 'community',
    author: 'PR Department',
    featured: false,
    status: 'published',
    tags: ['PR', 'community', 'students'],
  },
  {
    title: 'Faculty Library Expands Digital Archive',
    description: 'New digital resources added for journalism history and media research.',
    content: 'The faculty library has expanded its digital archive with access to international journalism databases, historical newspaper collections, and research journals. Students can now access resources from the campus computer lab and remote portals.',
    excerpt: 'Digital archive expansion supports student research and reporting.',
    category: 'academic',
    author: 'Library Services',
    featured: false,
    status: 'published',
    tags: ['library', 'resources', 'research'],
  },
];

const getMonographsData = () => [
  { studentName: 'Abdul Basir Popal', supervisor: 'Dr. Ahmad Shah Zaland', year: 2024, issue: 'The Role of Social Media in Shaping Public Opinion in Kandahar', title: 'Social Media and Public Opinion in Kandahar Province', abstract: 'This study examines how Facebook and Telegram influence political discourse among urban youth in Kandahar.', grade: 'A', departmentName: 'Media Studies Department' },
  { studentName: 'Maryam Safi', supervisor: 'Dr. Fatima Ahmadi', year: 2024, issue: 'Women Journalists in Afghan Media: Challenges and Opportunities', title: 'Women in Afghan Journalism', abstract: 'An analysis of barriers and achievements for women working in Afghan newsrooms since 2001.', grade: 'A+', departmentName: 'Journalism Department' },
  { studentName: 'Hamidullah Stanikzai', supervisor: 'Mohammad Omar Hotaki', year: 2023, issue: 'Mobile Journalism Practices Among Afghan Reporters', title: 'Mobile Journalism in Afghanistan', abstract: 'Explores adoption of smartphone-based reporting tools among provincial journalists.', grade: 'A', departmentName: 'Journalism Department' },
  { studentName: 'Khadija Rahimi', supervisor: 'Sara Noori', year: 2023, issue: 'NGO Communication Strategies in Humanitarian Crises', title: 'NGO Crisis Communication', abstract: 'Evaluates messaging strategies used by NGOs during emergency relief operations in southern Afghanistan.', grade: 'B+', departmentName: 'Public Relations Department' },
  { studentName: 'Nasir Ahmad', supervisor: 'Haji Gul Ahmad', year: 2022, issue: 'Community Radio as a Tool for Rural Development', title: 'Community Radio in Rural Afghanistan', abstract: 'Case study of three community radio stations and their impact on local education and health awareness.', grade: 'A', departmentName: 'Journalism Department' },
  { studentName: 'Laila Mohammadi', supervisor: 'Zainab Karimi', year: 2022, issue: 'Media Literacy Among University Students', title: 'Media Literacy in Higher Education', abstract: 'Survey-based research measuring critical media consumption skills among first-year students.', grade: 'A-', departmentName: 'Media Studies Department' },
];

const seedAcademicRanks = async () => {
  if ((await AcademicRank.countDocuments()) > 0) {
    logWarning('Academic ranks already exist. Skipping...');
    return;
  }
  await AcademicRank.insertMany(academicRanks);
  logSuccess(`✅ Seeded ${academicRanks.length} academic ranks`);
};

const seedDefaultAdmin = async () => {
  const existingAdmin = await Admin.findOne({
    $or: [{ email: defaultAdmin.email }, { username: defaultAdmin.username }],
  });
  if (existingAdmin) {
    logWarning('Default admin already exists. Skipping...');
    return;
  }
  const admin = await Admin.create(defaultAdmin);
  logSuccess(`✅ Created default admin: ${admin.username} (${admin.email})`);
  logWarning(`⚠️  Default password: ${defaultAdmin.password}`);
};

const seedDepartments = async () => {
  if ((await Department.countDocuments()) > 0) {
    logWarning('Departments already exist. Skipping...');
    return;
  }
  await Department.insertMany(sampleDepartments);
  logSuccess(`✅ Seeded ${sampleDepartments.length} departments`);
};

const seedTeachers = async () => {
  if ((await Teacher.countDocuments()) > 0) {
    logWarning('Teachers already exist. Skipping...');
    return;
  }

  const departments = await Department.find();
  const ranks = await AcademicRank.find();
  const deptByName = (name) => departments.find((d) => d.name === name);
  const rankByName = (name) => ranks.find((r) => r.name === name);

  const imageMap = getTeacherImageMap();
  const created = [];
  for (const t of getTeachersData()) {
    const { departmentName, rankName, ...data } = t;
    const teacher = await Teacher.create({
      ...data,
      profileImage: imageMap[data.email] || null,
      departmentId: deptByName(departmentName)?._id || null,
      academicRankId: rankByName(rankName)?._id || null,
      isActive: true,
    });
    created.push({ teacher, departmentName });
  }

  const headAssignments = [
    { dept: 'Journalism Department', email: 'ahmad.zaland@journalism-faculty.edu.af' },
    { dept: 'Media Studies Department', email: 'fatima.ahmadi@journalism-faculty.edu.af' },
    { dept: 'Public Relations Department', email: 'sara.noori@journalism-faculty.edu.af' },
  ];

  for (const { dept, email } of headAssignments) {
    const department = deptByName(dept);
    const head = created.find((c) => c.teacher.email === email)?.teacher;
    if (department && head) {
      await Department.findByIdAndUpdate(department._id, { headId: head._id });
    }
  }

  logSuccess(`✅ Seeded ${created.length} teachers`);
};

const seedTeacherImages = async () => {
  writeTeacherPortraitFiles();
  const imageMap = getTeacherImageMap();
  let updated = 0;

  for (const [email, profileImage] of Object.entries(imageMap)) {
    const result = await Teacher.findOneAndUpdate(
      { email },
      { profileImage },
      { new: true }
    );
    if (result) updated += 1;
  }

  logSuccess(`✅ Teacher profile images ready (${updated} teachers updated)`);
};

const seedCourses = async () => {
  if ((await Course.countDocuments()) > 0) {
    logWarning('Courses already exist. Skipping...');
    return;
  }

  const departments = await Department.find();
  const teachers = await Teacher.find();
  const deptByName = (name) => departments.find((d) => d.name === name);
  const teacherByEmail = (email) => teachers.find((t) => t.email === email);

  const courses = getCoursesData().map((c) => {
    const { departmentName, teacherEmail, ...data } = c;
    return {
      ...data,
      departmentId: deptByName(departmentName)?._id || null,
      teacherId: teacherByEmail(teacherEmail)?._id || null,
      isActive: true,
    };
  });

  await Course.insertMany(courses);
  logSuccess(`✅ Seeded ${courses.length} courses`);
};

const seedNews = async () => {
  if ((await News.countDocuments()) > 0) {
    logWarning('News already exist. Skipping...');
    return;
  }

  const newsItems = sampleNews.map((item, index) => ({
    ...item,
    slug: `${slugify(item.title)}-${index + 1}`,
    publishedAt: new Date(Date.now() - index * 7 * 24 * 60 * 60 * 1000),
    isPublished: true,
  }));

  await News.insertMany(newsItems);
  logSuccess(`✅ Seeded ${newsItems.length} news articles (${newsItems.filter((n) => n.featured).length} featured)`);
};

const seedMonographs = async () => {
  if ((await Monograph.countDocuments()) > 0) {
    logWarning('Monographs already exist. Skipping...');
    return;
  }

  const departments = await Department.find();
  const deptByName = (name) => departments.find((d) => d.name === name);

  const monographs = getMonographsData().map((m) => {
    const { departmentName, ...data } = m;
    return {
      ...data,
      departmentId: deptByName(departmentName)?._id || null,
      isPublished: true,
      degree: 'Bachelor',
    };
  });

  await Monograph.insertMany(monographs);
  logSuccess(`✅ Seeded ${monographs.length} monographs`);
};

const seedContact = async () => {
  if (await Contact.findOne()) {
    logWarning('Contact information already exists. Skipping...');
    return;
  }
  await Contact.create(defaultContact);
  logSuccess('✅ Seeded default contact information');
};

const seedAbout = async () => {
  if (await About.findOne()) {
    logWarning('About information already exists. Skipping...');
    return;
  }
  await About.create(defaultAbout);
  logSuccess('✅ Seeded default about information');
};

const clearDatabase = async () => {
  logWarning('⚠️  Clearing all data from the database...');
  await Monograph.deleteMany({});
  await News.deleteMany({});
  await Course.deleteMany({});
  await Teacher.deleteMany({});
  await Department.deleteMany({});
  await AcademicRank.deleteMany({});
  await Contact.deleteMany({});
  await About.deleteMany({});
  await Admin.deleteMany({});
  logSuccess('✅ Database cleared');
};

const seedDatabase = async () => {
  logInfo('🌱 Starting database seeding...');
  logInfo('================================');

  await connectDB();

  await seedAcademicRanks();
  await seedDefaultAdmin();
  await seedDepartments();
  await seedTeachers();
  await seedTeacherImages();
  await seedCourses();
  await seedNews();
  await seedMonographs();
  await seedContact();
  await seedAbout();

  logInfo('================================');
  logSuccess('✅ Database seeding completed successfully!');
  logInfo('');
  logInfo('Admin login: superadmin / Admin@123456');
  logInfo('Start backend: npm run dev');
  logInfo('');
};

const runSeed = async () => {
  try {
    await seedDatabase();
    process.exit(0);
  } catch (error) {
    logError('❌ Database seeding failed:', error.message);
    console.error(error);
    process.exit(1);
  }
};

const args = process.argv.slice(2);

if (args.includes('--reset')) {
  (async () => {
    try {
      await connectDB();
      await clearDatabase();
      await seedDatabase();
      process.exit(0);
    } catch (error) {
      logError('❌ Reset failed:', error.message);
      console.error(error);
      process.exit(1);
    }
  })();
} else if (args.includes('--clear')) {
  (async () => {
    try {
      await connectDB();
      await clearDatabase();
      process.exit(0);
    } catch (error) {
      logError('❌ Database clearing failed:', error.message);
      process.exit(1);
    }
  })();
} else {
  runSeed();
}
