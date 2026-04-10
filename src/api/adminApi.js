import axiosInstance from "./axiosInstance";

/**
 * Registers a new admin user.
 * @param {FormData} formData - FormData containing admin registration data.
 * @returns {Promise<Object>} - The response data from the server.
 */
export const registerAdmin = async (data) => {
  try {
    const response = await axiosInstance.post(
      "/admin/register",
      {
        name: data.name,
        email: data.email,
        password: data.password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("API Error (registerAdmin):", error);
    throw error.response?.data || error;
  }
};

/**
 * Logs in an admin user.
 * @param {FormData} formData - FormData containing admin login data.
 * @returns {Promise<Object>} - The response data from the server.
 */

export const loginAdmin = async (data) => {
  try {
    const response = await axiosInstance.post(
      "/admin/login",
      {
        email: data.email,
        password: data.password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("API Error (loginAdmin):", error);
    throw error.response?.data || error;
  }
};

export const resetPassword = async (email, password) => {
  try {
    const response = await axiosInstance.post("/admin/forget-password", {
      email,
      newPassword: password,
    });
    return response.data;
  } catch (error) {
    console.error("API Error (resetPassword):", error);
    throw error.response?.data || error;
  }
};

export const updatePermissions = async (id, allowedTabs) => {
  try {
    const response = await axiosInstance.patch(
      `/admin/update-permissions/${id}`,
      {
        allowedTabs,
      },
    );
    return response.data;
  } catch (error) {
    console.error("API Error (updatePermissions):", error);
    throw error.response?.data || error;
  }
};

export const getAllAdmins = async () => {
  try {
    const response = await axiosInstance.get("/admin");
    return response.data;
  } catch (error) {
    console.error("API Error (getAllAdmins):", error);
    throw error.response?.data || error;
  }
};

export const sendOtp = async (email) => {
  try {
    const response = await axiosInstance.post(`/auth/send-otp`, { email });
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error.response?.data || error;
  }
};

export const verifyOtp = async (reference, otp) => {
  try {
    const response = await axiosInstance.post(`/auth/verify-otp`, {
      reference,
      otp,
    });
    return response.data;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error.response?.data || error;
  }
};
