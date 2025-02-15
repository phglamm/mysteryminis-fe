import React from "react";
import { Table, Button, Space } from "antd";

const ManageOrder = () => {
  const columns = [
    { title: "Order Number", dataIndex: "orderNumber", key: "orderNumber" },
    { title: "Date Time", dataIndex: "dateTime", key: "dateTime" },
    { title: "Customer Name", dataIndex: "customerName", key: "customerName" },
    { title: "Items", dataIndex: "items", key: "items" },
    { title: "Total", dataIndex: "total", key: "total" },
    { title: "Order Status", dataIndex: "orderStatus", key: "orderStatus" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Space>
            <Button
              type="primary"
              style={{
                backgroundColor: "#313857",
                borderColor: "#FFF1F2",
                color: "#FFF1F2",
              }}
            >
              Update
            </Button>
            <Button
              type="default"
              style={{
                backgroundColor: "#ff4d4f",
                borderColor: "#ff4d4f",
                color: "#fff",
              }}
            >
              Delete
            </Button>
          </Space>
        </>
      ),
    },
  ];

  const data = [
    {
      orderNumber: 1,
      dateTime: "2025-02-15 12:00",
      customerName: "John Doe",
      items: 3,
      total: "$150",
      orderStatus: "Pending",
    },
    {
      orderNumber: 2,
      dateTime: "2025-02-15 13:30",
      customerName: "Jane Smith",
      items: 2,
      total: "$80",
      orderStatus: "Completed",
    },
    {
      orderNumber: 3,
      dateTime: "2025-02-15 14:45",
      customerName: "Michael Johnson",
      items: 5,
      total: "$200",
      orderStatus: "Shipped",
    },
    {
      orderNumber: 4,
      dateTime: "2025-02-15 15:20",
      customerName: "Emily Davis",
      items: 1,
      total: "$50",
      orderStatus: "Cancelled",
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ fontSize: "30px" }}>Manage Orders</h2>
      <Button
        type="primary"
        style={{
          marginBottom: 16,
          backgroundColor: "#313857 ",
          borderColor: "#FFF1F2 !important",
          color: "#FFF1F2 !important",
        }}
      >
        Create Order
      </Button>
      <Table columns={columns} dataSource={data} rowKey="orderNumber" />
    </div>
  );
};

export default ManageOrder;
