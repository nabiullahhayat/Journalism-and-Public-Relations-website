import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { UPLOADS_ROOT, UPLOAD_FOLDERS } from '../utils/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEACHER_IMAGES = [
  { email: 'ahmad.zaland@journalism-faculty.edu.af', file: 'ahmad-zaland.svg', initials: 'ASZ', color1: '#C79C78', color2: '#8B6914' },
  { email: 'fatima.ahmadi@journalism-faculty.edu.af', file: 'fatima-ahmadi.svg', initials: 'FA', color1: '#B8860B', color2: '#6B4423' },
  { email: 'mohammad.hotaki@journalism-faculty.edu.af', file: 'mohammad-hotaki.svg', initials: 'MOH', color1: '#A67C52', color2: '#5C4033' },
  { email: 'sara.noori@journalism-faculty.edu.af', file: 'sara-noori.svg', initials: 'SN', color1: '#D4A574', color2: '#967259' },
  { email: 'gul.ahmad@journalism-faculty.edu.af', file: 'gul-ahmad.svg', initials: 'GA', color1: '#9C7B5C', color2: '#4A3728' },
  { email: 'zainab.karimi@journalism-faculty.edu.af', file: 'zainab-karimi.svg', initials: 'ZK', color1: '#C9A882', color2: '#7D5A44' },
];

const buildPortraitSvg = ({ initials, color1, color2 }) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" role="img">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${color1}"/>
      <stop offset="100%" stop-color="${color2}"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bg)"/>
  <circle cx="200" cy="145" r="72" fill="rgba(255,255,255,0.22)"/>
  <ellipse cx="200" cy="330" rx="118" ry="88" fill="rgba(255,255,255,0.18)"/>
  <text x="200" y="52" text-anchor="middle" fill="rgba(255,255,255,0.85)" font-size="13" font-family="Georgia, serif" letter-spacing="4">FACULTY</text>
  <text x="200" y="385" text-anchor="middle" fill="white" font-size="42" font-family="Georgia, serif" font-weight="700">${initials}</text>
</svg>`;

export const writeTeacherPortraitFiles = () => {
  const folder = path.join(UPLOADS_ROOT, UPLOAD_FOLDERS.teachers);
  fs.mkdirSync(folder, { recursive: true });

  TEACHER_IMAGES.forEach(({ file, ...rest }) => {
    fs.writeFileSync(path.join(folder, file), buildPortraitSvg(rest), 'utf8');
  });
};

export const getTeacherImageMap = () =>
  TEACHER_IMAGES.reduce((acc, { email, file }) => {
    acc[email] = `/uploads/teachers/${file}`;
    return acc;
  }, {});

export default TEACHER_IMAGES;
