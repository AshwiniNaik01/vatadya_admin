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
      }
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
      }
    );

    return response.data;
  } catch (error) {
    console.error("API Error (loginAdmin):", error);
    throw error.response?.data || error;
  }
};
// export const loginAdmin = async (formData) => {
//   try {
//     const response = await axiosInstance.post("/admin/login", formData);
//     return response.data;
//   } catch (error) {
//     console.error("API Error (loginAdmin):", error);
//     throw error.response?.data || error;
//   }
// };
