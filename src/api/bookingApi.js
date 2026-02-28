import axiosInstance from "./axiosInstance";

/**
 * Creates a new trek booking.
 * @param {Object} bookingData - The booking data.
 * @returns {Promise<Object>} - The response from the server.
 */
export const createBooking = async (bookingData) => {
    try {
        const response = await axiosInstance.post("/bookings", bookingData);
        return response.data;
    } catch (error) {
        console.error("API Error (createBooking):", error);
        throw error.response?.data || error;
    }
};

/**
 * Fetches all bookings.
 * @returns {Promise<Object>} - Response containing booking data.
 */
export const getAllBookings = async () => {
    try {
        const response = await axiosInstance.get("/bookings");
        return response.data;
    } catch (error) {
        console.error("API Error (getAllBookings):", error);
        throw error.response?.data || error;
    }
};

/**
 * Fetches a single booking by ID.
 * @param {String} id - The ID of the booking.
 * @returns {Promise<Object>} - The booking data.
 */
export const getBookingById = async (id) => {
    try {
        const response = await axiosInstance.get(`/bookings/${id}`);
        return response.data;
    } catch (error) {
        console.error("API Error (getBookingById):", error);
        throw error.response?.data || error;
    }
};

/**
 * Updates a booking by ID.
 * @param {String} id - The ID of the booking.
 * @param {Object} bookingData - The updated booking data.
 * @returns {Promise<Object>} - The response from the server.
 */
export const updateBooking = async (id, bookingData) => {
    try {
        const response = await axiosInstance.put(`/bookings/${id}`, bookingData);
        return response.data;
    } catch (error) {
        console.error("API Error (updateBooking):", error);
        throw error.response?.data || error;
    }
};

/**
 * Deletes a booking by ID.
 * @param {String} id - The ID of the booking to delete.
 */
export const deleteBooking = async (id) => {
    try {
        const response = await axiosInstance.delete(`/bookings/${id}`);
        return response.data;
    } catch (error) {
        console.error("API Error (deleteBooking):", error);
        throw error.response?.data || error;
    }
};
