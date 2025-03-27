import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Tag,
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  message,
} from "antd";
import api from "../../../config/api";
import dayjs from "dayjs";

const ManageVoucher = () => {
  const [vouchers, setVouchers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const response = await api.get("Voucher");
      setVouchers(response.data);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    }
  };

  const handleCreate = async (values) => {
    try {
      const formattedValues = {
        voucherName: values.voucherName,
        voucherDiscount: values.voucherDiscount,
        voucherStartDate: values.voucherStartDate.toISOString(),
        voucherEndDate: values.voucherEndDate.toISOString(),
        maxDiscount: values.maxDiscount,
        numOfVoucher: values.numOfVoucher,
      };

      if (editingVoucher) {
        // Update API
        await api.put(`Voucher/${editingVoucher.voucherId}`, formattedValues);
        message.success("Voucher updated successfully!");
      } else {
        // Create API
        await api.post("Voucher", formattedValues);
        message.success("Voucher added successfully!");
      }

      fetchVouchers();
      setIsModalVisible(false);
      form.resetFields();
      setEditingVoucher(null);
    } catch (error) {
      console.error("Error saving voucher:", error);
      message.error("Failed to save voucher. Please try again.");
    }
  };

  const showEditModal = (voucher) => {
    setEditingVoucher(voucher);
    form.setFieldsValue({
      ...voucher,
      voucherStartDate: voucher.voucherStartDate
        ? dayjs(voucher.voucherStartDate)
        : null,
      voucherEndDate: voucher.voucherEndDate
        ? dayjs(voucher.voucherEndDate)
        : null,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (voucherId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this voucher?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await api.delete(`Voucher/${voucherId}`);
          message.success("Voucher deleted successfully!");
          fetchVouchers(); // Reload danh sách voucher sau khi xóa
        } catch (error) {
          console.error("Error deleting voucher:", error);
          message.error("Failed to delete voucher.");
        }
      },
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "voucherId",
      key: "voucherId",
      defaultSortOrder: "ascend",
      sorter: (a, b) => b.voucherId - a.voucherId, // Sorting from largest to smallest
    },
    {
      title: "Name",
      dataIndex: "voucherName",
      key: "voucherName",
      filters: [
        ...new Set(
          vouchers.map((voucher) => ({
            text: voucher.voucherName,
            value: voucher.voucherName,
          }))
        ),
      ], // 👈 Auto-generate filters
      onFilter: (value, record) => record.voucherName === value,
      filterSearch: true,
    },
    {
      title: "Discount",
      dataIndex: "voucherDiscount",
      key: "voucherDiscount",
      render: (discount) => `${discount}%`,
      sorter: (a, b) => a.voucherDiscount - b.voucherDiscount, // Sorting from largest to smallest
    },
    {
      title: "Start Date",
      dataIndex: "voucherStartDate",
      key: "voucherStartDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "End Date",
      dataIndex: "voucherEndDate",
      key: "voucherEndDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Max Discount",
      dataIndex: "maxDiscount",
      key: "maxDiscount",
      render: (amount) => `${amount.toLocaleString()}₫`,
    },
    {
      title: "Number of Vouchers",
      dataIndex: "numOfVoucher",
      key: "numOfVoucher",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            onClick={() => showEditModal(record)}
            style={{
              backgroundColor: "#313857",
              borderColor: "#FFF1F2",
              color: "#FFF1F2",
              marginRight: 8,
            }}
          >
            Update
          </Button>
          <Button
            type="default"
            onClick={() => handleDelete(record.voucherId)}
            style={{
              backgroundColor: "#ff4d4f",
              borderColor: "#ff4d4f",
              color: "#fff",
            }}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 20, maxWidth: "100%", overflowX: "auto" }}>
      <h2 style={{ fontSize: "30px" }}>Manage Vouchers</h2>
      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)}
        style={{
          marginBottom: 16,
          backgroundColor: "#313857",
          borderColor: "#FFF1F2",
          color: "#FFF1F2",
        }}
      >
        Create Voucher
      </Button>
      <Table columns={columns} dataSource={vouchers} rowKey="voucherId" />

      <Modal
        title={editingVoucher ? "Update Voucher" : "Create Voucher"}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingVoucher(null);
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            name="voucherName"
            label="Voucher Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="voucherDiscount"
            label="Discount (%)"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} max={100} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="voucherStartDate"
            label="Start Date"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="voucherEndDate"
            label="End Date"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="maxDiscount"
            label="Max Discount ($)"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="numOfVoucher"
            label="Number of Vouchers"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
          >
            <Button
              style={{
                backgroundColor: "#ff4d4f",
                borderColor: "#ff4d4f",
                color: "#fff",
              }}
              onClick={() => setIsModalVisible(false)}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: "#313857",
                borderColor: "#FFF1F2",
                color: "#FFF1F2",
              }}
            >
              OK
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageVoucher;
