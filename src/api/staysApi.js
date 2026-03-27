import axiosInstance from "../api/axiosInstance";

/**
 * Fetch all stays.
 * @returns {Promise<Object>} - The response data from the server.
 */
export const getStays = async () => {
  try {
    const response = await axiosInstance.get("/stays");
    return response.data;
  } catch (error) {
    console.error("API Error (getStays):", error);
    throw error.response?.data || error;
  }
};

/**
 * Fetch a single stay by ID.
 * @param {string} stayId - The ID of the stay to fetch.
 * @returns {Promise<Object>} - The response data from the server.
 */
export const getStayById = async (stayId) => {
  try {
    const response = await axiosInstance.get(`/stays/${stayId}`);
    return response.data;
  } catch (error) {
    console.error("API Error (getStayById):", error);
    throw error.response?.data || error;
  }
};

/**
 * Create a new stay.
 * @param {FormData} formData - FormData containing stay data including images.
 * @returns {Promise<Object>} - The response data from the server.
 */
export const createStay = async (formData) => {
  try {
    const response = await axiosInstance.post("/stays", formData);
    return response.data;
  } catch (error) {
    console.error("API Error (createStay):", error);
    throw error.response?.data || error;
  }
};

/**
 * Update an existing stay.
 * @param {string} stayId - The ID of the stay to update.
 * @param {FormData} formData - FormData containing stay update data including images.
 * @returns {Promise<Object>} - The response data from the server.
 */
export const updateStay = async (stayId, formData) => {
  try {
    const response = await axiosInstance.put(`/stays/${stayId}`, formData);
    return response.data;
  } catch (error) {
    console.error("API Error (updateStay):", error);
    throw error.response?.data || error;
  }
};

/**
 * Delete a stay by ID.
 * @param {string} stayId - The ID of the stay to delete.
 * @returns {Promise<Object>} - The response data from the server.
 */
export const deleteStay = async (stayId) => {
  try {
    const response = await axiosInstance.delete(`/stays/${stayId}`);
    return response.data;
  } catch (error) {
    console.error("API Error (deleteStay):", error);
    throw error.response?.data || error;
  }
};
