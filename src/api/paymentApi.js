import axiosInstance from "./axiosInstance";

/**
 * Fetches all payments/bookings with payment details.
 */
export const getAllPayments = async () => {
    try {
        // Assuming there's a route to get all bookings/payments
        const response = await axiosInstance.get("/payments");
        return response.data;
    } catch (error) {
        console.error("API Error (getAllPayments):", error);
        throw error.response?.data || error;
    }
};

/**
 * Creates a Razorpay order.
 * @param {Number} amount - The amount to be paid.
 */
export const createPaymentOrder = async (amount) => {
    try {
        const response = await axiosInstance.post("/payments/create-order", { amount });
        return response.data;
    } catch (error) {
        console.error("API Error (createPaymentOrder):", error);
        throw error.response?.data || error;
    }
};

/**
 * Verifies a Razorpay payment.
 * @param {Object} paymentData - The payment verification data.
 */
export const verifyPayment = async (paymentData) => {
    try {
        const response = await axiosInstance.post("/payments/verify-payment", paymentData);
        return response.data;
    } catch (error) {
        console.error("API Error (verifyPayment):", error);
        throw error.response?.data || error;
    }
};
