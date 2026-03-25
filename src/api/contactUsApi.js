import axiosInstance from "./axiosInstance";

/**
 * Submits Contact Us form data.
 * @param {Object} data - The contact form payload.
 */
export const AddContactUs = async (data) => {
  try {
    const response = await axiosInstance.post(`/contact-us`, data);
    return response.data;
  } catch (error) {
    console.error("API Error (postContactUs):", error);
    throw error.response?.data || error;
  }
};

/**
 * Fetches Contact Us data (messages or info).
 */
export const getContactUs = async () => {
  try {
    const response = await axiosInstance.get(`/contact-us`);
    return response.data;
  } catch (error) {
    console.error("API Error (getContactUs):", error);
    throw error.response?.data || error;
  }
};
