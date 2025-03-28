import api from "../../../config/api";

export const getAllUsers = async () => {
    try {
      const response = await api.get("User/all-users");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch accounts:", error);
      throw error;
    }
  };

  export const registerAccount = async (payload) => {
    try {
      const response = await api.post("Account/register", payload);
      return response.data;
    } catch (error) {
      console.error("Failed to register account:", error);
      throw error;
    }
  };

  // Update Account
export const updateAccount = async (payload) => {
  try {
    // Making a PUT request to update the account information
    const response = await api.put("User/update-profile", payload);
    return response.data;
  } catch (error) {
    console.error("Failed to update account:", error);
    throw error;
  }
};


export const updateAccountStatus = async (userId, status) => {
  try {
    const response = await api.put(`User/${userId}/active-status`, null, {
      params: { status },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update account status:", error);
    throw error;
  }
};
