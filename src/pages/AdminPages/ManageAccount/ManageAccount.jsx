import React, { useState } from "react";
import { Table, Button, Space, Modal, Input, Form, message, Tabs } from "antd";

const { TabPane } = Tabs;

const ManageAccount = () => {
  const [accounts, setAccounts] = useState([
    {
      key: "1",
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      role: "User",
      status: "Active",
    },
    {
      key: "2",
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "Staff",
      status: "Active",
    },
    {
      key: "3",
      id: 3,
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      role: "User",
      status: "Inactive",
    },
    {
      key: "4",
      id: 4,
      name: "Bob Brown",
      email: "bob.brown@example.com",
      role: "Staff",
      status: "Active",
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("User");

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this account?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        setAccounts(accounts.filter((account) => account.id !== id));
        message.success("Account deleted successfully");
      },
    });
  };

  const handleEdit = (record) => {
    setEditingAccount(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleAdd = () => {
    setEditingAccount(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        if (editingAccount) {
          setAccounts(
            accounts.map((account) =>
              account.id === editingAccount.id
                ? { ...account, ...values }
                : account
            )
          );
          message.success("Account updated successfully");
        } else {
          const newAccount = { key: Date.now(), id: Date.now(), ...values };
          setAccounts([...accounts, newAccount]);
          message.success("Account added successfully");
        }
        setIsModalVisible(false);
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
      });
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    { title: "Name", dataIndex: "name", key: "name", width: 200 },
    { title: "Email", dataIndex: "email", key: "email", width: 250 },
    { title: "Status", dataIndex: "status", key: "status", width: 120 },
    {
      title: "Action",
      key: "action",
      width: 180,
      render: (record) => (
        <Space>
          <Button
            type="primary"
            style={{
              backgroundColor: "#313857",
              borderColor: "#FFF1F2",
              color: "#FFF1F2",
            }}
            onClick={() => handleEdit(record)}
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
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 10 }}>
      <h2 style={{ fontSize: "30px" }}>Manage Accounts</h2>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="User" key="User">
          <Button
            type="primary"
            style={{
              marginBottom: 16,
              backgroundColor: "#313857 ",
              borderColor: "#FFF1F2 !important",
              color: "#FFF1F2 !important",
            }}
            onClick={handleAdd}
          >
            Create Account
          </Button>
          <div style={{ minHeight: "500px" }}>
            <Table
              columns={columns}
              dataSource={accounts.filter((account) => account.role === "User")}
              scroll={{ y: "calc(100vh - 300px)" }} // Giữ chiều cao cố định
            />
          </div>
        </TabPane>

        <TabPane tab="Staff" key="Staff">
          <Button
            type="primary"
            style={{
              marginBottom: 16,
              backgroundColor: "#313857",
              borderColor: "#FFF1F2",
              color: "#FFF1F2",
            }}
            onClick={handleAdd}
          >
            Create Account
          </Button>
          <div style={{ minHeight: "500px" }}>
            <Table
              columns={columns}
              dataSource={accounts.filter(
                (account) => account.role === "Staff"
              )}
              scroll={{ y: "calc(100vh - 300px)" }} // Giữ chiều cao cố định
            />
          </div>
        </TabPane>
      </Tabs>

      <Modal
        title={editingAccount ? "Edit Account" : "Create Account"}
        open={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
        okButtonProps={{
          style: {
            backgroundColor: "#313857",
            borderColor: "#FFF1F2",
            color: "#FFF1F2",
          },
        }}
        cancelButtonProps={{
          style: {
            backgroundColor: "#FF4D4F",
            borderColor: "#FF4D4F",
            color: "#FFF",
          },
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please enter role" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please enter status" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageAccount;
