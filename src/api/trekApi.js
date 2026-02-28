import axiosInstance from "./axiosInstance";

/**
 * Creates a new trek in the database.
 * @param {Object} trekData - The trek data to be sent to the server.
 * @returns {Promise<Object>} - The response from the server.
 */
export const createTrek = async (trekData) => {
    try {
        const response = await axiosInstance.post("/trek", trekData);
        return response.data;
    } catch (error) {
        console.error("API Error (createTrek):", error);
        throw error.response?.data || error;
    }
};

/**
 * Fetches all trek categories.
 * @returns {Promise<Array>} - List of categories.
 */
export const getCategories = async () => {
    try {
        const response = await axiosInstance.get("/trek-categories");
        // Check if response is wrapped in { data: ... }
        return response.data.data || response.data;
    } catch (error) {
        console.error("API Error (getCategories):", error);
        throw error.response?.data || error;
    }
};

/**
 * Fetches all treks.
 * @returns {Promise<Object>} - Response containing trek data.
 */
export const getTreks = async () => {
    try {
        const response = await axiosInstance.get("/trek");
        return response.data;
    } catch (error) {
        console.error("API Error (getTreks):", error);
        throw error.response?.data || error;
    }
};

/**
 * Fetches a single trek by ID.
 * @param {String} id - The ID of the trek.
 * @returns {Promise<Object>} - The trek data.
 */
export const getTrekById = async (id) => {
    try {
        const response = await axiosInstance.get(`/trek/${id}`);
        // Unwrap the data object from the response envelope
        return response.data.data || response.data;
    } catch (error) {
        console.error("API Error (getTrekById):", error);
        throw error.response?.data || error;
    }
};

/**
 * Updates a trek by ID.
 * @param {String} id - The ID of the trek.
 * @param {Object} trekData - The updated trek data.
 * @returns {Promise<Object>} - The response from the server.
 */
export const updateTrek = async (id, trekData) => {
    try {
        const response = await axiosInstance.put(`/trek/${id}`, trekData);
        return response.data;
    } catch (error) {
        console.error("API Error (updateTrek):", error);
        throw error.response?.data || error;
    }
};

/**
 * Deletes a trek by ID.
 * @param {String} id - The ID of the trek to delete.
 */
export const deleteTrek = async (id) => {
    try {
        const response = await axiosInstance.delete(`/trek/${id}`);
        return response.data;
    } catch (error) {
        console.error("API Error (deleteTrek):", error);
        throw error.response?.data || error;
    }
};
