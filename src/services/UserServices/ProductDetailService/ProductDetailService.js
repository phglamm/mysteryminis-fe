import api from "../../../config/api";

export const fetchBoxDetail = async (id) => {
    try {
      const response = await api.get(`Box/withDTO/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching box details:", error);
      throw error; // Rethrow so the caller can handle it
    }
  };