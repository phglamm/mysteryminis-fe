
import api from "./api";


export const fetchBoxesHomePage = async (category) => {
    try {
      let url =
        `Box/allbox`;
      if (category === "BestSeller") {
        url =
         `Box/best-seller-box?quantityWantToGet=10`;
      }
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  export const fetchBlindBoxCategories = async () => {
      try {
        const response = await api.get("Brand");
        return response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    export const fetchBoxesProductPage = async () => {
      try {
        const response = await api.get("Box");
        console.log("API Response: ", response.data);
    
        if (Array.isArray(response.data)) {
          return response.data.sort((a, b) => b.boxId - a.boxId);
        } else {
          console.error("API response is not an array: ", response.data);
          return [];
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
        return [];
      }
    };
    

    