#!/usr/bin/env node
/**
 * Quick smoke test for public + authenticated API routes.
 * Run: node back/src/scripts/test-apis.js
 */

const BASE = process.env.API_BASE || 'http://localhost:3001/api/v1';

const results = [];

const record = (name, ok, detail = '') => {
  results.push({ name, ok, detail });
  const mark = ok ? 'PASS' : 'FAIL';
  console.log(`${mark} ${name}${detail ? ` — ${detail}` : ''}`);
};

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = text;
  }
  return { status: res.status, body };
}

async function main() {
  console.log(`Testing API at ${BASE}\n`);

  const health = await request('/health');
  record('GET /health', health.status === 200);

  for (const path of ['/about', '/contact', '/departments?limit=1', '/courses?limit=1', '/teachers?limit=1', '/news?limit=1', '/monographs?limit=1', '/news/featured?limit=3']) {
    const res = await request(path);
    record(`GET ${path.split('?')[0]}`, res.status === 200, String(res.status));
  }

  const login = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: 'superadmin', password: 'Admin@123456' }),
  });
  record('POST /auth/login', login.status === 200, String(login.status));

  const token = login.body?.data?.accessToken;
  const refresh = login.body?.data?.refreshToken;
  if (!token) {
    console.log('\nCannot continue authenticated tests without token.');
    process.exit(1);
  }

  const authHeaders = { Authorization: `Bearer ${token}` };

  const profile = await request('/auth/profile', { headers: authHeaders });
  record('GET /auth/profile', profile.status === 200, String(profile.status));

  const contactPut = await request('/contact', {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({
      phoneNumber: '+93 700 000 001',
      whatsapp: '+93 700 000 001',
      email: 'admin@journalism-faculty.edu',
      address: 'Kandahar University Campus, Kandahar, Afghanistan',
      workingHours: 'Sun-Thu 8:00-16:00',
      facebookUrl: 'https://facebook.com/ku.journalism',
    }),
  });
  record('PUT /contact', contactPut.status === 200, String(contactPut.status));

  const aboutPut = await request('/about', {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({
      facultyDescription: 'Updated faculty description for API smoke test validation.',
      facultyVision: 'Updated vision statement for journalism education excellence.',
      facultyMission: 'Updated mission statement for ethical journalism training.',
      requirements: ['Baccalaureate certificate', 'Kankor exam pass'],
    }),
  });
  record('PUT /about', aboutPut.status === 200, String(aboutPut.status));

  const refreshRes = await request('/auth/refresh-token', {
    method: 'POST',
    body: JSON.stringify({ refreshToken: refresh }),
  });
  record('POST /auth/refresh-token', refreshRes.status === 200, String(refreshRes.status));

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  if (failed.length) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
