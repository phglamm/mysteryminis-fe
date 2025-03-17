import api from "../../../config/api";

export const getRevenueData = async () => {
    try {
      const response = await api.get("dashboard/revenue");
      return response.data.monthlyData;
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      throw error;
    }
  };

  export const getBestSellers = async () => {
    try {
      const response = await api.get("Dashboard/bestSellers");
      return response.data;
    } catch (error) {
      console.error("Error fetching best sellers:", error);
      throw error;
    }
  };