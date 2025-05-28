import { subscribersUrl, fetchWrapperService, sanitizeObject, contactsUrl } from '../_helpers';

const getAllContacts = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const respData = await fetchWrapperService.getAll(contactsUrl);
      const contactsData = respData ? Object.values(respData) : [];
      resolve(contactsData);
    } catch (e) {
      reject(e);
    }
  });
};

const deleteContact = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { contactId } = sanitizeObject(params);
      if (contactId) {
        const contactData = await fetchWrapperService.findOne(contactsUrl, {
          id: contactId,
        });
        if (contactData) {
          await fetchWrapperService._delete(`${contactsUrl}/${contactId}`);
          resolve(true);
        } else {
          reject(new Error('Contact not found!'));
        }
      } else {
        reject(new Error('Invalid Id'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

export const contactService = {
  getAllContacts,
  deleteContact,
};
