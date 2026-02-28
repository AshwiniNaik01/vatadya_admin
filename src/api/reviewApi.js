import axiosInstance from "./axiosInstance";

/**
 * Fetches all reviews from the backend.
 * Uses GET /api/trek-reviews (assuming the base path is prepended by axiosInstance)
 */
export const getReviews = async () => {
    try {
        const response = await axiosInstance.get("/trekReview");
        return response.data;
    } catch (error) {
        console.error("API Error (getReviews):", error);
        throw error.response?.data || error;
    }
};

/**
 * Fetches reviews filtered by trek ID.
 * Uses GET /api/trek-reviews/trek/:trekId
 */
export const getReviewsByTrek = async (trekId) => {
    try {
        const response = await axiosInstance.get(`/trekReview/trek/${trekId}`);
        return response.data;
    } catch (error) {
        console.error("API Error (getReviewsByTrek):", error);
        throw error.response?.data || error;
    }
};

/**
 * Deletes a review by ID.
 * Uses DELETE /api/trek-reviews/:id
 */
export const deleteReview = async (id) => {
    try {
        const response = await axiosInstance.delete(`/trekReview/${id}`);
        return response.data;
    } catch (error) {
        console.error("API Error (deleteReview):", error);
        throw error.response?.data || error;
    }
};

/**
 * Adds a new review.
 * Uses POST /api/trek-reviews
 */
export const addReview = async (formData) => {
    try {
        const response = await axiosInstance.post("/trekReview", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        console.error("API Error (addReview):", error);
        throw error.response?.data || error;
    }
};

/**
 * Updates a review by ID.
 * Uses PUT /api/trek-reviews/:id
 */
export const updateReview = async (id, formData) => {
    try {
        const response = await axiosInstance.put(`/trekReview/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        console.error("API Error (updateReview):", error);
        throw error.response?.data || error;
    }
};
