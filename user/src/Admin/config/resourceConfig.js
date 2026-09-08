import { FiHome, FiInfo, FiLayers, FiBookOpen, FiUsers, FiBell, FiFileText } from 'react-icons/fi'

export const sidebarLinks = [
  { key: 'dashboard', label: 'Dashboard', icon: FiHome, path: '/admin' },
  { key: 'about', label: 'About', icon: FiInfo, path: '/admin/about' },
  { key: 'departaments', label: 'Departments', icon: FiLayers, path: '/admin/departaments' },
  { key: 'courses', label: 'Courses', icon: FiBookOpen, path: '/admin/courses' },
  { key: 'teachers', label: 'Teachers', icon: FiUsers, path: '/admin/teachers' },
  { key: 'news', label: 'News', icon: FiBell, path: '/admin/news' },
  { key: 'monographs', label: 'Monographs', icon: FiFileText, path: '/admin/monographs' },
]

export const resourceMap = {
  about: {
    key: 'about',
    label: 'About',
    description: 'Faculty overview and mission content',
    path: 'about',
    backend: true,
    listPath: '',
    fields: [
      { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Write the about description...' },
    ],
    searchFields: ['description'],
  },

  departaments: {
    key: 'departaments',
    label: 'Departments',
    description: 'Department management for the faculty',
    path: 'departaments',
    backend: true,
    fields: [
      { name: 'name', label: 'Department Name', type: 'text', placeholder: 'Enter department name' },
      { name: 'details', label: 'Details', type: 'textarea', placeholder: 'Describe the department' },
      { name: 'subjects', label: 'Subjects', type: 'textarea', placeholder: 'List covered subjects' },
      { name: 'courses', label: 'Courses', type: 'textarea', placeholder: 'List department courses' },
    ],
    searchFields: ['name', 'details', 'subjects', 'courses'],
  },

  courses: {
    key: 'courses',
    label: 'Courses',
    description: 'Manage faculty course offerings',
    path: 'courses',
    backend: true,
    fields: [
      { name: 'name', label: 'Course Title', type: 'text', placeholder: 'Enter course title' },
      { name: 'details', label: 'Details', type: 'textarea', placeholder: 'Describe course content' },
      { name: 'teacher', label: 'Teacher', type: 'text', placeholder: 'Instructor name' },
      { name: 'time', label: 'Duration (hours)', type: 'number', placeholder: 'Total class time' },
      { name: 'date', label: 'Start Date', type: 'date' },
    ],
    searchFields: ['name', 'details', 'teacher'],
  },

  teachers: {
    key: 'teachers',
    label: 'Teachers',
    description: 'Faculty and research staff administration',
    path: 'teachers',
    backend: true,
    fields: [
      { name: 'name', label: 'Name', type: 'text', placeholder: 'Teacher full name' },
      { name: 'photo', label: 'Photo URL', type: 'url', placeholder: 'Image URL' },
      { name: 'phone', label: 'Phone', type: 'text', placeholder: 'Mobile number' },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'Email address' },
      { name: 'city', label: 'City', type: 'text', placeholder: 'Home city' },
      { name: 'schoolName', label: 'School Name', type: 'text' },
      { name: 'schoolGraduateYear', label: 'School Graduate Year', type: 'number' },
      { name: 'bachelorUniversityName', label: 'Bachelor University', type: 'text' },
      { name: 'bachelorGraduateYear', label: 'Bachelor Graduate Year', type: 'number' },
      { name: 'masterUniversityName', label: 'Master University', type: 'text' },
      { name: 'masterCountryName', label: 'Master Country', type: 'text' },
      { name: 'masterGraduateYear', label: 'Master Graduate Year', type: 'number' },
      { name: 'researches', label: 'Research Areas', type: 'textarea' },
      { name: 'researchPaperName', label: 'Research Paper', type: 'text' },
      { name: 'chapterName', label: 'Chapter Title', type: 'text' },
      { name: 'professionalCertificateName', label: 'Professional Certificate', type: 'text' },
      { name: 'departmentName', label: 'Department', type: 'text' },
      { name: 'classesName', label: 'Classes', type: 'textarea' },
      { name: 'whatsappNumber', label: 'WhatsApp Number', type: 'text' },
    ],
    searchFields: ['name', 'email', 'departmentName', 'researches'],
  },

  news: {
    key: 'news',
    label: 'News',
    description: 'Faculty news and announcements content',
    path: 'news',
    backend: true,
    fields: [
      { name: 'description', label: 'Description', type: 'textarea', placeholder: 'News details' },
      { name: 'image', label: 'Image URL', type: 'url', placeholder: 'Cover image URL' },
    ],
    searchFields: ['description'],
  },

  monographs: {
    key: 'monographs',
    label: 'Monographs',
    description: 'Supervised student research projects',
    path: 'monographs',
    backend: true,
    fields: [
      { name: 'student', label: 'Student Name', type: 'text', placeholder: 'Student full name' },
      { name: 'department', label: 'Department', type: 'text', placeholder: 'Department name' },
      { name: 'supervisor', label: 'Supervisor', type: 'text', placeholder: 'Supervisor name' },
      { name: 'issue', label: 'Issue', type: 'textarea', placeholder: 'Research issue' },
    ],
    searchFields: ['student', 'department', 'supervisor', 'issue'],
  },

  misson: {
    key: 'misson',
    label: 'Mission',
    description: 'Faculty mission statement management',
    path: 'misson',
    backend: true,
    fields: [
      { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Write mission statement' },
    ],
    searchFields: ['description'],
  },

  vision: {
    key: 'vision',
    label: 'Vision',
    description: 'Faculty vision statement management',
    path: 'vision',
    backend: true,
    fields: [
      { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Write vision statement' },
    ],
    searchFields: ['description'],
  },

  strategicplan: {
    key: 'strategicplan',
    label: 'Strategic Plan',
    description: 'Strategic plan documents and timelines',
    path: 'strategicplan',
    backend: true,
    fields: [
      { name: 'fileUrl', label: 'File URL', type: 'url', placeholder: 'Link to plan document' },
    ],
    searchFields: ['fileUrl'],
  },

  schadule: {
    key: 'schadule',
    label: 'Schedule',
    description: 'Class schedule and resource management',
    path: 'schadule',
    backend: true,
    fields: [
      { name: 'fileUrl', label: 'File URL', type: 'url', placeholder: 'Schedule file URL' },
    ],
    searchFields: ['fileUrl'],
  }}