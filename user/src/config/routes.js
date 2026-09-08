export const KANDAHAR_UNIVERSITY_URL = 'https://kdru.edu.af/';

export const DEVELOPER_NAME = 'Eng Nabiullah Hayat';

export const ADMIN_ROUTES = {
  login: '/login',
  dashboard: '/dashboard',
  admins: '/dashboard/admins',
  departments: '/dashboard/departments',
  courses: '/dashboard/courses',
  teachers: '/dashboard/teachers',
  news: '/dashboard/news',
  monographs: '/dashboard/monographs',
  about: '/dashboard/about',
  contact: '/dashboard/contact',
  profile: '/dashboard/profile',
  settings: '/dashboard/settings',
};

/** Paths that require auth session initialization */
export const needsAuthInit = (pathname) => pathname.startsWith('/dashboard');

/** Protected admin pages (401 redirect target) */
export const isProtectedAdminPath = (pathname) => pathname.startsWith('/dashboard');
