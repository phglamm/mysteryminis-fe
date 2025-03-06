import api from "./api";

export const fetchBoxesHomePage = async (category) => {
  try {
    let url = `box`;

    const response = await api.get(url);
    if (category === "BestSeller") {
      return response.data.sort((a, b) => b.soldQuantity - a.soldQuantity);
    }
    return response.data || [];
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export const fetchBlindBoxCategories = async () => {
  try {
    const response = await api.get("brand");
    console.log("brand: ", response.data);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const fetchBoxesProductPage = async () => {
  try {
    const response = await api.get("box");
    console.log("API Response: ", response.data);

    if (Array.isArray(response.data || [])) {
      return response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt) || []
      );
    } else {
      console.error("API response is not an array: ", response.data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
    return [];
  }
};
