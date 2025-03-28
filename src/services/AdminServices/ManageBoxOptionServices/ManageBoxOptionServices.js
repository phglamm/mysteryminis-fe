import api from "../../../config/api";

export const fetchBoxOptions = async () => {
  const response = await api.get("BoxOption");
  return response.data.sort((a, b) => b.boxOptionId - a.boxOptionId);
};

export const fetchLuckyBoxes = async () => {
  const response = await api.get("online-serie-box");
  return response.data.sort((a, b) => b.onlineSerieBoxId - a.onlineSerieBoxId);
};

export const addBoxOption = async (values) => {
  const response = await api.post("BoxOption", values);
  return response.data;
};

export const updateBoxOption = async (id, values) => {
  const response = await api.put(`BoxOption/${id}`, values);
  return response.data;
};

export const deleteBoxOption = async (id) => {
  return api.delete(`BoxOption/${id}`);
};

export const publishLuckyBox = async (boxOptionId, newStatus) => {
  const response = await api.put(
    `online-serie-box/${boxOptionId}/publish?status=${newStatus}`
  );
  return response.data;
};

export const addLuckyBox = async (values) => {
  const response = await api.post("online-serie-box/create", values);
  return response.data;
};

export const updateLuckyBox = async (id, values) => {
  const response = await api.put(`online-serie-box/${id}`, values);
  return response.data;
};
