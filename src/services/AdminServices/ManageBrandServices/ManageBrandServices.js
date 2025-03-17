import api from "../../../config/api";


export const fetchBrands = async () => {
  const response = await api.get("Brand");
  return response.data.sort((a, b) => b.brandId - a.brandId);
};

export const addBrand = async (values) => {
  const response = await api.post("Brand", values);
  return response.data;
};

export const updateBrand = async (brandId, values) => {
  const response = await api.put(`Brand/${brandId}`, values);
  return response.data;
};

export const deleteBrand = async (brandId) => {
  await api.delete(`Brand/${brandId}`);
};
