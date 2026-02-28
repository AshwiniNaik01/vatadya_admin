import axiosInstance from "./axiosInstance";

/**
 * add a new slot.
 * @param {FormData} formData - FormData containing slot creation data.
 * @returns {Promise<Object>} - The response data from the server.
 */
export const addSlot = async (FormData) => {
  try {
    const response = await axiosInstance.post("/slots", FormData);
    return response.data;
  } catch (error) {
    console.error("API Error (addSlot):", error);
    throw error.response?.data || error;
  }
};

/**
 * fetch all slots.
 * @returns {Promise<Object>} - The response data from the server.
 **/
export const getAllSlots = async () => {
  try {
    const response = await axiosInstance.get("/slots");
    return response.data;
  } catch (error) {
    console.error("API Error (fetchAllSlots):", error);
    throw error.response?.data || error;
  }
};

/**
 * update an existing slot.
 * @param {string} slotId - The ID of the slot to update.
 * @param {FormData} formData - FormData containing slot update data.
 * @returns {Promise<Object>} - The response data from the server.
 */
export const updateSlot = async (slotId, formData) => {
  try {
    const response = await axiosInstance.put(`/slots/${slotId}`, formData);
    return response.data;
  } catch (error) {
    console.error("API Error (updateSlot):", error);
    throw error.response?.data || error;
  }
};

/**
 * delete a slot.
 * @param {string} slotId - The ID of the slot to delete.
 * @returns {Promise<Object>} - The response data from the server.
 */
export const deleteSlot = async (slotId) => {
  try {
    const response = await axiosInstance.delete(`/slots/${slotId}`);
    return response.data;
  } catch (error) {
    console.error("API Error (deleteSlot):", error);
    throw error.response?.data || error;
  }
};
