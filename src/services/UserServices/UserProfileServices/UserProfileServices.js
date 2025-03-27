import api from "../../../config/api";


export const fetchUserData = async (email) => {
  try {
    const response = await api.get(`User/user-by-email/${email}`);
    return response.data; // Return only the necessary data
  } catch (err) {
    console.error("Error fetching user data:", err);
    throw new Error(err.message);
  }
};

export const updateUserProfile = async (formData) => {
  try {
    const response = await api.put(`User/update-profile`, formData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (err) {
    console.error("Error updating profile:", err);
    throw new Error("Failed to update profile. Please try again.");
  }
};

export const resetUserPassword = async (passwordData) => {
  console.log("Password data:", passwordData); // Log the password data for debugging
  try {
    const response = await api.post(`Account/change-password`, passwordData);

    return response.data;
  } catch (error) {
    console.error('Error resetting password:', error.response?.data.errors[0].description);
    throw error.response?.data;
  }
};
