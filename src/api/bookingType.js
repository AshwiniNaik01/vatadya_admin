import axiosInstance from "../api/axiosInstance"; // adjust path as needed

/**
 * Fetches all booking types.
 * @returns {Promise<Object>} - The response from the server.
 */
export const getAllBookingTypes = async () => {
  try {
    const response = await axiosInstance.get("/bookingType");
    return response.data;
  } catch (error) {
    console.error("API Error (getAllBookingTypes):", error);
    throw error.response?.data || error;
  }
};

/**
 * Creates multiple booking types by posting each one individually.
 * @param {string[]} names - Array of trek type names to create.
 * @returns {Promise<Object[]>} - Array of created booking type responses.
 */
export const createBookingTypes = async (names) => {
  try {
    const responses = await Promise.all(
      names.map((name) =>
        axiosInstance.post("/bookingType", { name, isActive: true }),
      ),
    );
    return responses.map((res) => res.data);
  } catch (error) {
    console.error("API Error (createBookingTypes):", error);
    throw error.response?.data || error;
  }
};

/**
 * Updates an existing booking type by ID.
 * @param {string} id - The booking type ID.
 * @param {Object} payload - The updated data ({ name, isActive }).
 * @returns {Promise<Object>} - The response from the server.
 */
export const updateBookingType = async (id, payload) => {
  try {
    const response = await axiosInstance.put(`/bookingType/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("API Error (updateBookingType):", error);
    throw error.response?.data || error;
  }
};

/**
 * Deactivates a booking type by ID.
 * @param {string} id - The booking type ID.
 * @returns {Promise<Object>} - The response from the server.
 */
export const deactivateBookingType = async (id) => {
  try {
    const response = await axiosInstance.put(`/bookingType/${id}/deactivate`);
    return response.data;
  } catch (error) {
    console.error("API Error (deactivateBookingType):", error);
    throw error.response?.data || error;
  }
};

/**
 * Deletes a booking trek by ID.
 * @param {String} id - The ID of the booking to delete.
 */
export const deleteBookingType = async (id) => {
  try {
    const response = await axiosInstance.delete(`/bookingType/${id}`);
    return response.data;
  } catch (error) {
    console.error("API Error (deleteBooking):", error);
    throw error.response?.data || error;
  }
};
