import api from "../../../config/api";

export const fetchBoxItems = async () => {
    try {
      const response = await api.get("BoxItem");
      return response.data.sort((a, b) => b.boxItemId - a.boxItemId);
    } catch (error) {
      console.error("Error fetching box items:", error);
      return [];
    }
  };
  
  export const addBoxItem = async (values) => {
    try {
      const response = await api.post("BoxItem", values);
      return response.data;
    } catch (error) {
      console.error("Failed to add BoxItem:", error);
      throw error;
    }
  };
  
  export const updateBoxItem = async (id, values) => {
    try {
      const response = await api.put(`BoxItem/${id}`, values);
      return response.data;
    } catch (error) {
      console.error("Failed to update BoxItem:", error);
      throw error;
    }
  };
  
  export const deleteBoxItem = async (id) => {
    try {
      await api.delete(`BoxItem/${id}`);
    } catch (error) {
      console.error("Failed to delete BoxItem:", error);
      throw error;
    }
  };