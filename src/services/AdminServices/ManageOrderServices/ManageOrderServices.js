import api from "../../../config/api";

export const fetchOrders = async () => {
  const response = await api.get("Order");
  return Array.isArray(response.data) ? response.data : response.data.orders;
};

export const refundOrderItem = async (orderItemId, values) => {
  const response = await api.put(`order-item/${orderItemId}/refund`, values);
  return response.data;
};

export const refundOrderItemDetail = async (orderItemId, values) => {
  const response = await api.put(
    `order-item/${orderItemId}/refund/details`,
    values
  );
  console.log(response.data);
  return response.data;
};

export const uploadOrderItemFiles = async (orderItemId, imgURLs) => {
  const response = await api.post(
    `order-item?orderItemId=${orderItemId}`,
    imgURLs
  );
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await api.put(`Shipping/order/${orderId}?status=${status}`);
  return response.data;
};
