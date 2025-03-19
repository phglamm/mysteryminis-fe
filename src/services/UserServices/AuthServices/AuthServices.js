import api from "../../../config/api";

export const resetPassword = async (data) => {
    try {
      const response = await api.post("Account/reset-password", data);
      return response.data;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  };

  export const registerUser = async (userData) => {
    try {
      const response = await api.post("Account/register", userData);
      return response.data;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  };

  export const loginUser = async (credentials) => {
    try {
      const response = await api.post("Account/Login", credentials);
      return response.data;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  };
  
  export const googleLogin = async (credentialToken) => {
    try {
      const response = await api.post("Account/google-login", {
        credentialToken,
      });
      return response.data;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  };

  export const confirmEmail = async (token, email) => {
    try {
      const response = await api.get(`Account/confirm-email?token=${token}&email=${email}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Email confirmation failed";
    }
  };