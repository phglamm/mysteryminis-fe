import React, { useState, useEffect } from "react";
import { Table, Button, Space, Tabs } from "antd";
import api from "../../../config/api";
import dayjs from "dayjs"; // Import thư viện format ngày giờ

const { TabPane } = Tabs;

const statusMap = {
  0: "PROCESSING",
  1: "ARRIVED",
  2: "REFUND",
  3: "CANCELLED",
};

const ManageOrder = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("PROCESSING");

  const fetchOrders = async () => {
    try {
      const response = await api.get("Order");
      console.log("API Response:", response.data);
      
      if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else if (response.data.orders) {
        setOrders(response.data.orders);
      } else {
        console.error("Unexpected data format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const columns = [
    { title: "Order Number", dataIndex: "orderId", key: "orderId" },
    { 
      title: "Date Time", 
      dataIndex: "orderCreatedAt", 
      key: "orderCreatedAt",
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"), // Format ngày giờ
      sorter: (a, b) => dayjs(b.orderCreatedAt).unix() - dayjs(a.orderCreatedAt).unix(), // Sắp xếp theo ngày mới nhất
    },
    { title: "Customer ID", dataIndex: "userId", key: "userId" }, 
    { 
      title: "Items", 
      dataIndex: "orderItems", 
      key: "items",
      render: (items) => items ? items.length : 0,
    },
    { title: "Total", dataIndex: "totalPrice", key: "totalPrice" },
    { 
      title: "Order Status", 
      dataIndex: "currentStatusId", 
      key: "orderStatus",
      render: (status) => statusMap[status] || "UNKNOWN"
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="primary" style={{ backgroundColor: "#313857", color: "#FFF1F2" }}>
            Update
          </Button>
          <Button type="default" style={{ backgroundColor: "#ff4d4f", color: "#fff" }}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  // Lọc và sắp xếp đơn hàng theo ngày mới nhất
  const filteredData = orders
    .filter(order => statusMap[order.currentStatusId] === activeTab)
    .sort((a, b) => dayjs(b.orderCreatedAt).unix() - dayjs(a.orderCreatedAt).unix()); // Sắp xếp giảm dần

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ fontSize: "30px" }}>Manage Orders</h2>
      <Button type="primary" style={{ marginBottom: 16, backgroundColor: "#313857", color: "#FFF1F2" }} onClick={fetchOrders}>
        Refresh Orders
      </Button>
      <Tabs defaultActiveKey="PROCESSING" onChange={setActiveTab}>
        <TabPane tab="Processing" key="PROCESSING" />
        <TabPane tab="Arrived" key="ARRIVED" />
        <TabPane tab="Refund" key="REFUND" />
        <TabPane tab="Cancelled" key="CANCELLED" />
      </Tabs>
      <Table 
        columns={columns} 
        dataSource={filteredData} 
        rowKey="orderId" 
        pagination={{ pageSize: 10 }} // Phân trang 10 đơn hàng mỗi trang
      />
    </div>
  );
};

export default ManageOrder;
