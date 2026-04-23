import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const getAllCoupons = async () => {
  const response = await axios.get(`${API_URL}/coupons`);
  return response.data.data;
};

export const getCouponById = async (id) => {
  const response = await axios.get(`${API_URL}/coupons/${id}`);
  return response.data.data;
};

export const createCoupon = async (couponData) => {
  const response = await axios.post(`${API_URL}/coupons`, couponData);
  return response.data.data;
};

export const updateCoupon = async (id, couponData) => {
  const response = await axios.put(`${API_URL}/coupons/${id}`, couponData);
  return response.data.data;
};

export const deleteCoupon = async (id) => {
  const response = await axios.delete(`${API_URL}/coupons/${id}`);
  return response.data.data;
};

export const validateCoupon = async (couponCode, noOfBookings) => {
  const response = await axios.post(`${API_URL}/coupons/validate`, {
    name: couponCode,
    noOfBookings,
  });
  return response.data.data;
};
