import { STORAGE_KEYS, getSingleton, setSingleton, createItem } from '../storage/db.js';
import { delay, success } from '../storage/helpers.js';

export const contactAPI = {
  get: async () => {
    await delay();
    const contact = getSingleton(STORAGE_KEYS.CONTACT);
    return success('Contact information retrieved', contact);
  },

  update: async (data) => {
    await delay();
    const current = getSingleton(STORAGE_KEYS.CONTACT) || {};
    const updated = setSingleton(STORAGE_KEYS.CONTACT, {
      ...current,
      ...data,
      updatedAt: new Date().toISOString(),
    });
    return success('Contact information updated successfully', updated);
  },

  sendMessage: async (data) => {
    await delay();
    createItem(STORAGE_KEYS.MESSAGES, {
      ...data,
      read: false,
    });
    return success('Message sent successfully');
  },
};
