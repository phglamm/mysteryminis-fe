import api from "../../../config/api";

export const fetchUserRolledItems = async (userId) => {
  try {
    const response = await api.get(`/UserRolledItem/${userId}`);
    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (err) {
    console.error(err.message);
    return [];
  }
};
