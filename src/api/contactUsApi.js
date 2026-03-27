import axiosInstance from "./axiosInstance";

/**
 * Submits Contact Us form data.
 * @param {Object} data - The contact form payload.
 */
// export const AddContactUs = async (data) => {
//   try {
//     const response = await axiosInstance.post(`/contact-us`, data);
//     return response.data;
//   } catch (error) {
//     console.error("API Error (postContactUs):", error);
//     throw error.response?.data || error;
//   }
// };

export const AddContactUs = async (data) => {
  try {
    const response = await axiosInstance.post(`/contact-us`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("API Error (getContactUs):", error);
    throw error.response?.data || error;
  }
};

/**
 * Updates Contact Us data by ID.
 * @param {string|number} id - The ID of the contact entry
 * @param {Object} data - The updated contact data
 */
export const editContactUs = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/contact-us/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("API Error (editContactUs):", error);
    throw error.response?.data || error;
  }
};
