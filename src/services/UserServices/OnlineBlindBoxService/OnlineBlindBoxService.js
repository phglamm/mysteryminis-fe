import api from "../../../config/api";

export const fetchBlindBox = async (packageId) => {
    try {
      const response = await api.get(`online-serie-box/${packageId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching blind box:", error);
      throw error;
    }
  };
  