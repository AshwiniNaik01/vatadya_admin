import axiosInstance from "./axiosInstance";

/**
 * Creates a new trek category.
 * @param {FormData} categoryData - The category data with image.
 * @returns {Promise<Object>} - The response from the server.
 */
export const createCategory = async (categoryData) => {
    try {
        const response = await axiosInstance.post("/trekCategory", categoryData);
        return response.data;
    } catch (error) {
        console.error("API Error (createCategory):", error);
        throw error.response?.data || error;
    }
};

/**
 * Fetches all trek categories.
 * @returns {Promise<Array>} - List of categories.
 */
export const getAllCategories = async () => {
    try {
        const response = await axiosInstance.get("/trekCategory");
        // According to user response, data is in 'message' field
        return response.data.message || response.data.data || response.data;
    } catch (error) {
        console.error("API Error (getAllCategories):", error);
        throw error.response?.data || error;
    }
};

/**
 * Fetches a single trek category by ID.
 * @param {String} id - The ID of the category.
 * @returns {Promise<Object>} - The category data.
 */
export const getCategoryById = async (id) => {
    try {
        const response = await axiosInstance.get(`/trekCategory/${id}`);
        return response.data.message || response.data.data || response.data;
    } catch (error) {
        console.error("API Error (getCategoryById):", error);
        throw error.response?.data || error;
    }
};

/**
 * Updates a trek category by ID.
 * @param {String} id - The ID of the category.
 * @param {FormData} categoryData - The updated category data.
 * @returns {Promise<Object>} - The response from the server.
 */
export const updateCategory = async (id, categoryData) => {
    try {
        const response = await axiosInstance.put(`/trekCategory/${id}`, categoryData);
        return response.data;
    } catch (error) {
        console.error("API Error (updateCategory):", error);
        throw error.response?.data || error;
    }
};

/**
 * Deletes a trek category by ID.
 * @param {String} id - The ID of the category to delete.
 * @returns {Promise<Object>} - The response from the server.
 */
export const deleteCategory = async (id) => {
    try {
        const response = await axiosInstance.delete(`/trekCategory/${id}`);
        return response.data;
    } catch (error) {
        console.error("API Error (deleteCategory):", error);
        throw error.response?.data || error;
    }
};