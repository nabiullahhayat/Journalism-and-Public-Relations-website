import { STORAGE_KEYS, getSingleton, setSingleton } from '../storage/db.js';
import { delay, success } from '../storage/helpers.js';

export const aboutAPI = {
  get: async () => {
    await delay();
    const about = getSingleton(STORAGE_KEYS.ABOUT);
    return success('About information retrieved', about);
  },

  update: async (data) => {
    await delay();
    const current = getSingleton(STORAGE_KEYS.ABOUT) || {};
    const updated = setSingleton(STORAGE_KEYS.ABOUT, {
      ...current,
      ...data,
      updatedAt: new Date().toISOString(),
    });
    return success('About information updated successfully', updated);
  },
};
