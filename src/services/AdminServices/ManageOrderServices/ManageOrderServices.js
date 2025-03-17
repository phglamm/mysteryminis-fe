import api from "../../../config/api";


export const fetchOrders = async () => {
  const response = await api.get("Order");
  return Array.isArray(response.data) ? response.data : response.data.orders;
};

export const refundOrderItem = async (orderItemId, values) => {
  const response = await api.put(`order-item/${orderItemId}/refund`, values);
  return response.data;
};

export const uploadOrderItemFiles = async (orderItemId, imgURLs) => {
  const response = await api.post(`OrderItem?orderItemId=${orderItemId}`, imgURLs);
  return response.data;
};
