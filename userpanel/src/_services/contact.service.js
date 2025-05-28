import { apiUrl, sanitizeObject } from "@/_helper";
import axios from "axios";

const sendContactDetails = async (payload) => {
  try {
    const response = await axios.post(
      `${apiUrl}/contact/contact-us`,
      sanitizeObject(payload)
    );
    return response.data;
  } catch (error) {
    return { status: 500, message: error?.message };
  }
};

export const contactService = {
  sendContactDetails,
};
