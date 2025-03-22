import api from "../../../config/api";

export const fetchOnlineSeriesBoxes = async () => {
    try {
      const response = await api.get("online-serie-box");
      return response.data;
    } catch (error) {
      console.error("Error fetching online series boxes:", error);
      throw error; // Rethrow to handle in the component
    }
  };