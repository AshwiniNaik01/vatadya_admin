import axiosInstance from "./axiosInstance";

/**
 * fetch all slots.
 * @returns {Promise<Object>} - The response data from the server.
 **/
export const getAllContacts = async () => {
  try {
    const response = await axiosInstance.get("/contact/all");
    return response.data;
  } catch (error) {
    console.error("API Error (getAllContacts):", error);
    throw error.response?.data || error;
  }
};
