
import axios from "axios";
import api from "../../../config/api";

const GHN_TOKEN = "62417330-f6d2-11ef-91ea-021c91d80158";
const GHN_HEADERS = {
  Token: GHN_TOKEN,
  "Content-Type": "application/json",
};

export const getUserAddresses = async (userId) => {
  try {
    const response = await api.get(`/Address/?userId=${userId}`);
    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (err) {
    console.error(err.message);
    return [];
  }
};

export const fetchProvinces = async () => {
  try {
    const response = await axios.get(
      "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
      { headers: GHN_HEADERS }
    );
    return response.data.code === 200 ? response.data.data : [];
  } catch (err) {
    console.error("Error fetching provinces:", err);
    return [];
  }
};

export const fetchDistricts = async (provinceId) => {
  try {
    const response = await axios.get(
      "https://online-gateway.ghn.vn/shiip/public-api/master-data/district",
      { headers: GHN_HEADERS }
    );
    return response.data.code === 200
      ? response.data.data.filter((d) => d.ProvinceID === provinceId)
      : [];
  } catch (err) {
    console.error("Error fetching districts:", err);
    return [];
  }
};

export const fetchWards = async (districtId) => {
  if (!districtId) return [];

  try {
    const response = await axios.get(
      "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward",
      { params: { district_id: districtId }, headers: GHN_HEADERS }
    );
    return response.data.code === 200 ? response.data.data : [];
  } catch (err) {
    console.error("Error fetching wards:", err);
    return [];
  }
};

export const addAddress = async (formData) => {
  try {
    const response = await api.post("Address", formData);
    return response.data;
  } catch (error) {
    console.error("Error adding address:", error);
    throw new Error("Failed to add address");
  }
};

export const updateAddress = async (formData) => {
    try {
      await api.put(`Address`, formData);
      return { success: true };
    } catch (err) {
      console.error("Error updating address:", err);
      return { success: false };
    }
  };
