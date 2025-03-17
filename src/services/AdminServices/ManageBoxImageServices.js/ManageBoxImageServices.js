import api from "../../../config/api";


// Fetch all box images
export const getAllBoxImages = async () => {
  try {
    const response = await api.get("BoxImage");
    return response.data.sort((a, b) => b.boxImageId - a.boxImageId);
  } catch (error) {
    console.error("Failed to fetch box images:", error);
    throw error;
  }
};

// Add a new box image
export const addBoxImage = async (boxImageData) => {
  try {
    const response = await api.post("BoxImage", boxImageData);
    return response.data;
  } catch (error) {
    console.error("Failed to add box image:", error);
    throw error;
  }
};

// Update a box image
export const updateBoxImage = async (boxImageId, boxImageData) => {
  try {
    const response = await api.put(`BoxImage/${boxImageId}`, boxImageData);
    return response.data;
  } catch (error) {
    console.error("Failed to update box image:", error);
    throw error;
  }
};

// Delete a box image
export const deleteBoxImage = async (boxImageId) => {
  try {
    await api.delete(`BoxImage/${boxImageId}`);
  } catch (error) {
    console.error("Failed to delete box image:", error);
    throw error;
  }
};
