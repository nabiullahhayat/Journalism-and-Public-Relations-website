import { createId, slugify } from './helpers.js';

const now = () => new Date().toISOString();

export const buildSeedData = () => {
  const ranks = [
    { id: createId(), name: 'Professor', level: 7 },
    { id: createId(), name: 'Associate Professor', level: 6 },
    { id: createId(), name: 'Assistant Professor', level: 5 },
    { id: createId(), name: 'Senior Lecturer', level: 4 },
    { id: createId(), name: 'Lecturer', level: 3 },
  ];

  const rankByName = (name) => ranks.find((r) => r.name === name)?.id || null;

  const departments = [
    {
      id: createId(),
      name: 'Journalism Department',
      code: 'JRN',
      description: 'Print, digital, and broadcast journalism — training reporters, editors, and newsroom leaders with strong ethical foundations.',
      email: 'journalism@kandahar-university.edu.af',
      phone: '+93-30-111-1001',
      location: 'Building A, 2nd Floor, Kandahar University',
      vision: 'To be the leading journalism education center in southern Afghanistan.',
      mission: 'To educate ethical journalists equipped for modern newsrooms and digital media.',
      objectives: ['Investigative reporting skills', 'Multimedia storytelling', 'Media law and ethics'],
      isActive: true,
      headId: null,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: createId(),
      name: 'Media Studies Department',
      code: 'MST',
      description: 'Media theory, digital culture, audience analysis, and the social impact of communication technologies.',
      email: 'media@kandahar-university.edu.af',
      phone: '+93-30-111-1002',
      location: 'Building B, 1st Floor, Kandahar University',
      vision: 'To advance critical media literacy and research in the region.',
      mission: 'To provide comprehensive media studies education and research opportunities.',
      objectives: ['Media literacy', 'Digital culture studies', 'Communication research methods'],
      isActive: true,
      headId: null,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: createId(),
      name: 'Public Relations Department',
      code: 'PR',
      description: 'Strategic communication, corporate messaging, crisis communication, and public affairs.',
      email: 'pr@kandahar-university.edu.af',
      phone: '+93-30-111-1003',
      location: 'Building A, 3rd Floor, Kandahar University',
      vision: 'To develop professional communicators who serve the public interest.',
      mission: 'To train PR specialists in strategic planning, writing, and stakeholder engagement.',
      objectives: ['Strategic communication', 'Crisis management', 'Public affairs writing'],
      isActive: true,
      headId: null,
      createdAt: now(),
      updatedAt: now(),
    },
  ];

  const deptByName = (name) => departments.find((d) => d.name === name);

  const teachers = [
    { name: 'Dr. Ahmad Shah Zaland', email: 'ahmad.zaland@journalism-faculty.edu.af', phone: '+93-70-111-0001', city: 'Kandahar', schoolName: 'Mirwais Hotaki High School', schoolGraduationYear: 2002, bachelorUniversity: 'Kandahar University', bachelorGraduationYear: 2006, masterCountry: 'Afghanistan', masterUniversity: 'Kabul University', masterGraduationYear: 2010, masterThesis: 'Investigative Journalism in Post-Conflict Afghanistan', bio: 'Specializes in investigative reporting and media ethics.', departmentName: 'Journalism Department', rankName: 'Professor', researchPapers: [{ title: 'Press Freedom in Afghanistan', year: 2021, journal: 'Asian Journalism Review' }] },
    { name: 'Dr. Fatima Ahmadi', email: 'fatima.ahmadi@journalism-faculty.edu.af', phone: '+93-70-111-0002', city: 'Kandahar', schoolName: 'Aisha Siddiqa High School', schoolGraduationYear: 2004, bachelorUniversity: 'Herat University', bachelorGraduationYear: 2008, masterCountry: 'Pakistan', masterUniversity: 'University of Karachi', masterGraduationYear: 2012, masterThesis: 'Women in Afghan Media', bio: 'Research focus on gender representation in media.', departmentName: 'Media Studies Department', rankName: 'Associate Professor', researchPapers: [{ title: 'Gender and Media in Afghanistan', year: 2022, journal: 'Media Culture Journal' }] },
    { name: 'Mohammad Omar Hotaki', email: 'mohammad.hotaki@journalism-faculty.edu.af', phone: '+93-70-111-0003', city: 'Kandahar', schoolName: 'Kandahar High School', schoolGraduationYear: 2008, bachelorUniversity: 'Kandahar University', bachelorGraduationYear: 2012, masterCountry: 'Afghanistan', masterUniversity: 'Kabul University', masterGraduationYear: 2016, masterThesis: 'Digital News Consumption Among Afghan Youth', bio: 'Teaches multimedia journalism and social media reporting.', departmentName: 'Journalism Department', rankName: 'Assistant Professor', researchPapers: [{ title: 'Mobile Journalism in Rural Areas', year: 2023, journal: 'Digital Media Studies' }] },
    { name: 'Sara Noori', email: 'sara.noori@journalism-faculty.edu.af', phone: '+93-70-111-0004', city: 'Kandahar', schoolName: 'Malalai High School', schoolGraduationYear: 2010, bachelorUniversity: 'Kandahar University', bachelorGraduationYear: 2014, bio: 'PR practitioner with experience in NGO communication.', departmentName: 'Public Relations Department', rankName: 'Senior Lecturer', researchPapers: [] },
    { name: 'Haji Gul Ahmad', email: 'gul.ahmad@journalism-faculty.edu.af', phone: '+93-70-111-0005', city: 'Kandahar', schoolName: 'Ahmad Shah Baba High School', schoolGraduationYear: 1998, bachelorUniversity: 'Kabul University', bachelorGraduationYear: 2002, bio: 'Veteran broadcast journalist with 20 years of experience.', departmentName: 'Journalism Department', rankName: 'Senior Lecturer', researchPapers: [{ title: 'Community Radio in Southern Afghanistan', year: 2019, journal: 'Broadcast Quarterly' }] },
    { name: 'Zainab Karimi', email: 'zainab.karimi@journalism-faculty.edu.af', phone: '+93-70-111-0006', city: 'Kandahar', schoolName: 'Kandahar Girls High School', schoolGraduationYear: 2012, bachelorUniversity: 'Kandahar University', bachelorGraduationYear: 2016, masterCountry: 'India', masterUniversity: 'Jamia Millia Islamia', masterGraduationYear: 2019, masterThesis: 'Social Media and Political Communication', bio: 'Teaches media theory and data journalism basics.', departmentName: 'Media Studies Department', rankName: 'Lecturer', researchPapers: [{ title: 'Social Media Literacy Among Students', year: 2024, journal: 'Communication Education' }] },
  ].map((t) => {
    const { departmentName, rankName, ...rest } = t;
    return {
      id: createId(),
      ...rest,
      whatsapp: rest.phone,
      profileImage: null,
      departmentId: deptByName(departmentName)?.id || null,
      academicRankId: rankByName(rankName),
      professionalCertificates: [],
      classes: [],
      isActive: true,
      createdAt: now(),
      updatedAt: now(),
    };
  });

  const teacherByEmail = (email) => teachers.find((t) => t.email === email);

  departments[0].headId = teacherByEmail('ahmad.zaland@journalism-faculty.edu.af')?.id || null;
  departments[1].headId = teacherByEmail('fatima.ahmadi@journalism-faculty.edu.af')?.id || null;
  departments[2].headId = teacherByEmail('sara.noori@journalism-faculty.edu.af')?.id || null;

  const courses = [
    { name: 'Introduction to Journalism', code: 'JRN-101', description: 'Foundations of news writing, reporting ethics, and the role of journalism in democracy.', level: 'bachelor', semester: 1, credits: 3, departmentName: 'Journalism Department', teacherEmail: 'ahmad.zaland@journalism-faculty.edu.af' },
    { name: 'News Writing & Reporting', code: 'JRN-201', description: 'Hands-on reporting assignments covering campus and community stories.', level: 'bachelor', semester: 3, credits: 4, departmentName: 'Journalism Department', teacherEmail: 'mohammad.hotaki@journalism-faculty.edu.af' },
    { name: 'Broadcast Journalism', code: 'JRN-301', description: 'Television and radio news production, scripting, and on-air presentation.', level: 'bachelor', semester: 5, credits: 4, departmentName: 'Journalism Department', teacherEmail: 'gul.ahmad@journalism-faculty.edu.af' },
    { name: 'Media Theory & Society', code: 'MST-101', description: 'Critical analysis of media systems, audiences, and cultural impact.', level: 'bachelor', semester: 2, credits: 3, departmentName: 'Media Studies Department', teacherEmail: 'fatima.ahmadi@journalism-faculty.edu.af' },
    { name: 'Digital Media Production', code: 'MST-201', description: 'Creating multimedia content for web and social platforms.', level: 'bachelor', semester: 4, credits: 4, departmentName: 'Media Studies Department', teacherEmail: 'zainab.karimi@journalism-faculty.edu.af' },
    { name: 'Principles of Public Relations', code: 'PR-101', description: 'Introduction to PR planning, messaging, and stakeholder communication.', level: 'bachelor', semester: 1, credits: 3, departmentName: 'Public Relations Department', teacherEmail: 'sara.noori@journalism-faculty.edu.af' },
    { name: 'Crisis Communication', code: 'PR-301', description: 'Managing organizational reputation during emergencies.', level: 'bachelor', semester: 5, credits: 3, departmentName: 'Public Relations Department', teacherEmail: 'sara.noori@journalism-faculty.edu.af' },
    { name: 'Media Law & Ethics', code: 'JRN-302', description: 'Legal frameworks, defamation, privacy, and professional codes.', level: 'bachelor', semester: 6, credits: 3, departmentName: 'Journalism Department', teacherEmail: 'ahmad.zaland@journalism-faculty.edu.af' },
  ].map((c) => {
    const { departmentName, teacherEmail, ...rest } = c;
    return {
      id: createId(),
      ...rest,
      details: null,
      type: 'required',
      time: null,
      departmentId: deptByName(departmentName)?.id || null,
      teacherId: teacherByEmail(teacherEmail)?.id || null,
      isActive: true,
      createdAt: now(),
      updatedAt: now(),
    };
  });

  const newsItems = [
    { title: 'Faculty Welcomes New Class of Journalism Students', description: 'Over 120 new students enrolled for the 2025 academic year.', content: 'The Faculty officially welcomed more than 120 new students during an orientation ceremony on campus.', excerpt: 'More than 120 new students join journalism and PR programs this semester.', category: 'academic', author: 'Faculty Administration', featured: true, status: 'published', tags: ['admissions', 'students'] },
    { title: 'Student Newspaper Wins Regional Media Award', description: 'The campus student publication received recognition for outstanding community reporting.', content: 'Kandahar University\'s student-run newspaper was honored at the Regional Student Media Awards.', excerpt: 'Campus newspaper recognized for community investigative reporting.', category: 'achievement', author: 'Communications Office', featured: true, status: 'published', tags: ['students', 'awards'] },
    { title: 'International Media Workshop Held on Campus', description: 'Visiting journalists conducted a three-day workshop on digital storytelling.', content: 'Journalists led workshops covering mobile reporting, video editing, and social media verification.', excerpt: 'Three-day workshop on digital storytelling attracts 80 participants.', category: 'event', author: 'Events Committee', featured: true, status: 'published', tags: ['workshop', 'digital media'] },
    { title: 'Research Seminar on Press Freedom in Afghanistan', description: 'Faculty members presented latest research findings on media independence.', content: 'The Media Studies Department hosted a research seminar examining press freedom trends.', excerpt: 'Faculty research seminar explores press freedom and journalist safety.', category: 'research', author: 'Research Office', featured: false, status: 'published', tags: ['research', 'press freedom'] },
    { title: 'PR Students Launch Community Awareness Campaign', description: 'Public relations students designed a campaign promoting literacy in rural districts.', content: 'Students partnered with local NGOs to create a multi-channel awareness campaign.', excerpt: 'PR students apply classroom skills to community literacy campaign.', category: 'general', author: 'PR Department', featured: false, status: 'published', tags: ['PR', 'community'] },
  ].map((item, index) => ({
    id: createId(),
    ...item,
    image: null,
    slug: `${slugify(item.title)}-${index + 1}`,
    publishedAt: new Date(Date.now() - index * 7 * 24 * 60 * 60 * 1000).toISOString(),
    isPublished: true,
    views: 0,
    createdAt: now(),
    updatedAt: now(),
  }));

  const monographs = [
    { studentName: 'Abdul Basir Popal', supervisor: 'Dr. Ahmad Shah Zaland', year: 2024, issue: 'The Role of Social Media in Shaping Public Opinion in Kandahar', title: 'Social Media and Public Opinion in Kandahar Province', abstract: 'This study examines how Facebook and Telegram influence political discourse.', grade: 'A', departmentName: 'Media Studies Department' },
    { studentName: 'Maryam Safi', supervisor: 'Dr. Fatima Ahmadi', year: 2024, issue: 'Women Journalists in Afghan Media', title: 'Women in Afghan Journalism', abstract: 'An analysis of barriers and achievements for women in Afghan newsrooms.', grade: 'A', departmentName: 'Journalism Department' },
    { studentName: 'Hamidullah Stanikzai', supervisor: 'Mohammad Omar Hotaki', year: 2023, issue: 'Mobile Journalism Practices Among Afghan Reporters', title: 'Mobile Journalism in Afghanistan', abstract: 'Explores adoption of smartphone-based reporting tools.', grade: 'A', departmentName: 'Journalism Department' },
    { studentName: 'Khadija Rahimi', supervisor: 'Sara Noori', year: 2023, issue: 'NGO Communication Strategies in Humanitarian Crises', title: 'NGO Crisis Communication', abstract: 'Evaluates messaging strategies used by NGOs during emergency relief.', grade: 'B', departmentName: 'Public Relations Department' },
  ].map((m) => {
    const { departmentName, ...rest } = m;
    return {
      id: createId(),
      ...rest,
      documentUrl: null,
      pages: null,
      degree: 'bachelor',
      departmentId: deptByName(departmentName)?.id || null,
      isPublished: true,
      downloads: 0,
      keywords: [],
      createdAt: now(),
      updatedAt: now(),
    };
  });

  const admins = [
    {
      id: createId(),
      username: 'superadmin',
      email: 'admin@journalism-faculty.edu',
      password: 'Admin@123456',
      fullName: 'System Administrator',
      role: 'superadmin',
      phone: '+93-70-000-0000',
      departmentId: null,
      isActive: true,
      createdAt: now(),
      updatedAt: now(),
    },
  ];

  const about = {
    id: createId(),
    facultyDescription: 'The Faculty of Journalism and Public Relations at Kandahar University prepares students for careers in news media, digital communication, and public affairs.\n\nSince our founding, we have combined classroom instruction with practical newsroom experience.',
    facultyVision: 'To be a nationally recognized center of excellence in journalism education, ethical reporting, and strategic communication.',
    facultyMission: 'We provide rigorous academic programs, foster critical thinking, and prepare graduates who serve the public through truthful, responsible communication.',
    requirements: [
      'Deliver accredited journalism and PR degree programs',
      'Promote press freedom and ethical reporting standards',
      'Support faculty research and student publications',
      'Partner with media organizations for internships and training',
    ],
    updatedAt: now(),
  };

  const contact = {
    id: createId(),
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
    mapEmbedUrl: '',
    updatedAt: now(),
  };

  return { ranks, departments, teachers, courses, newsItems, monographs, admins, about, contact };
};
