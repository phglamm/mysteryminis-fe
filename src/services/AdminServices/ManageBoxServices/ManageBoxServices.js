import api from "../../../config/api";

export const getAllBoxes = async () => {
    try {
      const response = await api.get("Box");
      return response.data.sort((a, b) => b.boxId - a.boxId);
    } catch (error) {
      console.error("Failed to fetch boxes:", error);
      throw error;
    }
  };
  
  
  export const addBox = async (boxData) => {
    try {
      const response = await api.post("Box", boxData);
      return response.data;
    } catch (error) {
      console.error("Failed to add Box:", error);
      throw error;
    }
  };
  
  export const updateBox = async (boxId, boxData) => {
    try {
      const response = await api.put(`Box/${boxId}`, boxData);
      return response.data;
    } catch (error) {
      console.error("Failed to update Box:", error);
      throw error;
    }
  };
  
  export const deleteBox = async (boxId) => {
    try {
      await api.delete(`Box/${boxId}`);
    } catch (error) {
      console.error("Failed to delete Box:", error);
      throw error;
    }
  };