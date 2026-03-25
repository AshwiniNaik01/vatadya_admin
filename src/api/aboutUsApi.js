import axiosInstance from "./axiosInstance";

/**
 * Creates About Us content.
 * @param {Object} data - The About Us data payload.
 */
export const AddAboutUs = async (data) => {
  try {
    const response = await axiosInstance.post(`/about-us`, data);
    return response.data;
  } catch (error) {
    console.error("API Error (postAboutUs):", error);
    throw error.response?.data || error;
  }
};

/**
 * Fetches About Us content.
 */
export const getAboutUs = async () => {
  try {
    const response = await axiosInstance.get(`/about-us`);
    return response.data;
  } catch (error) {
    console.error("API Error (getAboutUs):", error);
    throw error.response?.data || error;
  }
};
