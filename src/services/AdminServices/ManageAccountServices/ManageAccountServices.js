import api from "../../../config/api";

export const getAllUsers = async () => {
    try {
      const response = await api.get("User/all-users");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch accounts:", error);
      throw error;
    }
  };