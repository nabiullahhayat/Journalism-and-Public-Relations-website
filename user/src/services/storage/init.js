import { STORAGE_KEYS } from './keys.js';
import { setCollection, setSingleton } from './db.js';
import { buildSeedData } from './seedData.js';

export const initStorage = () => {
  if (localStorage.getItem(STORAGE_KEYS.META)) {
    return false;
  }

  const seed = buildSeedData();

  setCollection(STORAGE_KEYS.ACADEMIC_RANKS, seed.ranks);
  setCollection(STORAGE_KEYS.ADMINS, seed.admins);
  setCollection(STORAGE_KEYS.DEPARTMENTS, seed.departments);
  setCollection(STORAGE_KEYS.TEACHERS, seed.teachers);
  setCollection(STORAGE_KEYS.COURSES, seed.courses);
  setCollection(STORAGE_KEYS.NEWS, seed.newsItems);
  setCollection(STORAGE_KEYS.MONOGRAPHS, seed.monographs);
  setCollection(STORAGE_KEYS.MESSAGES, []);
  setSingleton(STORAGE_KEYS.ABOUT, seed.about);
  setSingleton(STORAGE_KEYS.CONTACT, seed.contact);

  localStorage.setItem(STORAGE_KEYS.META, JSON.stringify({
    version: 1,
    seededAt: new Date().toISOString(),
  }));

  return true;
};

export const resetStorage = () => {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  return initStorage();
};
