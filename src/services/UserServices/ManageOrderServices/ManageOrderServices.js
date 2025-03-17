import api from "../../../config/api";


export const fetchOrders = async () => {
  try {
    const response = await api.get("Order");
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const cancelOrder = async (orderId) => {
  try {
    const response = await api.put(`Order/cancel/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error canceling order:", error);
    throw error;
  }
};

export const requestRefund = async (orderItemId) => {
  try {
    const response = await api.put(`order-item/${orderItemId}/refund-request`);
    return response.data;
  } catch (error) {
    console.error("Error requesting refund:", error);
    throw error;
  }
};
